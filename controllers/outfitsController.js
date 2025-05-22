"use strict";
const async = require('async');
const outfitService = require('../services/outfitsService');


exports.createOutfit = (req, res) => {
   
    const { nombre, estacion, eventos, tags, estaciones, prendas, imagen,publico } = req.body;
    const usuario=req.user.id;

    const nuevoOutfit = {
      nombre:nombre,
      estacion:estacion,
      eventos: eventos,
      tags: tags,
      estaciones: estaciones,
      usuario:usuario,
      prendas,
      foto: imagen ? Buffer.from(imagen.split(',')[1], 'base64') : null,
    publico: publico,
    };
     
    outfitService.createOutfit(nuevoOutfit, (err, outfitId) => {
        if (err) {
              return handleError(res, err, 500);
        }

        return res.json({message: 'outift creado exitosamente',outfitId });
    });
  };
exports.deleteOutfit = (req, res) => {
    const outfit={
        id: req.body.id,
        usuarioId:req.user.id,
    }

    outfitService.deleteOutfit(outfit,(err,success)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (success) {
            return res.json({ success: true, message: "Has eliminado este outfit"  });
        }
        else {
                return handleError(res, 'outfit no encontrado.', 404);
        }
    });
};

exports.getEventos= (req, res) => {
    outfitService.getEventos((err, eventos) => {
        if (err) {
              return handleError(res, err, 500);
        }
        res.json(eventos);
    });
};
exports.getEventosPorOutfit = (req, res) => {
    const outfitId = req.params.id;

   outfitService.getEventosPorOutfit(outfitId,(err,eventos)=>{
    if (err) {
        return handleError(res, err, 500);
    } else if (eventos) {
        res.json(eventos); 
    }
    else {
        return handleError(res, 'eventos no encontrados', 404);
    }
});
};
exports.guardarEventos = (req, res) => {
    const outfitId = req.params.id;
    const nuevosEventos = req.body.eventos; // nuevos eventos que el usuario selecciona

    outfitService.guardarEventos(outfitId, nuevosEventos, (err) => {
        if (err) {
            return handleError(res, err, 500);
        }
        return res.json({ success: true, message: 'eventos actualizados correctamente' });
    });
};
exports.guardarTags = (req, res) => {
    const outfitId = req.params.id;
    const nuevosTags= req.body.tags; // nuevos tags que el usuario selecciona

    outfitService.guardarTags(outfitId, nuevosTags, (err) => {
        if (err) {
            return handleError(res, err, 500);
        }

        return res.json({ success: true, message: 'tags actualizados correctamente' });
    });
};
exports.getTags= (req, res) => {
    outfitService.getTags((err, tags) => {
        if (err) {
            return handleError(res, err, 500);
        }
        res.json(tags);
    });
};
exports.getTagsPorOutfit = (req, res) => {
   
    const outfitId = req.params.id;
    outfitService.getTagsPorOutfit(outfitId, (err,tags) => {
        if (err) {
            return handleError(res, err, 500);
        }
        else if (tags) {
            return res.json(tags); 
         }
         else {
            return handleError(res, 'tags no encontrados', 404);
        }
    });
};
exports.getEstaciones = (req, res) => {
    outfitService.getEstaciones((err, estaciones) => {
        if (err) {
             return handleError(res, err, 500);
        }
        res.json(estaciones);
    });
};

exports.getEstacionesPorOutfit = (req, res) => {
    const outfitId = req.params.id;
    outfitService.getEstacionesPorOutfit(outfitId,(err,estaciones)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (estaciones) {
           return res.json(estaciones); 
        }
        else {
            return handleError(res, 'estaciones no encontrados', 404);
        }
    });
};

exports.guardarEstaciones = (req, res) => {
    const outfitId = req.params.id;
    const nuevasEstaciones = req.body.estaciones; 
    outfitService.guardarEstaciones(outfitId, nuevasEstaciones, (err) => {
        if (err) {
            return handleError(res, err, 500);
        }

        return res.json({ success: true, message: 'estaciones actualizados correctamente' });
    });
};

