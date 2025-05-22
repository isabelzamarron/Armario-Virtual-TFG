
const DAOUsuario = require("../DAO/DAOUsuarios");
const daoUsuario = new DAOUsuario();

const usuarioService = {

    createUser:(data, callback) =>{
            daoUsuario.getByEmail(data.email, (errorEmail, usuarioEmail) => {
                if(errorEmail){
                    return callback('Error al verificar el email: ' + errorEmail, null);
                }
                daoUsuario.getByUsername(data.nombre_usuario, (errorUsername, usuarioUsername) => {
               
                    if (errorUsername) {
                        return callback('Error al verificar el nombre de usuario ' + errorUsername, null);
                    }
                // Si el nombre de usuario ya está en uso por otro usuario activo
                if (usuarioUsername && usuarioUsername.activo) {
                    return callback('El nombre de usuario ya está en uso', null);
                }
                  // Si el email ya está en uso por un usuario activo
                if (usuarioEmail && usuarioEmail.activo) {
                    return callback('El correo ya está en uso', null);

                }
                const preferencias = {
                    formalidad: data.preferencias.formalidad,
                    simplicidad: data.preferencias.simplicidad,
                    estilo_temporal: data.preferencias.estiloTemporal,
                    sofisticacion: data.preferencias.sofisticacion,
                    rango_edad: data.preferencias.rangoEdad
                };

               // Si el email existe pero el usuario está inactivo -> reactivar
               if (usuarioEmail && !usuarioEmail.activo) {
                usuarioEmail.password = data.password;
                usuarioEmail.nombre_usuario = data.nombre_usuario;
                usuarioEmail.nombre = data.nombre;
                usuarioEmail.apellidos = data.apellidos;
                usuarioEmail.activo = 1;
                if (data.foto) {
                    usuarioEmail.foto = Buffer.from(data.foto, 'base64');
                }
        
                daoUsuario.updateUser(usuarioEmail.id, usuarioEmail, (error) => {
                    if (error) {
                        return callback('Error reactivando usuario' + error, null);
                   
                    }
        

                    daoUsuario.updatePreferencias(usuarioEmail.id, preferencias, (err) => {
                        if (err) {
                            return callback('Error guardando preferencias al reactivar: ' + error, null);
                      } else {
                            return callback(null, { userId: usuarioEmail.id, reactivado: true });
                        }
                    });
                });
            } else {
                // Crear nuevo usuario
                const nuevoUsuario = {
                    email: data.email,
                    password: data.password,
                    admin: 0,
                    nombre_usuario: data.nombre_usuario,
                    nombre: data.nombre,
                    apellidos: data.apellidos,
                    activo: 1,
                    foto: data.foto ? Buffer.from(data.foto, 'base64') : null
                };
        
                daoUsuario.createUser(nuevoUsuario, (error, userId) => {
                    if (error) {
                        return callback('Error creando usuario: ' + error, null);
                       
                    }
        
                    daoUsuario.addPreferencias(userId, preferencias, (error) => {
                        if (error) {
                            return callback('Error guardando preferencias: ' + error, null);
                             }
        
                       // req.session.user_id = userId;
                        return callback(null, { userId, creado: true });  
                     });
                });
            }
        });
        });
      
    },
    deleteUser: (id, callback) => {
        daoUsuario.getUserById(id, (error, user) => {
            if (error) {
                return callback('Error al obtener el usuario: ' + error, null);
            } else if (!user) {
                return callback(null, null); // Usuario no encontrado
            } else {
                daoUsuario.deleteUser(user.id, (error) => {
                    if (error) {
                        return callback('Error al eliminar el usuario: ' + error, null);
                    } else {
                        return callback(null, true); // Eliminado correctamente
                    }
                });
            }
        });
    },
    getUserById:(id,callback)=>{
        daoUsuario.getUserById(id, (error, user) => {
        if (error) {
            return callback('Error al obtener el usuario: ' + error, null);
        } else if (!user) {
            return callback(null, null); // Usuario no encontrado
        }
        // Obtener las preferencias del usuario
        daoUsuario.getPreferenciasById(id, (error, preferencias) => {
            if (error) {
                return callback('Error al obtener preferencias: ' + error, null);
            }
            // Agregar las preferencias al objeto usuario y responder con todo
            user.preferencias = preferencias || {}; // Si no hay preferencias, devolver un objeto vacío
            return callback(null, user);
        });
    }); 
    },
    getUserPhoto:(id,callback)=>{
        daoUsuario.getUserById(id, (error, user) => {
            if (error || !user) {
                return callback(null, null); // Usuario no encontrado
            }
            else {
                return callback(null, user.foto); // Devuelves solo la imagen
            }
        });
    },
    listUsers:(callback)=>{
        daoUsuario.list((error, resultados) => {
            if (error) {
                return callback(res, 'Error al obtener todos los usuarios: ' + error, 500);
            } else {
                return callback(null, resultados);
               // res.render('indexAdmin', { title: "usuarios", users: resultados});
            }
        });
    },
    getEstadisticaPreferenciasDeSeguidos: (userIds, callback) => {
    daoUsuario.getEstadisticaPreferencias(userIds, (err, datos) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, datos);
    });
    },

};
module.exports=usuarioService;