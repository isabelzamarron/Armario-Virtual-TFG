"use strict";

//Importacion de modulos
var express = require('express');
var router = express.Router();
const multer = require('multer');
const multerFactory = multer({ storage: multer.memoryStorage() });

const authController = require('../controllers/authController');

router.get('/', authController.mostrarLogin);
router.post('/login', authController.login);
router.get('/signup', authController.mostrarSignup);
router.post('/signup', multerFactory.single("foto"), authController.signup);

module.exports = router;