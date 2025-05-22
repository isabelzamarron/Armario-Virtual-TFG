"use strict"

var express = require('express');
var router = express.Router();
const comunidadController = require('../controllers/comunidadController');
const getUserByIdMiddleware = require('../public/javascript/getUserByIdMiddleware');


router.post('/addFollower', comunidadController.addFollower);
router.post('/addFollowing', comunidadController.addFollowing);
router.post('/deleteFollower', comunidadController.deleteFollower);
router.post('/deleteFollowing', comunidadController.deleteFollowing);
router.get('/buscar',getUserByIdMiddleware,comunidadController.searchUsers);
router.get('/discovery/:id',getUserByIdMiddleware,comunidadController.listDiscoveryUsers);

module.exports = router; 