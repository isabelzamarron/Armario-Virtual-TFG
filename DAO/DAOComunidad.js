"use strict";


const pool = require('../conexion');

class DAOComunidad{
//añadir seguidor
addFollower(data, callback) {
    const query1 = 'SELECT * FROM Followers WHERE usuario_id = ? AND follower_id = ?';//comprobamos si existe la relación
    const params1 = [data.usuario_id, data.follower_id];

    pool(function (connection) {
        connection.query(query1, params1, (error, results) => {
            if (error) {
                connection.release();
                return callback(error, null);
            }

            if (results.length > 0) { // Si ya existe se actualiza
                const query2 = 'UPDATE Followers SET activo = 1, fecha = ? WHERE usuario_id = ? AND follower_id = ?';
                const params2 = [data.fecha, data.usuario_id, data.follower_id];
                connection.query(query2, params2, (updateError, updateResults) => {
                    connection.release();
                    if (updateError) {
                        return callback(updateError, null);
                    }
                    callback(null, updateResults);
                });
            } else {  // Si no existe se inserta
                const query3 = 'INSERT INTO Followers (usuario_id, follower_id, fecha, activo) VALUES (?, ?, ?, 1)';
                const params3 = [data.usuario_id, data.follower_id, data.fecha];
                connection.query(query3, params3, (insertError, insertResults) => {
                    connection.release();
                    if (insertError) {
                        return callback(insertError, null);
                    }
                    callback(null, insertResults);
                });
            }
        });
    });
}
//añadir seguido
addFollowing(data, callback) {
    const query1 = 'SELECT * FROM Following WHERE usuario_id = ? AND following_id = ?';//comprobamos si existe la relación
    const params1 = [data.usuario_id, data.following_id];

    pool(function (connection) {
        connection.query(query1, params1, (error, results) => {
            if (error) {
                connection.release();
                return callback(error, null);
            }
            if (results.length > 0) {// Si ya existe se actualiza
                const query2 = 'UPDATE Following SET activo = 1, fecha = ? WHERE usuario_id = ? AND following_id = ?';
                const params2 = [data.fecha, data.usuario_id, data.following_id];
                connection.query(query2, params2, (updateError, updateResults) => {
                    connection.release();
                    if (updateError) {
                        return callback(updateError, null);
                    }
                    callback(null, updateResults);
                });
            } else {// Si no existe se inserta
                const query3 = 'INSERT INTO Following (usuario_id, following_id, fecha, activo) VALUES (?, ?, ?, 1)';
                const params3 = [data.usuario_id, data.following_id, data.fecha];
                connection.query(query3, params3, (insertError, insertResults) => {
                    connection.release();
                    if (insertError) {
                        return callback(insertError, null);
                    }
                    callback(null, insertResults);
                });
            }
        });
    });
}
//eliminar seguidor
deleteFollower(data, callback) {
            const query = 'UPDATE FOLLOWERS SET activo = 0 WHERE follower_id = ? AND usuario_id = ? AND activo = 1';
            const params = [data.follower_id, data.usuario_id];
        
            pool(function (connection) {
                connection.query(query, params, (error, resultados) => {
                    connection.release();
                    if (error) {
                        callback(error, null);
                    } else {
                        callback(null, resultados);
                    }
                });
            });
}
//eliminar seguido
deleteFollowing(data, callback) {
           
    const query = 'UPDATE FOLLOWING SET activo = 0 WHERE usuario_id = ? AND following_id = ? AND activo = 1';
    const params = [data.usuario_id, data.following_id];
        
    pool(function (connection) {
        connection.query(query, params, (error, resultados) => {
         connection.release();
          if (error) {
              callback(error, null);
          } else {
              callback(null, resultados);
               }
               });
            });
}
//mostrar sugerencias      
discoveryUsers(usuario_id,callback){
       const query = `
        SELECT * FROM usuarios u
        WHERE u.activo = 1
        AND u.id != ?   AND NOT EXISTS (
                            SELECT 1 
                            FROM following f
                            WHERE f.usuario_id = ?
                            AND f.following_id = u.id
                            AND f.activo = 1
                        )LIMIT 5;
        `;
        let params = [usuario_id,usuario_id];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, resultados);
                }
            });
         });
}
//listar seguidores
listFollowers(usuarioId, callback) {
        
        const query = 'SELECT * FROM Followers WHERE usuario_id = ? AND activo = 1';
        pool(function (connection) {
            connection.query(query, [usuarioId], (error, resultados) => {
                connection.release();
                if (error) {
                    console.log("Error al obtener seguidores:", error);
                    callback(error, null);
                } else {
                    callback(null, resultados); // Devuelve la lista completa de seguidores
                }
            });
        });
}
//listar seguidos 
listSeguidos(usuarioId, callback) {
        const query = 'SELECT * FROM FOLLOWING WHERE usuario_id = ? AND activo = 1';
        pool(function (connection) {
            connection.query(query, [usuarioId], (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, resultados); // devuelve lista seguidos
                }
            });
        });
}
//buscar usuarios
searchUsers(data, callback) {
    const { query, userId } = data;
    let sql = `
        SELECT DISTINCT u.* 
        FROM usuarios u
        WHERE u.activo = 1 
          AND u.id != ? 
          AND u.admin != 1
          AND u.id NOT IN (
              SELECT f.following_id 
              FROM following f 
              WHERE f.usuario_id = ? AND f.activo = 1
          )
    `;
    const queryParams = [userId, userId];

    if (query) {
        sql += ` 
            AND (
                u.nombre LIKE ? OR
                u.apellidos LIKE ? OR
                u.nombre_usuario LIKE ?
            )
        `;
        const likeQuery = `%${query}%`;
        queryParams.push(likeQuery, likeQuery, likeQuery);
    }

    pool(function (connection) {
        connection.query(sql, queryParams, (error, results) => {
            connection.release();
            if (error) {
                return callback(error,null);
            }
            callback(null, results);
        });
    });
}
}
module.exports=DAOComunidad;