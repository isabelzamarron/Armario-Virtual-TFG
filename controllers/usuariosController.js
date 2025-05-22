"use strict";

const DAOUsuario = require("../DAO/DAOUsuarios");
const daoUsuario = new DAOUsuario();
const DAOComunidad = require("../DAO/DAOComunidad");
const daoComunidad=new DAOComunidad();
const DAOOutfit = require("../DAO/DAOOutfit");
const daoOutfit=new DAOOutfit();
const DAOPrenda = require("../DAO/DAOPrendas");
const daoPrenda=new DAOPrenda();
const userService = require('../services/usuariosService');
const comunidadService = require('../services/comunidadService');
const usuarioService = require("../services/usuariosService");
const outfitService = require("../services/outfitsService");

exports.createUser = (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        nombre_usuario: req.body.nombre_usuario,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        foto: req.body.foto,
        preferencias: req.body.preferencias
    };

    userService.createUser(data, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        req.session.user_id = result.userId;
        if (result.reactivado) {
            return res.status(200).json({ message: 'Usuario reactivado', userId: result.userId });
        } else {
            return res.status(201).json({ message: 'Usuario creado', userId: result.userId });
        }
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.body;
    userService.deleteUser(id, (err, success) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (success) {
            return res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
        } else {
            return handleError(res, 'Usuario no encontrado.', 404);
        }
    });
    
};

exports.getUserPhoto = (req, res) => {
    const userId = req.params.id;
    userService.getUserPhoto(userId, (err, userPhoto) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (userPhoto) {
            res.set('Content-Type', 'image/jpeg');
            return res.send(userPhoto); 
        }
            else {
                return handleError(res, 'Usuario no encontrado.', 404);
            }
    });
};

exports.indexAdmin = (req, res) => {
    userService.listUsers((err,users)=>{
        if (err) {
            return handleError(res, err, 500);
        } else {
            res.render('indexAdmin', { title: "Usuarios", users });
        }
    });

};

exports.inicio = (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/auth');
    }
    const userId = req.session.user_id;
    usuarioService.getUserById(userId, (error, result) => {
        if (error) {
            return handleError(res, 'Error al obtener el usuario: ' + error, 500);
        } else if (result) {
            comunidadService.listSeguidores(userId, (error, seguidores) => {
                if (error) {
                    return handleError(res, 'Error al obtener seguidores: ' + error, 500);
                }
                comunidadService.listSeguidos(userId, (error, seguidos) => {
                    if (error) {
                        return handleError(res, 'Error al obtener seguidos: ' + error, 500);
                    }

                result.followers = seguidores.length;  // Numero de seguidores
                result.following = seguidos.length;   // Numero de seguidos
                result.seguidores = seguidores;      // Lista de seguidores
                result.seguidos = seguidos;          // Lista de seguidos
            
            outfitService.listOutfitsPublicos(userId,(error, outfits) => {
                if (error) {
                    return handleError(res, 'Error al obtener los outfits: ' + error, 500);
                }
                const idsSeguidos = seguidos.map(s => s.following_id); 

                outfitService.getOutfitsFromFollowedUsers(idsSeguidos, (error, outfitsSeguidos) => {
                    if (error) {
                        return handleError(res, 'Error al obtener los outfits de los seguidos: ' + error, 500);
                    }
               
                result.publicaciones =  outfits.length; 
            
                // renderizar
                res.render('index', {
                    title: "Inicio Usuario",
                    u: result,
                    outfitsCount:  result.publicaciones,
                    outfits: outfits, 
                    outfitsSeguidos,
                    seguidores: result.seguidores,
                });
            });
         });
     });
    }); }
     else {
          return handleError(res, 'Usuario no encontrado: ' + error, 404);
         }
                });
};


exports.getFollowers = (req, res) => {
    const userId = req.params.id; 

    if (!userId) {
        return res.status(400).json({ message: "ID de usuario no proporcionado" });
    }

    daoComunidad.listFollowers(userId, async (error, seguidores) => {
        if (error) {
            return res.status(500).json({ message: "Error al obtener seguidores" });
        }

        if (!seguidores || seguidores.length === 0) {
            return res.json([]); // Devolver una lista vacía si no hay seguidores
        }

        // Obtener detalles de seguidor
        try {
            const followersDetails = await Promise.all(seguidores.map(seguidor => {
                return new Promise((resolve, reject) => {
                    daoUsuario.getUserById(seguidor.follower_id, (err, usuario) => {
                        if (err || !usuario) {
                            resolve(null); // Si hay un error, devolver null
                        } else {
                            resolve({
                                id: usuario.id,
                                nombre: usuario.nombre,
                                nombre_usuario: usuario.nombre_usuario,
                                foto: usuario.foto ? usuario.foto.toString('base64') : null
                            });
                        }
                    });
                });
            }));

            // Filtrar  y devolvuelve la lista
            res.json(followersDetails.filter(user => user !== null));
        } catch (err) {
            res.status(500).json({ message: "Error al procesar seguidores" });
        }
    });
};

