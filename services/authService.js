
const DAOUsuario = require("../DAO/DAOUsuarios");
const daoUsuario = new DAOUsuario();
const bcrypt = require('bcrypt');

const authService = {
    signup:(data,callback)=>{
        daoUsuario.getByEmail(data.email, (errorEmail, usuarioEmail) => {
            if(errorEmail){
                return callback('Error al verificar el email: ' + errorEmail, null);
            }
            daoUsuario.getByUsername(data.nombre_usuario, (errorUsername, usuarioUsername) => {
                if (errorUsername) {
                    return callback('Error al verificar el nombre de usuario: ' + errorUsername, null);
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
            usuarioEmail.password =data.password;
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
                        }

                    return callback(null, { message: 'Usuario y preferencias reactivados exitosamente',redirectUrl: '/user/inicio',userId:usuarioEmail.id});
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
    
                        return callback(null, {message: 'Usuario y preferencias creados exitosamente', redirectUrl: '/user/inicio', userId:userId });
                    });
                });
                }
            });
        });
    },
    login: (data, session, callback) => {
    daoUsuario.getByEmail(data.email, (error, user) => {
      if (error) {
        return callback( {status: 500,message:'Error iniciando sesión'+error}, null);
      }
    if (!user) {
        return callback({status: 401,message:'Email o contraseña incorrecta' +error}, null);
      }
      if (user.activo !== 1) {
        return callback({status:403, message:'Usuario inactivo'+error}, null);
      }
      
      if (bcrypt.compareSync(data.password, user.password)) {
        session.admin = user.admin == 1;
        session.user_id = user.id;
        session.auth = true;
        session.client_ip = data.client_ip || null;
        session.cookie.expires = new Date(Date.now() + 30 * 60 * 1000); 
        let redirectUrl = user.admin == 1 ? '/user/indexAdmin' : '/user/inicio';

        return callback(null, {message: 'Inicio de sesion exitoso',redirectUrl});
     
    } else {
        return callback({status: 401,message:'Email o contraseña incorrecta' +error}, null);;
      }
    });
    },
}

module.exports=authService;