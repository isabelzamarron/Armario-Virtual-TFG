"use strict";
const pool = require('../conexion');
const ParametrosDAO = require("./DAOParametrosOutfits");
const parametros = new ParametrosDAO();
class DAOOutfit {

//crear outfit
create(data, callback) {
    const query = `
        INSERT INTO outfits (nombre, activo,foto,publico) 
        VALUES (?, ?,?,?)
    `;
    const params = [data.nombre, 1,data.foto,data.publico];

    pool(function (connection) {
        connection.query(query, params, (error, resultados) => {
            if (error) {
                connection.release();
                return callback(error, null);
            } else {
                const outfitId = resultados.insertId;
                const queryArmario = "INSERT INTO armario_outfits (usuario_id, outfit_id, fecha) VALUES (?, ?, ?)";
                const paramsArmario = [ data.usuario, outfitId, new Date() ];
                connection.query(queryArmario, paramsArmario, (error, resultados) => {
                    if (error) {
                        connection.release();
                        return callback(error, null);
                    } else {
                       // Añadir prendas a composicion_outfit
                        const queryComposicion = "INSERT INTO composicion_outfit (outfit_id, prenda_id, activo) VALUES (?, ?, 1)";
                        const selectedPrendas = data.prendas; // prendas seleccionadas 

                        selectedPrendas.forEach(prendaId => {
                            const paramsComposicion = [outfitId, prendaId];
                            connection.query(queryComposicion, paramsComposicion, (error) => {
                                if (error) {
                                    connection.release();
                                    return callback(error, null);
                                }
                            });
                        });

                        // añadir eventos
                        parametros.addEventosToOutfit( outfitId, data.eventos, (error) => {
                            if (error) {
                                console.log("Error al insertar los eventos del outfit:", error);
                                connection.release();
                                return callback(error, null);
                            }

                            // añadir tags
                            parametros.addTagsToOutfit(outfitId, data.tags, (error) => {
                                if (error) {
                                    console.log("Error al insertar los tags del outfit:", error);
                                    connection.release();
                                    return callback(error, null);
                                }

                                // añadir estacioens
                                parametros.addEstacionesToOutfit(outfitId, data.estacion, (error) => {
                                    connection.release();
                                    if (error) {
                                        console.log("Error al insertar las estaciones del outfit:", error);
                                        return callback(error, null);
                                    }
                                   
                                    callback(null, outfitId);
                                    
                                });
                            });
                        });
                    }
                });
            }
        });
    });
}

//modificat outfit
updateOutfit(outfitId, field, value,prendas, callback){

    let queryOutfit = '';
    let paramsOutfit = [];

    switch (field) {
        case 'nombre':
            queryOutfit = 'UPDATE outfits SET nombre = ? WHERE id_outfit = ?';
            paramsOutfit = [value, outfitId];
            break;
        
        case 'publico':
            queryOutfit = 'UPDATE outfits SET publico = ? WHERE id_outfit = ?';
            paramsOutfit = [value, outfitId];
            break;
        default:
                return callback(new Error('Campo no válido para actualización'));
    }   

     pool(function (connection) {
            connection.query(queryOutfit, paramsOutfit, (err) => {
                connection.release();  
                if (err){
                  return  callback(err, null);
                }
             return callback(null, true);
            });
    });
}

//mostrar outfit
getOutfitById(id, usuarioId, callback) {
    const query = `
        SELECT o.*
        FROM outfits o
        JOIN armario_outfits a ON o.id_outfit = a.outfit_id
        WHERE  a.usuario_id = ?
        AND o.activo = 1 
        AND o.id_outfit = ? 
    `;
    const queryEventos = `
    SELECT E.id, E.nombre 
    FROM eventos E 
    JOIN outfit_evento PE ON E.id = PE.id_evento 
    WHERE PE.id_outfit = ? AND PE.activo=1
    `;
    const queryTags = `
    SELECT E.id, E.nombre 
    FROM tags E 
    JOIN outfit_tag PE ON E.id = PE.tag_id 
    WHERE PE.outfit_id = ? AND PE.activo=1
    `;
    
    const queryEstaciones = `
    SELECT e.id,e.nombre 
    FROM Estaciones e
    JOIN outfit_estacion pe ON e.id = pe.estacion_id
    WHERE pe.outfit_id = ? AND pe.activo=1
        
        `;
    const params = [usuarioId,id];
    const paramsEventos=[id];
    const paramsTags = [id];
    const paramsEstaciones = [id];

    pool((connection) => {
        connection.query(query, params, (error, results) => {
           
            if (error) {
                connection.release();
                callback(error, null);
            } 
            if (results.length === 0) {
                connection.release();
                return callback(null, null); // No se encontró el outfit
            }
            const outfit = results[0];

             // Realizar la consulta de las estaciones
             connection.query(queryEstaciones, paramsEstaciones, (error, estacionesResultados) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }

                // Asignar las estaciones
                outfit.estaciones = estacionesResultados;

                // Realizar la consulta de los eventos
                connection.query(queryEventos, paramsEventos, (error, eventosResultados) => {
                    if (error) {
                        connection.release();
                        return callback(error, null);
                    }
                    outfit.eventos = eventosResultados;

                    // Realizar la consulta de los tags
                    connection.query(queryTags, paramsTags, (error, tagsResultados) => {
                        connection.release(); // Liberar la conexión después de todas las consultas
                        if (error) {
                            return callback(error, null);
                        }

                        outfit.tags = tagsResultados;

                        // Devolver outfit con sus parametros
                        callback(null, outfit);
                    });
                });
            });
        });
    });
}
//obtener outfit publico por id
getPublicOutfitById(outfitId, duenioId, callback) {
    const query = `
        SELECT o.foto
        FROM outfits o
        JOIN armario_outfits ao ON o.id_outfit = ao.outfit_id
        WHERE o.id_outfit = ? 
          AND ao.usuario_id = ? AND o.publico = 1 AND o.activo = 1 LIMIT 1
    `;

    pool(function (connection) {
        connection.query(query, [outfitId, duenioId], (error, results) => {
            connection.release();
          
            if (error || results.length === 0) {
                return callback(error, null);
            }
            callback(null, results[0]);
        });
    });
}
//obtener outfit publico por usuario
getOutfitByUsuario(userId, callback) {
    const query = `
        SELECT o.*
        FROM outfits o
        JOIN armario_outfits ao ON o.id_outfit = ao.outfit_id
        LEFT JOIN outfit_estacion oe ON o.id_outfit = oe.outfit_id
        LEFT JOIN Estaciones e ON oe.estacion_id = e.id
        LEFT JOIN outfit_evento oe2 ON o.id_outfit = oe2.id_outfit
        LEFT JOIN eventos ev ON oe2.id_evento = ev.id
        LEFT JOIN outfit_tag ot ON o.id_outfit = ot.outfit_id
        LEFT JOIN tags t ON ot.tag_id = t.id
        WHERE ao.usuario_id = ? AND o.activo = 1
        GROUP BY o.id_outfit
    `;
    const params = [userId];

    pool(function (connection) {
        connection.query(query, params, (error, resultados) => {
            connection.release();
            if (error) {
                return callback(error, null);
            }

            if (resultados.length > 0) {
                //transformamos ena arrays
                const outfits = resultados.map(outfit => ({
                    ...outfit,
                    estaciones: outfit.estaciones ? outfit.estaciones.split(",") : [],
                    eventos: outfit.eventos ? outfit.eventos.split(",") : [],
                    tags: outfit.tags ? outfit.tags.split(",") : []
                }));
                callback(null, outfits);
            } else {
                callback(null, []);
            }
        });
    });
}
//borrar outfit
deleteOutfit(id, callback) {

    const queryOutfit = "UPDATE OUTFITS SET activo = 0 WHERE id_outfit = ?";
    const queryComposicion = "UPDATE composicion_outfit SET activo = 0 WHERE outfit_id = ?";
    var params = [id];

    // Utiliza el pool de conexiones para manejar la conexión a la base de datos
    pool(function (connection) {
            connection.query(queryOutfit, params, (err) => {
                if (err){
                     connection.release();
                   return callback(err, null);
                }
                // Desactivar prendas del outfit
                connection.query(queryComposicion, params, (err) => {
                     connection.release();
                    if (err){
                       return callback(err, null); 
                    }                        
                       return callback(null, id);
                });
            });
        
    });
}
//mostrar todos los outfits publicos
listPublicOutfits(userId, callback) {
    const query = `
        SELECT o.* FROM outfits o
        JOIN armario_outfits ao ON o.id_outfit = ao.outfit_id
        WHERE o.activo = 1 AND o.publico = 1 AND ao.usuario_id = ?
    `;

    pool(function (connection) {
        connection.query(query, [userId], (error, results) => {
            connection.release();
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    });
}

//mostrar todos los outfits
listOutfits(callback) {
    const query = `
        SELECT * FROM outfits 
        WHERE activo = 1
    `;

     pool(function (connection) {
        connection.query(query, (error, results) => {
            connection.release();
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    });
}
//filtrar prendas
filter(data, callback) {
    const { eventos, estaciones, tags,userId } = data;
    let query = `
    SELECT DISTINCT o.* 
    FROM outfits o
    LEFT JOIN outfit_evento pc ON o.id_outfit = pc.id_outfit AND pc.activo = 1
    LEFT JOIN outfit_estacion pe ON o.id_outfit = pe.outfit_id AND pe.activo=1
    LEFT JOIN outfit_tag pes ON o.id_outfit = pes.outfit_id AND pes.activo = 1
    LEFT JOIN armario_outfits a ON a.outfit_id=o.id_outfit
    WHERE o.activo = 1 AND a.usuario_id = ?
    `;
    let queryParams = [userId];
    pool(function (connection) {
      
        if (eventos && eventos.length > 0) {
            query += ' AND pc.id_evento IN (?)';
            queryParams.push(eventos);
        }

        if (estaciones && estaciones.length > 0) {
            query += ' AND pe.estacion_id IN (?)';
            queryParams.push(estaciones);
        }

        if (tags && tags.length > 0) {
            query += ' AND pes.tag_id IN (?)';
            queryParams.push(tags);
        }
        connection.query(query, queryParams, (error, results) => {
            if (error) {
                return callback(error,null);
            }
            connection.release();
            callback(null, results);
        });

    });
}
//buscar outfit
search(data, callback) {
   
    const { query,userId } = data;
    let sqlQuery = `
        SELECT DISTINCT o.* 
        FROM outfits o
        LEFT JOIN outfit_evento oev ON o.id_outfit = oev.id_outfit
        LEFT JOIN outfit_tag ot ON o.id_outfit = ot.outfit_id
        LEFT JOIN eventos e ON oev.id_evento = e.id
        LEFT JOIN tags t ON ot.tag_id = t.id
        LEFT JOIN armario_outfits a ON a.outfit_id=o.id_outfit  
        WHERE o.activo=1 AND a.usuario_id = ?
    `;
    const queryParams = [userId];
    if (query) {
        sqlQuery += ` 
            AND (
                o.nombre LIKE ? OR
                e.nombre LIKE ? OR
                t.nombre LIKE ? 
            )
        `;
        const likeQuery = `%${query}%`;
        queryParams.push(likeQuery, likeQuery,likeQuery);
    }

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
// Obtener outfits públicos de una lista de usuarios seguidos
getPublicOutfitsFromUserList(userIds, callback) {
    if (!userIds || userIds.length === 0) {
        return callback(null, []); // No sigues a nadie
    }

    const placeholders = userIds.map(() => '?').join(',');
    const query = `
    SELECT o.*, 
        ao.usuario_id AS duenio_outfit, 
        u.nombre_usuario AS nombre_usuario, 
        u.email AS email_usuario
       
    FROM outfits o
    JOIN armario_outfits ao ON o.id_outfit = ao.outfit_id
    JOIN usuarios u ON ao.usuario_id = u.id
    WHERE o.publico = 1 AND o.activo = 1
    AND ao.usuario_id IN (${placeholders})
    ORDER BY o.fecha_creacion DESC
`;

    pool(function (connection) {
        connection.query(query, userIds, (error, results) => {
            connection.release();
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    });
}

//obtener prendas del outfit
getPrendasByOutfit(outfitId,callback){
    const query = `
    SELECT p.*
    FROM composicion_outfit co
    JOIN prendas p ON co.prenda_id = p.id_prenda
  WHERE co.outfit_id = ? AND co.activo = 1

`;
pool(function (connection) {
    connection.query(query,[outfitId], (error, resultados) => {
        connection.release();
        if (error) {
            return callback(error, null);
        } 
            return callback(null, resultados);
    });
});
}
//numero de outfits de usuario
countOutfitsByUsuario(userId, callback) {
        const query = `
            SELECT COUNT(*) AS total
            FROM OUTFITS o
            JOIN armario_outfits a ON o.id_outfit = a.outfit_id
            WHERE a.usuario_id = ? AND o.activo = 1
        `;
        const params = [userId];
    
        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    const total = resultados[0].total;
                    callback(null, total);
                }
            });
        });
    }
}
module.exports = DAOOutfit;