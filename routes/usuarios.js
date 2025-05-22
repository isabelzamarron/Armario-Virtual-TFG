"use strict"

var express = require('express');
var router = express.Router();
const multer = require('multer');
const multerFactory = multer({ storage: multer.memoryStorage() });
const userController = require('../controllers/usuariosController');
const getUserByIdMiddleware = require('../public/javascript/getUserByIdMiddleware');

router.post('/create', multerFactory.single("foto"), userController.createUser);
router.post('/delete', userController.deleteUser);
router.get('/photo/:id', userController.getUserPhoto);
router.get('/indexAdmin', userController.indexAdmin);
router.get('/inicio',userController.inicio);
router.post('/updateProfile/:id', multerFactory.single("foto"), userController.updateProfile);
router.post('/updateAdmin', userController.updateAdmin);
router.get('/obtenerUsuario/:id', userController.getUserById);
router.get('/logout', userController.logout);
router.get("/getFollowers/:id", userController.getFollowers);
router.get("/getFollowing/:id", userController.getFollowing);
router.get('/editarPerfil', getUserByIdMiddleware,userController.editarPerfil);
router.get('/estadisticas', userController.getEstadisticas);
router.get('/estadisticasPreferencias', getUserByIdMiddleware,userController.getEstadisticasPreferencias);
module.exports = router; 



