"use strict"
var express = require('express');
var router = express.Router();
const outfitController = require('../controllers/outfitsController');
const multer = require('multer');
const multerFactory = multer({ storage: multer.memoryStorage() });
const getUserByIdMiddleware = require('../public/javascript/getUserByIdMiddleware');


router.post('/create', multerFactory.single("foto"), getUserByIdMiddleware,outfitController.createOutfit);
router.post('/delete',getUserByIdMiddleware, outfitController.deleteOutfit);
router.get('/photoOutfit/:id',getUserByIdMiddleware, outfitController.getOutfitPhoto);
router.get('/listarOutfits',getUserByIdMiddleware, outfitController.listOutfits);
router.get('/listarOutfitsPublicos',getUserByIdMiddleware, outfitController.listPublicOutfits);
router.post('/updateOutfit', outfitController.updateOutfit);
router.get('/obtenerOutfit/:id',getUserByIdMiddleware, outfitController.showOutfit);
router.post('/filtrar',getUserByIdMiddleware,outfitController.filterOutfit);
router.get('/buscar',getUserByIdMiddleware,outfitController.searchOutfit);

//obtener parametros
router.get('/eventos', outfitController.getEventos);
router.get('/tags', outfitController.getTags);
router.get('/estaciones', outfitController.getEstaciones);

//modificar outfit
router.get('/:id/eventosByOutfit',outfitController.getEventosPorOutfit);
router.get('/:id/tagsByOutfit',outfitController.getTagsPorOutfit);
router.get('/:id/estacionesByOutfit',outfitController.getEstacionesPorOutfit);

router.post('/:id/eventos', outfitController.guardarEventos);
router.post('/:id/tags', outfitController.guardarTags);
router.post('/:id/estaciones', outfitController.guardarEstaciones);

router.put('/updateOutfit', outfitController.updateOutfit);
router.get('/:outfitId/prendas',outfitController.getPrendasByOutfit);


router.get('/seguidos/:userId',getUserByIdMiddleware,outfitController.outfitsPorSeguido);

router.get('/photoOutfitPublico/:outfitId/:duenioId', outfitController.getOutfitPublicoPhoto);

module.exports = router; 