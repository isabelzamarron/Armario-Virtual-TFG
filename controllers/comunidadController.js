"use strict";


const comunidadService = require('../services/comunidadService');

exports.addFollower = (req, res) => {
         const newFollower = { 
           follower_id : req.body.follower_id,
           usuario_id : req.body.usuario_id,
            fecha: new Date()
        };
        comunidadService.addFollower(newFollower,(err,success)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (success) {
                return res.status(200).json({ success: true, message: 'Seguidor añadido correctamente' });
            }
            else {
                return handleError(res, 'Usuario no encontrado.', 404);
            }
        });
};
exports.addFollowing = (req, res) => {
         
        const newFollowing = { 
            usuario_id  : req.body.usuario_id,
         following_id  : req.body.following_id,
            fecha: new Date()
        };
        comunidadService.addFollowing(newFollowing,(err,success)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (success) {
                return res.json({ success: true, message: 'Seguido añadido correctamente' });
            }
            else {
                    return handleError(res, 'Usuario no encontrado.', 404);
            }
        });
};
exports.deleteFollower = (req, res) => {
 
   const follower_id = req.body.follower_id;
    const usuario_id = req.body.usuario_id;
    comunidadService.deleteFollower({ follower_id, usuario_id },(err,success)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (success) {
            return res.json({ success: true, message: "Has eliminado a este seguidor"  });
        }
        else {
                return handleError(res, 'Usuario no encontrado.', 404);
        }
    });
};

exports.deleteFollowing = (req, res) => {

   const following_id = req.body.following_id;
   const usuario_id = req.body.usuario_id;

   comunidadService.deleteFollowing({ following_id, usuario_id },(err,success)=>{
    if (err) {
        return handleError(res, err, 500);
    } else if (success) {
        return res.json({ success: true, message: "Has eliminado a este seguido"  });
    }
    else {
            return handleError(res, 'Usuario no encontrado.', 404);
    }
});

};

exports.listFollowersJSON = (req, res) => {
   
        comunidadService.listSeguidores(userId ,(err,usuarios)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (usuarios) {
                res.json(usuarios); 
            }
            else {
                return handleError(res, 'Error al obtener seguidores', 404);
            }
        });
    
};


exports.listDiscoveryUsers = (req, res) => {
  
        const userId = req.user.id;
        comunidadService.discoveryUsers(userId ,(err,usuarios)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (usuarios) {
                res.json(usuarios); 
            }
            else {
                return handleError(res, 'Error mostrando usuarios', 404);
            }
        });
   
};
exports.searchUsers = (req, res) => {
    const { query } = req.query; 
    const userId = req.user.id;
   
    comunidadService.searchUsers({ query, userId },(err,usuarios)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (usuarios) {
            res.json(usuarios); 
        }
        else {
            return handleError(res, 'Error en la busqueda', 404);
        }
    });
   
}

function handleError(res, message, statusCode) {
    res.status(statusCode).send(message);
}