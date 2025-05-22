"use strict"

var express = require('express');
var router = express.Router();
const prendaController = require('../controllers/prendasController');
const getUserByIdMiddleware = require('../public/javascript/getUserByIdMiddleware');

router.post('/create', prendaController.createPrenda);
router.post('/delete',getUserByIdMiddleware, prendaController.deletePrenda);
router.get('/photoPrenda/:id',getUserByIdMiddleware, prendaController.getPrendaPhoto);
router.get('/listarPrendas',getUserByIdMiddleware, prendaController.listPrendas);
router.get('/listarPrendasJSON',getUserByIdMiddleware, prendaController.listPrendasJSON);
router.post('/updatePrenda', prendaController.updatePrenda);
router.get('/obtenerPrenda/:id',getUserByIdMiddleware, prendaController.showPrenda);
router.post('/filtrar',getUserByIdMiddleware,prendaController.filterPrenda);
router.get('/buscar',getUserByIdMiddleware,prendaController.searchPrenda);

router.get('/tipos/:id',prendaController.getTiposPorCategoria);
router.get('/categorias', prendaController.getCategorias);
router.get('/colores', prendaController.getColores);
router.get('/estilos', prendaController.getEstilos);
router.get('/estaciones', prendaController.getEstaciones);


router.get('/:id/colorByPrenda',prendaController.getColoresPorPrenda);
router.get('/:id/estiloByPrenda',prendaController.getEstilosPorPrenda);
router.get('/:id/estacionByPrenda',prendaController.getEstacionesPorPrenda);

router.post('/:id/estilos', prendaController.guardarEstilos);
router.post('/:id/colores', prendaController.guardarColores);
router.post('/:id/estaciones', prendaController.guardarEstaciones);

module.exports = router; 