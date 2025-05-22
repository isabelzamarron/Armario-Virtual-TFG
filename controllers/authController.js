"use strict";

const authService = require("../services/authService");


exports.mostrarLogin = (req, res) => {
    res.render('menuPrincipal');
};
//iniciar sesion
exports.login = (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
    client_ip: req.socket.remoteAddress
  };

  authService.login(data, req.session, (error, result) => {
    if (error) {
       return handleError(res, error.message, error.status || 500);
    }

    return res.status(200).json({message: result.message, redirectUrl: result.redirectUrl});
  });
};

exports.mostrarSignup = (req, res) => {
    res.render('signup');
};
//registro de usuario
exports.signup = (req, res) => {
      const data = {
        email: req.body.email,
        password: req.body.password,
        nombre_usuario: req.body.nombre_usuario,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        foto: req.body.foto,
        preferencias: req.body.preferencias
    };

    authService.signup(data,(error, result) => {
        if (error){
             return handleError(res, 'Error en el registro: ' + error, 500);
    }
        req.session.user_id = result.userId;
        return res.status(200).json({message: result.message, redirectUrl: result.redirectUrl });
    });
};
function handleError(res, message, status) {
    return res.status(status).json({ message });
}
