"use strict";


const pool = require('../conexion');

class DAOParametrosPrendas {
//añadir estilos a prenda
addEstilosToPrenda(prendaId, estilos, callback){
        if (estilos && estilos.length > 0) {
        const query = `
        INSERT INTO prenda_estilo (prenda_id, estilo_id, activo) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE activo = 1;`;
  
        const values = estilos.map(estiloId => [prendaId, estiloId,1]);
    
            pool(function (connection) {
                connection.query(query, [values], (error, resultados) => {
                      connection.release();
                      if (error) {
                        return callback(error,null);
                    } 
                 
                        return callback(null,resultados);
                });
            });
        }else{
            callback(null,null);
        }
};
//borrar estilos de prenda
deleteEstilosFromPrenda(prendaId, estilos, callback) {
    if (!estilos || estilos.length === 0) {//comprobamos que hay al menos un estilo
        return callback(null,null);
    }
    const query = `
        UPDATE prenda_estilo 
        SET activo = 0 
        WHERE prenda_id = ? AND estilo_id IN (?);`;

    pool(function (connection) {
        connection.query(query, [prendaId, estilos], (error, resultados) => {
            connection.release();
            if (error) {
                return callback(error,null);
            } else {
                return callback(null, resultados);
            }
        });
    });
};
//obtener estilos de prenda
getEstilosByPrenda(prendaId, callback){
    const query = `
        SELECT c.id, c.nombre 
        FROM estilos c
        INNER JOIN prenda_estilo pc ON c.id = pc.estilo_id
        WHERE pc.prenda_id = ? AND pc.activo = 1;
    `;
    pool((connection) => {
        connection.query(query, [prendaId], (error, results) => {
            connection.release();
            if (error){
                return callback(error);
            } 
            callback(null, results);
        });
    });
};
//añadir colores a prenda
addColoresToPrenda(prendaId, colores, callback){
        if (colores && colores.length > 0) {
            const queryColor = `
                INSERT INTO prenda_color (prenda_id, color_id, activo) 
                VALUES ? 
                ON DUPLICATE KEY UPDATE activo = 1
            `;
        
            const values = colores.map(colorId => [prendaId, colorId, 1]);
    
            pool(function (connection) {
                connection.query(queryColor, [values], (error, resultados) => {
                   connection.release();
                   if (error) {
                        return callback(error,null);
                    }
                    
                    callback(null,resultados);
                });
            });
        } else {
           callback(null,null);
        }
};
//borrar colores de prenda
deleteColoresFromPrenda (prendaId, colores, callback){
        
        if (!colores || colores.length === 0) {//comprobamos que hay al menos un color
            return callback(null,null);
        }
        const query = `
            UPDATE prenda_color
            SET activo = 0 
            WHERE prenda_id = ? AND color_id IN (?);`;
    
        pool(function (connection) {
            connection.query(query, [prendaId, colores], (error, resultados) => {
                connection.release(); 
                if (error) {
                    return callback(error,null);
                } else {
                    return callback(null, resultados);
                }
            });
        });
};
//obtener colores de prenda
getColoresByPrenda(prendaId, callback){
        const query = `
            SELECT c.id, c.nombre, c.hex 
            FROM colores c
            INNER JOIN prenda_color pc ON c.id = pc.color_id
            WHERE pc.prenda_id = ? AND pc.activo = 1;
        `;
    
        pool((connection) => {
            connection.query(query, [prendaId], (error, results) => {
                connection.release();
                if (error){
                   return callback(error); 
                } 
                callback(null, results);
            });
        });
};
//añadir estaciones a prenda
addEstacionesToPrenda(prendaId, estaciones, callback){
        if (estaciones && estaciones.length > 0) {
            const queryEstacion = `INSERT INTO prenda_estacion (prenda_id, estacion_id, activo) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE activo = 1`;
            const estacionValues = estaciones.map(estacionId => [prendaId, estacionId,1]);
            pool(function (connection) {
            connection.query(queryEstacion, [estacionValues], (error, resultados) => {
              connection.release();  
              if (error) {
                    return callback(error,null);
                }
                callback(null,resultados);
            });
        });
        } else {
            callback(null,null);
        }
};
//borrar estaciones de prenda
deleteEstacionesFromPrenda(prendaId, estaciones, callback){
        if (!estaciones || estaciones.length === 0) {//comprobamos que hay al menos una estacion
            return callback(null,null);
        }
    
        const query = `
            UPDATE prenda_estacion 
            SET activo = 0 
            WHERE prenda_id = ? AND estacion_id IN (?);
            `;
    
        pool(function (connection) {
            connection.query(query, [prendaId, estaciones], (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error,null);
                } else {
                    return callback(null, resultados);
                }
            });
     });
};
//obtener estaciones de prenda
getEstacionesByPrenda(prendaId, callback){
        const query = `
            SELECT c.id, c.nombre
            FROM estaciones c
            INNER JOIN prenda_estacion pc ON c.id = pc.estacion_id
            WHERE pc.prenda_id = ? AND pc.activo = 1;
        `;
    
        pool((connection) => {
            connection.query(query, [prendaId], (error, results) => {
                connection.release();
                if (error){
                    return callback(error,null);
                } 
                callback(null, results);
            });
        });
};
    //OBTENER PARAMETROS
getEstaciones(callback){
        const query = 'SELECT id, nombre FROM estaciones';
        pool(function (connection) {
            connection.query(query, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } else {
                    return callback(null, resultados);
                }
            });
        });
};
getEstilos(callback){
        const query = 'SELECT id, nombre FROM estilos';
        pool(function (connection) {
            connection.query(query, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } else {
                    return callback(null, resultados);
                }
            });
        });
};
getCategorias(callback){
    const query = 'SELECT id, nombre FROM categorias';
       pool(function (connection) {
            connection.query(query, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } 
                else {
                    return callback(null, resultados);
                    }
            });
        });
};
getTipos(callback){
    const query = 'SELECT * FROM tipos';
     pool(function (connection) {
            connection.query(query, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } else {
                    return callback(null, resultados);
                }
            });
        });
};
getColores(callback){
    const query = 'SELECT * FROM colores';
     pool(function (connection) {
            connection.query(query, (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error, null);
                } else {
                    return callback(null, resultados);
                }
            });
        });
};
getTiposPorCategoria(idCategoria,callback){
    const query = 'SELECT id, nombre FROM tipos WHERE categoria_id= ?';
    var params = [idCategoria];
 
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
}
module.exports=DAOParametrosPrendas;