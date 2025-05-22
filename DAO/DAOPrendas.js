"use strict";


const pool = require('../conexion');
const ParametrosDAO = require("./DAOParametrosPrendas");
const parametros = new ParametrosDAO();
class DAOPrenda {
//crear prenda
create(data, callback) {

        const query = "INSERT INTO PRENDAS (foto,activo,categoria_id,tipo_id) VALUES (?,?,?,?)"
        var params = [
            data.foto,
            data.activo,
            data.categoria_id,
            data.tipo_id,
        ];

        // Utiliza el pool de conexiones para manejar la conexión a la base de datos
        pool(function (connection) {

            connection.query(query, params, (error, resultados) => {

                if (error) {
                    callback(error, null);
                } else {
                    //añadir al armario del usuario
                    const prendaId = resultados.insertId;
                    const queryArmario = "INSERT INTO ARMARIO (usuario_id, prenda_id, fecha) VALUES (?, ?, ?)";
                    const paramsArmario = [
                        data.usuario,
                        prendaId,
                        new Date()
                    ];

                    connection.query(queryArmario, paramsArmario, (error, resultados) => {

                        if (error) {//error al añadir al armario
                            connection.release();
                            callback(error, null);
                        } else {
                            // añadir estilos
                            parametros.addEstilosToPrenda(prendaId, data.estilos, (error) => {
                                if (error) {
                                    connection.release();
                                    return callback(error, null);
                                }
                                // añadir colores
                                parametros.addColoresToPrenda(prendaId, data.colores, (error) => {
                                    if (error) {
                                        connection.release();
                                        return callback(error, null);
                                    }
                                    //añadir estaciones
                                    parametros.addEstacionesToPrenda(prendaId, data.estacion, (error) => {
                                        connection.release();
                                        if (error) {
                                            return callback(error, null);
                                        }
                                        callback(null, prendaId);//añadido con exito
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
}
//obetener prenda por usuario
getPrendaByUsuario(userId, callback) {
        const query = `
        SELECT p.*, c.nombre AS categoria, t.nombre AS tipo, 
        GROUP_CONCAT(e.nombre) AS estaciones
        FROM PRENDAS p
        JOIN Armario a ON p.id_prenda = a.prenda_id
        JOIN Categorias c ON p.categoria_id = c.id
        JOIN Tipos t ON p.tipo_id = t.id
        LEFT JOIN Prenda_Estacion pe ON p.id_prenda = pe.prenda_id
        LEFT JOIN Estaciones e ON pe.estacion_id = e.id
        WHERE a.usuario_id = ? AND p.activo = 1
        GROUP BY p.id_prenda
    `;
        const params = [userId];
        // Utiliza el pool de conexiones para manejar la conexión a la base de datos
        pool(function (connection) {
            
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    if (resultados.length > 0) {
                        callback(null, resultados);
                    } else {
                        callback(null, null);
                    }
                }
            });
        });
}
//obtener prenda por id
getPrendaById(prendaId, usuarioId, callback) {
    
        const queryPrenda = `
        SELECT p.*, 
               c.nombre AS categoria, 
               t.nombre AS tipo
        FROM PRENDAS p
        JOIN Armario a ON p.id_prenda = a.prenda_id
        JOIN Categorias c ON p.categoria_id = c.id
        JOIN Tipos t ON p.tipo_id = t.id
        WHERE a.usuario_id = ? 
          AND p.id_prenda = ?
          AND p.activo = 1
        GROUP BY p.id_prenda
    `;
       //obtener los colores 
        const queryColores = `
            SELECT co.id, co.nombre, co.hex
            FROM Prenda_Color pc
            JOIN Colores co ON pc.color_id = co.id
            WHERE pc.prenda_id = ? AND pc.activo=1
            `;

        //obtener los estilos 
        const queryEstilos = `
            SELECT E.id, E.nombre 
            FROM ESTILOS E 
            JOIN PRENDA_ESTILO PE ON E.id = PE.estilo_id 
            WHERE PE.prenda_id = ? AND PE.activo=1
            `;
        //obtener las estaciones
        const queryEstaciones = `
            SELECT e.id, e.nombre
            FROM Estaciones e
            JOIN Prenda_Estacion pe ON e.id = pe.estacion_id
            WHERE pe.prenda_id = ? AND pe.activo=1
        `;

        // definimos cada parametro
        const params = [usuarioId, prendaId];
        const paramsEstilos = [prendaId];
        const paramsColores = [prendaId];
        const paramsEstaciones = [prendaId];

       
        pool(function (connection) {
            //consulta de la prenda
            connection.query(queryPrenda, params, (error, prendaResultados) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                if (prendaResultados.length === 0) {//no se encontro la prenda
                    connection.release();
                    return callback(null, null);
                }

                const prenda = prendaResultados[0];

                // consulta de las estaciones
                connection.query(queryEstaciones, paramsEstaciones, (error, estacionesResultados) => {
                    if (error) {
                        connection.release();
                        console.log("Error al obtener las estaciones.", error);
                        return callback(error, null);
                    }
                    prenda.estaciones = estacionesResultados;

                    // consulta de los colores
                    connection.query(queryColores, paramsColores, (error, coloresResultados) => {
                        if (error) {
                            connection.release();
                            console.log("Error al obtener los colores.", error);
                            return callback(error, null);
                        }
                        prenda.colores = coloresResultados;

                        // consulta de los estilos
                        connection.query(queryEstilos, paramsEstilos, (error, estilosResultados) => {
                            connection.release(); 
                            if (error) {
                          
                                return callback(error, null);
                            }

                            prenda.estilos = estilosResultados;

                            callback(null, prenda);//devuelvo la prenda
                        });
                    });
                });
            });
        });
}
//borrar prenda
deletePrenda(id, callback) {
        //actualizar tabla principal y tablas intermedias
        const queries = [
            { query: "UPDATE prendas SET ACTIVO = 0 WHERE id_prenda = ?", params: [id] },
            { query: "UPDATE prenda_color SET ACTIVO = 0 WHERE prenda_id = ?", params: [id] },
            { query: "UPDATE prenda_estilo SET ACTIVO = 0 WHERE prenda_id = ?", params: [id] },
            { query: "UPDATE prenda_estacion SET ACTIVO = 0 WHERE prenda_id = ?", params: [id] }
        ];

        // Utiliza el pool de conexiones para manejar la conexión a la base de datos
        pool(function (connection) {
            const executeQuery = (index) => {
                if (index >= queries.length) {
                    connection.release();
                    callback(null, id);
                    return;
                }

                const { query, params } = queries[index];
                connection.query(query, params, (error) => {
                    if (error) {
                        connection.release();
                        callback(error, null);
                        return;
                    }
                    executeQuery(index + 1);//ejecuta las queries
                });
            };
            executeQuery(0);
        });
}
//filtrar prendas
filter(data, callback) {
        const { colores, estaciones, estilos,userId } = data;
        let query = `
        SELECT DISTINCT p.* 
        FROM prendas p
        LEFT JOIN prenda_color pc ON p.id_prenda = pc.prenda_id AND pc.activo = 1
        LEFT JOIN prenda_estacion pe ON p.id_prenda = pe.prenda_id
        LEFT JOIN prenda_estilo pes ON p.id_prenda = pes.prenda_id AND pes.activo = 1
        LEFT JOIN armario a ON a.prenda_id=p.id_prenda
        WHERE p.activo = 1 AND a.usuario_id = ?
    `;
    let queryParams = [userId];
        pool(function (connection) {
          
            if (colores && colores.length > 0) {
                query += ' AND pc.color_id IN (?)';
                queryParams.push(colores);
            }

            if (estaciones && estaciones.length > 0) {
                query += ' AND pe.estacion_id IN (?)';
                queryParams.push(estaciones);
            }

            if (estilos && estilos.length > 0) {
                query += ' AND pes.estilo_id IN (?)';
                queryParams.push(estilos);
            }

            connection.query(query, queryParams, (error, results) => {
               connection.release(); 
               if (error) {
                    return callback(error,null);
                }
                callback(null, results);
            });

        });
}
//buscar prendas
search(data, callback) {
        const { query,userId } = data;
        let sqlQuery = `
            SELECT DISTINCT p.* 
            FROM prendas p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN tipos t ON p.tipo_id = t.id
            LEFT JOIN prenda_color pc ON p.id_prenda = pc.prenda_id
            LEFT JOIN colores col ON pc.color_id = col.id
            LEFT JOIN prenda_estilo pes ON p.id_prenda = pes.prenda_id
            LEFT JOIN estilos e ON pes.estilo_id = e.id
            LEFT JOIN armario a ON a.prenda_id = p.id_prenda
            WHERE p.activo = 1 AND a.usuario_id = ?
        `;
        const queryParams = [userId];

        if (query) {
            sqlQuery += ` 
                AND (
                    c.nombre LIKE ? OR
                    t.nombre LIKE ? OR
                    col.nombre LIKE ? OR
                    e.nombre LIKE ?
                )
            `;
            const likeQuery = `%${query}%`;
            queryParams.push(likeQuery, likeQuery, likeQuery, likeQuery);
        }

        // Ejecutar la consulta
        pool(function (connection) {
            connection.query(sqlQuery, queryParams, (error, results) => {
                connection.release();
                if (error) {
                    return callback(error,null);
                }
                callback(null, results);
            });
        });
}
//actualizar prenda
update(prendaId, field, value, callback) {
    let queryPrenda;
    let paramsPrenda;

    //para actualizar categoria o tipo
        switch (field) {
            case 'categoria':
                queryPrenda = `UPDATE prendas SET categoria_id = ? WHERE id_prenda = ?`;
                paramsPrenda = [value, prendaId];
                break;
            case 'tipo':
                queryPrenda = `UPDATE prendas SET tipo_id = ? WHERE id_prenda = ?`;
                paramsPrenda = [value, prendaId];
                break;
            default:
                return callback(null, null);
        }
     
        pool(function (connection) {
            connection.query(queryPrenda, paramsPrenda, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                }
                return callback(null, resultados);
            });
        });
}

//FUNCIONES PARA ESTADISTICAS
//contar num prendas
countPrendasByUsuario(userId, callback) {
        const query = `
            SELECT COUNT(*) AS total
            FROM PRENDAS p
            JOIN ARMARIO a ON p.id_prenda = a.prenda_id
            WHERE a.usuario_id = ? AND p.activo = 1
        `;
        const params = [userId];
    
        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } else {
                    callback(null, resultados[0].total);
                }
            });
        });
}
//obtener fecha de creacion de prenda
getFechasDePrendasByUsuario(userId, callback) {
        const query = `
            SELECT p.id_prenda, p.foto, a.fecha
            FROM PRENDAS p
            JOIN ARMARIO a ON p.id_prenda = a.prenda_id
            WHERE a.usuario_id = ? AND p.activo = 1
        `;
        pool(function (connection) {
            connection.query(query, [userId], (error, results) => {
                connection.release();
                if (error){
                  return callback(error,null);  
                } 
                callback(null, results);
            });
        });
}
//obetener estilos preferidos
getEstilosPreferidosByUsuario(userId, callback) {
    const query = `
        SELECT e.nombre, COUNT(*) AS cantidad
        FROM prendas p
        JOIN armario a ON a.prenda_id = p.id_prenda
        JOIN prenda_estilo pe ON p.id_prenda = pe.prenda_id
        JOIN estilos e ON pe.estilo_id = e.id
        WHERE a.usuario_id = ? AND p.activo = 1
        GROUP BY e.nombre
        ORDER BY cantidad DESC
    `;
 
    pool(function (connection) {
        connection.query(query, [userId], (error, results) => {
            connection.release();
            if (error){
                return callback(error,null);
            } 
            callback(null, results);
        });
    });
};
//obtener estaciones preferidas
getEstacionesPreferidasByUsuario(userId, callback) {
    const query = `
         SELECT es.nombre, COUNT(*) AS cantidad
        FROM PRENDAS p
        JOIN ARMARIO a ON a.prenda_id = p.id_prenda
        JOIN PRENDA_ESTACION pe ON p.id_prenda = pe.prenda_id
        JOIN ESTACIONES es ON pe.estacion_id = es.id
        WHERE a.usuario_id = ? AND p.activo = 1 AND pe.activo = 1
        GROUP BY es.nombre
        ORDER BY cantidad DESC
    `;

    pool(function (connection) {
        connection.query(query, [userId], (error, results) => {
            connection.release();
            if (error){
                 return callback(error,null);
            }
            callback(null, results);
        });
    });
};
//obtener colores preferidos    
getColoresPreferidosByUsuario(userId, callback) {
        const query = `
            SELECT col.nombre AS color, col.hex, COUNT(*) AS cantidad
            FROM PRENDA_COLOR pc
            JOIN COLORES col ON pc.color_id = col.id
            JOIN PRENDAS p ON pc.prenda_id = p.id_prenda
            JOIN ARMARIO a ON a.prenda_id = p.id_prenda
            WHERE a.usuario_id = ? AND p.activo = 1 AND pc.activo = 1
            GROUP BY col.id
            ORDER BY cantidad DESC
        `;
        const params = [userId];
    
        pool(function (connection) {
            connection.query(query, params, (error, results) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                }
                callback(null, results);
            });
        });
}
}

module.exports = DAOPrenda;