exports.listOutfits = (req, res) => {

        const userId=req.user.id;
    
        outfitService.list(userId, (err, results) => {
            if (err) {
                return handleError(res, err, 500);
            }
            // Renderiza la vista 
            res.render('armarioOutfits', {
                outfits: results.outfits|| [],
                eventos: results.eventos,
                tags: results.tags,
                u:userId,
            });
        });   
};
exports.listPublicOutfits = (req, res) => {
    const userId = req.user.id;
    outfitService.listOutfitsPublicos(userId,(err, outfits) => {
        if (err) {
            return handleError(res, err, 500);
        }
        return res.json(outfits); 
    });   
  


};
exports.outfitsPorSeguido= (req, res) => {
    const userId =req.user.id;
    outfitService.getOutfitsFromFollowedUsers(userId, (error, outfits) => {
        if (error) {
            return handleError(res, err, 500);
        }
        return res.json(outfits); 
    });

};
exports.showOutfit = (req, res) => {
    const outfitId = req.params.id;
    const usuarioId=req.user.id;
    outfitService.showOutfit({ outfitId, usuarioId },(err,outfit)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (outfit) {
            res.json(outfit);
        }
        else {
            return handleError(res, 'outfit no encontrado.', 404);
        }
    });
};
exports.updateOutfit = (req, res) => {
        const { outfitId, field, value,prendas } = req.body;

        outfitService.updateOutfit({ outfitId, field, value }, (err, result) => {
            if (err) {
                 return handleError(res, err, 500);
            }
            if (result) {
                return res.json({
                    success: true,
                    message: 'outfit actualizado correctamente',
                    result: result 
                });
            } else {
                 return handleError(res, 'outfit no encontrado.', 404);
            }
        });
    };
    
    
exports.getPrendasByOutfit=(req,res)=>{
    const outfitId = req.params.outfitId; 

    outfitService.getPrendasPorOutfit(outfitId,(err,outfit)=>{
        if (err) {
            return handleError(res, err, 500);
        } else if (outfit) {
            res.status(200).json(outfit);
        }
        else {
            return handleError(res, 'outfit no encontrado.', 404);
        }
    });

};
exports.getOutfitPublicoPhoto = (req, res) => {
    const outfitId = req.params.outfitId;
    const duenioId = req.params.duenioId;

    outfitService.getPublicOutfitPhoto(outfitId, duenioId, (err, outfitPhoto) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (outfitPhoto) {
            res.set('Content-Type', 'image'); 
            return res.send(outfitPhoto); 
        } else {
            return handleError(res, 'Outfit no encontrada o no pública', 404);
        }
    });
};

exports.getOutfitPhoto = (req, res) => {
    const outfitId = req.params.id;
    const usuarioId = req.user.id;
    
    outfitService.getOutfitPhoto({outfitId, usuarioId}, (err, outfitPhoto) => {
        if (err) {
            return handleError(res, err, 500);
        } else if (outfitPhoto) {
            res.set('Content-Type', 'image');
            return res.send(outfitPhoto); 
        } else {
            return handleError(res, 'outfit no encontrada', 404);
        }
    });
}

exports.searchOutfit = (req, res) => {
        const { query } = req.query; 
        const userId =req.user.id; 
        outfitService.searchOutfits({ query, userId },(err,outfits)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (outfits) {
                res.json(outfits); 
            }
            else {
                return handleError(res, 'Error en la busqueda', 404);
            }
        });
}

exports.filterOutfit=(req,res)=>{
       
        const {eventos,estaciones,tags}=req.body;
        const userId =req.user.id; 
        outfitService.filterOutfits({ eventos,estaciones,tags,userId },(err,outfits)=>{
            if (err) {
                return handleError(res, err, 500);
            } else if (outfits) {
                res.json(outfits); 
            }
            else {
                return handleError(res, 'Error al filtrar', 404);
            }
        });
    };

    function handleError(res, message, status) {
        return res.status(status).json({ message });
    }
    