exports.getFollowing = (req, res) => {
    const userId = req.params.id; 

    if (!userId) {
        return res.status(400).json({ message: "ID de usuario no proporcionado" });
    }

    daoComunidad.listSeguidos(userId, async (error, seguidos) => {
        if (error) {
            return res.status(500).json({ message: "Error al obtener seguidos" });
        }

        if (!seguidos || seguidos.length === 0) {
            return res.json([]); // Devolver lista vacía si no sigue a nadie
        }

        try {
            const followingDetails = await Promise.all(seguidos.map(seg => {
                return new Promise((resolve, reject) => {
                    
                    daoUsuario.getUserById(seg.following_id, (err, usuario) => {
                        
                        if (err || !usuario) {
                            resolve(null); // Si hay un error, devolver null
                        } else {
                            resolve({
                                id: usuario.id,
                                nombre: usuario.nombre,
                                nombre_usuario: usuario.nombre_usuario,
                                foto: usuario.foto ? usuario.foto.toString('base64') : null
                            });
                        }
                    });
                });
            }));

            // Filtra  y devolver la lista
            res.json(followingDetails.filter(user => user !== null));
        } catch (err) {
            res.status(500).json({ message: "Error al procesar seguidos" });
        }
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    userService.getUserById(userId, (err, user) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (user) {
            return res.status(200).json(user);
        } else {
            return handleError(res, 'Usuario no encontrado.', 404);
        }
    });
};

exports.logout=(req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return handleError(res, 'Error al destruir la sesión: ' + err, 500);
            } 
          res.clearCookie('connect.sid');
          return res.redirect('/auth?logout=1');

        });
    } else {
   // Redirige a la página de inicio de sesión si no hay sesión
       return res.redirect('/auth?logout=1');

    }
  };

 exports.updateProfile = (req, res) => {
    const userId = req.params.id;
    const email = req.body.email;
    const nombre_usuario=req.body.nombre_usuario;

    // Obtener el usuario actual
    daoUsuario.getUserById(userId, (error, currentUser) => {
        if (error) {
            return res.status(500).json({ message: 'Error al obtener el usuario' });
        } else if (!currentUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            // Si el email y el username no han cambiado actualizar
            if (currentUser.email === email&& currentUser.nombre_usuario === nombre_usuario) {
                return actualizarUsuarioConFoto(userId, req, res, currentUser);
            } else {
                // comprobar si el nuevo email ya en uso
                daoUsuario.getByEmail(email, (error, existingEmailUser) => {
                    if (error) {
                        return res.status(400).json({ message: 'Error al verificar el email' });
                    } else if (existingEmailUser && existingEmailUser.id !== parseInt(userId)) {
                        return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
                    } else {
                        // comprobar si el nuevo nombre de usuario ya en uso 
                        daoUsuario.getByUsername(nombre_usuario, (error, existingUsernameUser) => {
                            if (error) {
                                return res.status(400).json({ message: 'Error al verificar el nombre de usuario' });
                            } else if (existingUsernameUser && existingUsernameUser.id !== parseInt(userId)) {
                                return res.status(400).json({ message: 'El nombre de usuario ya está en uso por otro usuario' });
                            } else {
                                //todo bien
                                return actualizarUsuarioConFoto(userId, req, res, currentUser);
                            }
                        });
                    }
                });
            }
        }
    });
};
function actualizarUsuarioConFoto(userId, req, res, currentUser) {
    let usuario = {
        email: req.body.email,
        nombre: req.body.nombre,
        admin:0,
        password:currentUser.password,
        apellidos: req.body.apellidos,
        nombre_usuario: req.body.nombre_usuario,
        activo: 1,
        foto: req.body.foto ? Buffer.from(req.body.foto, 'base64') : currentUser.foto
    };

    // actualizar usuario
    daoUsuario.updateUser(userId, usuario, (error) => {
        if (error) {
            return res.status(500).json({ message: 'Error actualizando el usuario' });
        }

        // Si hay preferencias actualizarlas
        if (req.body.preferencias) {
            console.log(req.body.preferencias);
            let preferencias = {
                formalidad: req.body.preferencias.formalidad,
                simplicidad: req.body.preferencias.simplicidad,
                estilo_temporal: req.body.preferencias.estiloTemporal,
                sofisticacion: req.body.preferencias.sofisticacion,
                rango_edad: req.body.preferencias.edad
            };
        
            daoUsuario.updatePreferencias(userId, preferencias, (error) => {
                if (error) {
                    console.error("Error actualizando preferencias:", error);
                    return res.status(500).json({ message: "Usuario actualizado, pero error al actualizar preferencias" });
                }

                console.log(`Preferencias del usuario ${userId} actualizadas`);
                return res.status(200).json({ message: "Usuario y preferencias actualizados correctamente" });
            });
        } else {
            return res.status(200).json({ message: "Usuario actualizado correctamente" });
        }
    });
}
exports.editarPerfil=(req,res)=>{
    const usuario = req.user.id;
   
    res.render('editarPerfil', { u:usuario });
}
exports.updateAdmin = (req, res) => {
    const userId = req.body.id;
    const isAdmin = req.body.admin;

    daoUsuario.updateAdmin(userId, isAdmin, (error, resultado) => {
        if (error) {
            return res.status(500).json({ message: 'Error al actualizar el estado de administrador' });
        }
        return res.status(200).json({ message: "Estado de administrador actualizado correctamente" });
    });

};

