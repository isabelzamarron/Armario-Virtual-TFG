"use strict";

const DAOPrenda = require("../DAO/DAOPrendas");
const daoPrenda = new DAOPrenda();
const DAOParametros = require("../DAO/DAOParametrosPrendas");
const daoParametros = new DAOParametros();
const async = require('async');

const prendaService = require('../services/prendasService');

exports.createPrenda = (req, res) => {
   
    let nuevaPrenda = {
        foto: req.body.foto,
        activo: 1,
        categoria_id: req.body.categoria,
        tipo_id: req.body.tipo,
        colores: req.body.colores,
        estacion: req.body.estacion,
        estilos: req.body.estilos,
        usuario: req.body.usuario
    };

    // Validar si se envió la imagen
    if (!req.body.foto) {
        console.warn('Imagen base64 no válida o no recibida');
        return res.status(400).json({ message: 'Imagen base64 no válida o no recibida' });
    }

    prendaService.createPrenda(nuevaPrenda, (err, prendaId) => {
        if (err) {
             return handleError(res, err, 500);
        }
        return res.status(201).json({ message: 'Prenda creada exitosamente',prendaId });
    });
};
exports.listPrendasJSON= (req, res) => {
  
        const userId = req.user.id;
        prendaService.list(userId, (err, data) => {
            if (err) {
                return handleError(res, err, 500);
            }
            res.json(data);
        });

};

exports.listPrendas = (req, res) => {
   
        const userId = req.user.id;
        const categoria = req.query.categoria;
        
        prendaService.list(userId, (err, data) => {
            if (err) {
                return handleError(res, err, 500);
            }
            res.render('armarioPrendas', {
                prendas: data.prendas,
                categorias: data.categorias,
                tipos: data.tipos,
                u: req.user,
                categoria: categoria
            });
        });   
   
};

exports.showPrenda = (req, res) => {
    const prendaId = req.params.id;
     const usuarioId = req.user.id;

    prendaService.showPrenda({ prendaId, usuarioId },(err,prenda)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (prenda) {
            res.status(200).json(prenda);
        }
        else {
            return handleError(res, 'Prenda no encontrado.', 404);
        }
    });
};

exports.deletePrenda = (req, res) => {
    const prenda={
        id :req.body.id,
        usuarioId: req.user.id,
    }
    prendaService.deletePrenda(prenda,(err,success)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (success) {
            return res.status(200).json({ success: true, message: "Has eliminado prenda"  });
        }
        else {
                return handleError(res, 'Prenda no encontrado.', 404);
        }
    });
};

exports.getPrendaPhoto = (req, res) => {
    const prendaId = req.params.id;
    const userId=req.user.id;
    prendaService.getPrendaPhoto({prendaId,userId}, (err, prendaPhoto) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (prendaPhoto) {
            res.set('Content-Type', 'image/jpeg');
            return res.send(prendaPhoto); 
        }
        else {
            return handleError(res, 'Prenda no encontrada', 404);
        }
    });
};

exports.getCategorias = (req, res) => {
    prendaService.getCategorias((err, categorias) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(categorias);
    });
};

exports.getEstilos = (req, res) => {
    prendaService.getEstilos((err, estilos) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(estilos);
    });
};
exports.getEstilosPorPrenda = (req, res) => {
    const prendaId = req.params.id;
    prendaService.getEstilosPorPrenda(prendaId,(err,estilos)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (estilos) {
            res.json(estilos); 
        }
        else {
            return handleError(res, 'estilos no encontrados', 404);
        }
    });
 
};

