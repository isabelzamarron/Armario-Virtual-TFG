"use strict";


const pool = require('../conexion');
class DAOParametrosOutfits {
//añadir estaciones a outfit
addEstacionesToOutfit(outfitId, estaciones, callback) {
        if (estaciones && estaciones.length > 0) {        
            const queryEstacion = `
            INSERT INTO outfit_estacion (outfit_id, estacion_id, activo) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE activo = 1`;

            const estacionValues = estaciones.map(estacionId => [outfitId, estacionId,1]);
           
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
//borrar estaciones de outfit
deleteEstacionesFromOutfit (outfitId, estaciones, callback){

        if (!estaciones || estaciones.length === 0) {//comprobamos que hay al menos una esatcion
            return callback(null,null);
        }
    
        const query = `
            UPDATE outfit_estacion 
            SET activo = 0 
            WHERE outfit_id = ? AND estacion_id IN (?);
            `;

        pool(function (connection) {
            connection.query(query, [outfitId, estaciones], (error, resultados) => {
                connection.release();
                if (error) {
                    return callback(error,null);
                } else {
               
                    return callback(null, resultados);
                }
            });
        });
};
//obtener estaciones de outfit
getEstacionesByOutfit(outfitId, callback){
        const query = `
            SELECT c.id, c.nombre
            FROM estaciones c
            INNER JOIN outfit_estacion pc ON c.id = pc.estacion_id
            WHERE pc.outfit_id = ? AND pc.activo = 1;
        `;
    
        pool(function (connection) {
            connection.query(query, [outfitId], (error, results) => {
                connection.release();
                if (error){
                   return callback(error); 
                } 
                callback(null, results);
            });
        });
};
//añadir eventos a outfit
addEventosToOutfit(outfitId, eventos, callback) {
    if (eventos &&eventos.length> 0) {
    const query = `
    INSERT INTO outfit_evento (id_outfit, id_evento, activo) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE activo = 1;`;

    const values = eventos.map(eventosId => [outfitId, eventosId,1]);
    
        pool(function (connection) {
        connection.query(query, [values], (error, resultados) => {
            if (error) {
                return callback(error,null);
            } 
                callback(null,resultados);
        }); 
});
}else{
    callback(null,null);
}
};
//borrar eventos de outfit
deleteEventosFromOutfit(outfitId, eventos, callback) {
 
    if (!eventos || eventos.length === 0) {//comprobamos que hay al menos un evento
        return callback(null,null);
    }
 
    const query = `
        UPDATE outfit_evento
        SET activo = 0 
        WHERE id_outfit = ? AND id_evento IN (?);`;

    pool(function (connection) {
        connection.query(query, [outfitId, eventos], (error, resultados) => {
            connection.release(); 
            if (error) {
                return callback(error,null);
            } else {
                return callback(null, resultados);
            }
        });
    });
};
//obtener eventos de outfit
getEventosByOutfit  (outfitId, callback)  {
    const query = `
        SELECT c.id, c.nombre 
        FROM eventos c
        INNER JOIN outfit_evento pc ON c.id = pc.id_evento
        WHERE pc.id_outfit = ? AND pc.activo = 1;
    `;

      pool(function (connection) {
        connection.query(query, [outfitId], (error, results) => {
            connection.release();
            if (error){
               return callback(error,null); 
            } 
            callback(null, results);
        });
    });
};
//añadir tags a outfit
addTagsToOutfit (outfitId, tags, callback) {
    
    if (tags&& tags.length> 0) {
    
    const query = `
    INSERT INTO outfit_tag (outfit_id, tag_id, activo) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE activo = 1;
    `;
    const values = tags.map(tagsId => [outfitId,tagsId,1]);
        pool(function (connection) {
        connection.query(query, [values], (error, resultados) => {
            if (error) {
                return callback(error);
            } 
                return callback(null,resultados);
        });
    });
}else{
    callback(null,null);
}
};
//borrar tags de outfit
deleteTagsFromOutfit (outfitId, tags, callback)  {
  
    if (!tags || estilos.length === 0) {//comprobamos que hay al menos un tag
        return callback(null,null);
    }

    const query = `
        UPDATE outfit_tag 
        SET activo = 0 
        WHERE outfit_id = ? AND tag_id IN (?);`;

    pool(function (connection) {
        connection.query(query, [outfitId, tags], (error, resultados) => {
            connection.release();
            if (error) {
                return callback(error,null);
            } else {
                return callback(null, resultados);
            }
        });
    });
};
//obtener tags de outfit
getTagsByOutfit(outfitId, callback){
    const query = `
        SELECT c.id, c.nombre 
        FROM tags c
        INNER JOIN outfit_tag pc ON c.id = pc.tag_id
        WHERE pc.outfit_id = ? AND pc.activo = 1;
    `;

    pool(function (connection) {
        connection.query(query, [outfitId], (error, results) => {
            connection.release();
            if (error){
                return callback(error,null);
            } 
            callback(null, results);
        });
    });
};

//obtener parametros
getEventos(callback) {
    const query = 'SELECT id, nombre FROM eventos';
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
getTags(callback){
    const query = 'SELECT id, nombre,tipo FROM tags';
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
}
module.exports=DAOParametrosOutfits;