exports.getEstadisticasPreferencias = (req, res) => {
    const userId =req.user.id;

    daoComunidad.listSeguidos(userId, (error, usersSeguidos) => {
        if (error) {
            return res.status(500).send('Error al obtener los usuarios seguidos.');
        }

        if (usersSeguidos.length === 0) {
            return res.status(404).send('No tienes usuarios seguidos.');
        }

        usuarioService.getEstadisticaPreferenciasDeSeguidos(usersSeguidos.map(user => user.following_id), (err, stats) => {
            if (err) {
                return res.status(500).send('Error al obtener estadísticas de preferencias.');
            }

            const preferenciaslab = ['Formalidad', 'Simplicidad', 'Estilo Temporal', 'Sofisticación', 'Rango Edad'];
            const preferenciasval = [
                stats.formalidad,
                stats.simplicidad,
                stats.estilo_temporal,
                stats.sofisticacion,
                stats.rango_edad
            ];
        });
    });
};


exports.getEstadisticas = (req, res) => {
    const userId = req.session.user_id;

    daoPrenda.countPrendasByUsuario(userId, (err, totalPrendas) => {
        if (err) return res.status(500).send("Error al obtener cantidad de prendas");

        daoOutfit.countOutfitsByUsuario(userId, (err, totalOutfits) => {
            if (err) return res.status(500).send("Error al obtener cantidad de outfits");

            daoPrenda.getColoresPreferidosByUsuario(userId, (err, colores) => {
                if (err) return res.status(500).send("Error en colores");

                daoPrenda.getEstilosPreferidosByUsuario(userId, (err, estilos) => {
                    if (err) return res.status(500).send("Error en estilos");

                    daoPrenda.getEstacionesPreferidasByUsuario(userId, (err, estaciones) => {
                        if (err) return res.status(500).send("Error en estaciones");

                        daoPrenda.getFechasDePrendasByUsuario(userId, (err, fechas) => {
                            if (err) return res.status(500).send("Error en fechas de prendas");

                            daoComunidad.listSeguidos(userId, (error, usersSeguidos) => {
                                if (error) {
                                    return res.status(500).send('Error al obtener los usuarios seguidos.');
                                }

        const preferenciaslab = ['Formalidad', 'Simplicidad', 'Estilo Temporal', 'Sofisticación', 'Rango Edad'];
        let preferenciasval;
           if (usersSeguidos.length === 0) {
                        
                                    preferenciasval = [0, 0, 0, 0, 0];
                                 return     res.render('estadisticas', {
                                fechasPrendas: fechas,
                                totalPrendas,
                                totalOutfits,
                                coloresPreferidos: colores,
                                estilosPreferidos: estilos,
                                estacionesPreferidas: estaciones,
                                preferenciasLabels: preferenciaslab,
                                preferenciasValues:preferenciasval,
                                usuariosSeguidos: usersSeguidos,
                                u: req.user
                            });
                                }

    // obtener preferencias 
    usuarioService.getEstadisticaPreferenciasDeSeguidos(usersSeguidos.map(user => user.following_id), (err, stats) => {
        if (err) {
            return res.status(500).send('Error al obtener estadísticas de preferencias.');
        }
        preferenciasval = [stats.formalidad, stats.simplicidad, stats.estilo_temporal, stats.sofisticacion, stats.rango_edad ];
                            res.render('estadisticas', {
                                fechasPrendas: fechas,
                                totalPrendas,
                                totalOutfits,
                                coloresPreferidos: colores,
                                estilosPreferidos: estilos,
                                estacionesPreferidas: estaciones,
                                preferenciasLabels: preferenciaslab,
                                preferenciasValues:preferenciasval,
                                usuariosSeguidos: usersSeguidos,
                                u: req.user
                            });
                        });
                    });
                });
                });
            });
        });
    });
});
};

function handleError(res, message, status) {
    return res.status(status).json({ message });
}
