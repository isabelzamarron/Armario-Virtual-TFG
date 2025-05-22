"use strict";


const pool = require('../conexion');
const bcrypt = require('bcrypt');
class DAOUsuario {

//crear un nuevo usuario
createUser(data, callback) {
            const query = "INSERT INTO USUARIOS (email, password, admin,nombre_usuario, nombre, apellidos, foto,activo) VALUES (?,?,?,?,?,?,?,?)"
            const hashedPassword = bcrypt.hashSync(data.password, 10);
        var params = [
            data.email,
            hashedPassword,
            data.admin,
            data.nombre_usuario,
            data.nombre,
            data.apellidos,
            data.foto,
            data.activo,
        ];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                if (data.preferencias) { // comprueba que existen preferencias para añadir
                    this.addPreferencias(resultados.insertId, data.preferencias, (errorPreferencias) => {
                        if (errorPreferencias) {
                            callback(errorPreferencias, null);
                        } else {
                            callback(null, resultados.insertId);
                        }
                    });
                } else {
                    callback(null, resultados.insertId); 
                }
            }
        });
    });
}
//añadir preferencias
addPreferencias(userId,preferencias,callback){
    
        const query = "INSERT INTO PREFERENCIAS_USUARIO (usuario_id, formalidad, simplicidad, estilo_temporal, sofisticacion, rango_edad) VALUES (?,?,?,?,?,?)";
        var params = [
            userId,
            preferencias.formalidad,
            preferencias.simplicidad,
            preferencias.estilo_temporal,
            preferencias.sofisticacion,
            preferencias.rango_edad
        ];
    // Utiliza el pool de conexiones para manejar la conexión a la base de datos
    pool(function (connection) {
        connection.query(query, params, (error, resultados) => {
            connection.release();
            if (error) {
                callback(error, null);
            } else {
                callback(null, resultados.insertId);
            }
        });
    });
}
//obtener preferencias de usuario
getPreferenciasById(userId, callback) {
        const query = "SELECT formalidad, simplicidad, estilo_temporal, sofisticacion, rango_edad FROM PREFERENCIAS_USUARIO WHERE usuario_id = ?";
        pool(function (connection) {
            connection.query(query, [userId], (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, resultados.length > 0 ? resultados[0] : null);
                }
            });
        });
}
//obtener usuario por email
getByEmail(email, callback) {
        const query = "SELECT * FROM USUARIOS WHERE email = ?";
        const params = [email];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {                 
                    callback(error, null);
                } else {
                    if (resultados.length > 0) {
                        callback(null, resultados[0]);
                    } else {
                        callback(null, null);
                    }
                }
     });
 });
}
//obetener usuario por nombre de usuario 
getByUsername(username, callback) {
        const query = "SELECT * FROM USUARIOS WHERE nombre_usuario = ?";
        const params = [username];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    if (resultados.length > 0) {
                        callback(null, resultados[0]);
                    } else {
                        callback(null, null);
                    }
                }
            });
        });
}
//obtener usuario por email
getUserIdByEmail(email, callback) {
        const query = "SELECT id FROM USUARIOS WHERE email = ? AND activo = 1";
        const params = [email];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                   
                    if (resultados.length > 0) {
                        callback(null, resultados[0].id);
                    } else {
                        callback(null, null);
                    }
                }
            });
        });
}
//obtener usuario por id
getUserById(userId, callback) {
        const query = "SELECT * FROM USUARIOS WHERE id = ? AND activo = 1";
        const params = [userId];

        pool(function (connection) {
            connection.query(query, params, (error, resultados) => {
                connection.release();
                if (error) {
                    callback(error, null);
                } else {
                    if (resultados.length > 0) {
                        callback(null, resultados[0]);
                    } else {
                        callback(null, null);
                    }
                }
            });
        });
}
//Actualizar usuario
updateUser(userId, userData, callback) {
     
         const query = "UPDATE USUARIOS SET nombre = ?, apellidos = ?, email = ?,password=?, foto = ?, admin=?,nombre_usuario=?, activo=? WHERE id = ?";
         const params = [
            userData.nombre,
            userData.apellidos,
            userData.email,
            userData.password, 
            userData.foto,
            userData.admin || 0,
            userData.nombre_usuario,
            userData.activo,
            userId
          ]; 
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
//Actualizar preferencias de usuario
updatePreferencias(userId, preferencias, callback) {
      const query = `
            UPDATE PREFERENCIAS_USUARIO 
            SET formalidad = ?, simplicidad = ?, estilo_temporal = ?, sofisticacion = ?, rango_edad = ?
            WHERE usuario_id = ?
        `;
    
        var params = [
            preferencias.formalidad,
            preferencias.simplicidad,
            preferencias.estilo_temporal,
            preferencias.sofisticacion,
            preferencias.rango_edad,
            userId
        ];
    
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
//Hacer admin
updateAdmin(userId, isAdmin, callback) {
        const query = "UPDATE USUARIOS SET admin = ? WHERE id = ?";
        const params = [isAdmin ? 1 : 0, userId];
     pool(function (connection) {
        connection.query(query, params, (error, resultados) => {
            connection.release();
                if (error) {
                    return callback(error, null);
                }
                callback(null, resultados);
            });
     });
}
//Borrar usuario
deleteUser(id, callback) {
    const query = "UPDATE USUARIOS SET activo = 0 WHERE id = ?";
    var params = [id];

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
//Listar usuarios
list(callback) {
        let query = "SELECT * FROM USUARIOS WHERE activo = 1 ";
        let params = [];
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
//obtener datos estadisticas
getEstadisticaPreferencias(userIds, callback) {
    if (!userIds || userIds.length === 0) {
        return callback(null, null); //no sigue a nadie
    }

    const placeholders = userIds.map(() => '?').join(',');
    const query = `
        SELECT 
            AVG(p.formalidad) AS formalidad,
            AVG(p.simplicidad) AS simplicidad,
            AVG(p.estilo_temporal) AS estilo_temporal,
            AVG(p.sofisticacion) AS sofisticacion,
            AVG(p.rango_edad) AS rango_edad
        FROM PREFERENCIAS_USUARIO p
        WHERE p.usuario_id IN (${placeholders});
    `;

    pool((connection) => {
        connection.query(query, userIds, (error, results) => {
            connection.release();
            if (error || results.length === 0) {
                return callback(error, null);
            }
            callback(null, results[0]);
        });
    });
}

}
module.exports = DAOUsuario;