exports.guardarEstilos = (req, res) => {
    const prendaId = req.params.id;
    const nuevosEstilos = req.body.estilos; // nuevos estilos que el usuario selecciona

    prendaService.guardarEstilos(prendaId, nuevosEstilos, (err) => {
        if (err) {
            console.error("Error en guardarEstilos:", err);
            return res.status(500).json({ success: false, message: 'Error al guardar estilos' });
        }

        return res.json({ success: true, message: 'Estilos actualizados correctamente' });
    });
};
exports.getEstaciones = (req, res) => {
    prendaService.getEstaciones((err, estaciones) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(estaciones);
    });
};
exports.getEstacionesPorPrenda = (req, res) => {
    const prendaId = req.params.id;
    prendaService.getEstacionesPorPrenda(prendaId,(err,estaciones)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (estaciones) {
            res.json(estaciones); 
        }
        else {
            return handleError(res, 'estaciones no encontrados', 404);
        }
    });
};

exports.guardarEstaciones = (req, res) => {
    const prendaId = req.params.id;
    const nuevasEstaciones = req.body.estaciones; //  nuevos estaciones que el usuario selecciona
    prendaService.guardarEstaciones(prendaId, nuevasEstaciones, (err) => {
        if (err) {
            console.error("Error en guardarEstaciones:", err);
            return res.status(500).json({ success: false, message: 'Error al guardar estilos' });
        }

        return res.json({ success: true, message: 'estaciones actualizados correctamente' });
    });
};

exports.getColores = (req, res) => {
    prendaService.getColores((err, colores) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(colores);
    });
};
exports.getColoresPorPrenda = (req, res) => {
    const prendaId = req.params.id;
  
   prendaService.getColoresPorPrenda(prendaId,(err,colores)=>{
    if (err) {
        return handleError(res, err, 500);
    } else if (colores) {
        res.json(colores); 
    }
    else {
        return handleError(res, 'colores no encontrados', 404);
    }
});
};


exports.guardarColores = (req, res) => {
    const prendaId = req.params.id;
    const nuevosColores = req.body.colores; // nuevos colores que el usuario selecciona

    prendaService.guardarColores(prendaId, nuevosColores, (err) => {
        if (err) {
            console.error("Error en guardarColores:", err);
            return res.status(500).json({ success: false, message: 'Error al guardar colores' });
        }

        return res.json({ success: true, message: 'colores actualizados correctamente' });
    });
};

    
exports.getTiposPorCategoria=(req,res)=>{
    const categoriaId=req.params.id;

    prendaService.getTiposPorCategoria(categoriaId,(err,tipos)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (tipos) {
            res.json(tipos); 
        }
        else {
            return handleError(res, 'Tipos no encontrados', 404);
        }
    });
};

exports.filterPrenda=(req,res)=>{
    const {colores,estaciones,estilos}=req.body;
    const userId =req.user.id; 

    prendaService.filterPrenda({ colores, estaciones,estilos,userId },(err,prendas)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (prendas) {
            res.json(prendas); 
        }
        else {
            return handleError(res, 'Error al filtrar', 404);
        }
    });
};

exports.searchPrenda = (req, res) => {
    const { query } = req.query; 
    const userId =req.user.id; 

   prendaService.searchPrendas({ query, userId },(err,prendas)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (prendas) {
            res.json(prendas); 
        }
        else {
            return handleError(res, 'Error en la busqueda', 404);
        }
    });
}


exports.getPrendasPorCategoria = (req, res) => {
    const categoria = req.params.categoriaNombre;
    prendaService.obtenerPrendasPorCategoria(categoria, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: 'Error al obtener datos' });
        }
        res.json({
            categoria: results.categoria,
            prendas: results.prendas
        });
    });
};
exports.updatePrenda = (req, res) => { 
    const { prendaId, field, value } = req.body;

    prendaService.updatePrenda({ prendaId, field, value }, (err, result) => {
        if (err) {
            return handleError(res, err, 500);
        }
        if (result) {
            return res.json({
                success: true,
                message: 'Prenda actualizada correctamente',
                result: result 
            });
        } else {
            return res.status(404).json({ success: false, message: 'Prenda no encontrada o no actualizada' });
        }
    });
};

function handleError(res, message, status) {
    return res.status(status).json({ message });
}
