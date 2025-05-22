
const DAOOutfit= require("../DAO/DAOOutfit");
const daoOutfit = new DAOOutfit();
const DAOParametros = require("../DAO/DAOParametrosOutfits");
const daoParametros = new DAOParametros();
const async = require('async');

const outfitService = {
    createOutfit:(outfitData, callback) => {
        daoOutfit.create(outfitData, (error, outfitId) => {
            if (error) {
                return callback('Error al crear outfit: ' + error, null); 
            }
            else {
                callback(null, outfitId); 
            }
          });
      
    },
    
    deleteOutfit: (data, callback) => {
        daoOutfit.getOutfitById(data.id,data.usuarioId, (error, outfit) => {
            if (error) {
                return callback('Error al eliminar outfit: ' + error, null); 
            } 
            else if (!outfit) {
                return callback(null, null); // outfit no encontrado
            }
            else{
               daoOutfit.deleteOutfit(outfit.id_outfit, (error) => {
                    if (error) {
                        return callback('Error al eliminar outfit: ' + error, null); 
                    } else {
                        callback(null, true); 
                    }
                });
            } 
        });
    },
    updateOutfit:(data, callback) => {  
        daoOutfit.updateOutfit(data.outfitId, data.field, data.value,data.prendas, (error, result) => {
            if (error) {
                return callback('Error al actualizar prenda: ' + error, null);
            }
            return callback(error, result); 
        });
    },

    getPublicOutfitPhoto: (outfitId,duenioId, callback) => {
            daoOutfit.getPublicOutfitById(outfitId,duenioId, (error, outfit) => {
            if (error || !outfit) {
                return callback(null, null);//no se encontro outfit
            }
            callback(null, outfit.foto);
        });
    },
 
    

    listOutfitsPublicos:(userId,callback) => {
        daoOutfit.listPublicOutfits(userId,(error, outfits) => {
            if (error) {
                return callback('Error al obtener outfits ' + error, null);
            }
            return callback(null, outfits);
        });
   },

   getOutfitsFromFollowedUsers:(userIds, callback)=>{
    daoOutfit.getPublicOutfitsFromUserList(userIds, (error, results) => {
        if (error) {
            return callback('Error al obtener outfits de seguidos: ' + error, null);
        }
        callback(null, results||[]);
    });
},
    
    showOutfit:(data, callback) => {
        
        daoOutfit.getOutfitById(data.outfitId,data.usuarioId, (error, outfit) => {
            if (error) {
                return callback('Error al obtener outfit: ' + error, null); 
            } 
            else if (!outfit) {
                return callback(null, null); // outfit no encontrado
            }
           else{
            return callback(null, outfit);
           }
        });
    },
    
    getOutfitPhoto: (data, callback) => {
        const { outfitId, usuarioId } = data;
       
        daoOutfit.getOutfitById(outfitId, usuarioId, (error, outfit) => {
            if (error) {
              return callback(error, null);
            }
            if (!outfit) {
                 return callback(null, null);
            }
            else{
                return callback(null, outfit.foto||null);
            }
        });
    },
    
    searchOutfits:(data, callback) => {
        daoOutfit.search(data, (error, outfits) => {
            if (error) {
                return callback('Error en la busqueda', null); 
            }
            callback(null, outfits); 
        });
    },

    filterOutfits:(data, callback) => {
        daoOutfit.filter(data, (error, outfits) => {
            if (error) {
                return callback('Error al filtrar', null); 
            }
            callback(null, outfits); 
        });
    },
    
    list:(id, callback) => {
         async.parallel({
            outfits: (callback) => daoOutfit.getOutfitByUsuario(id, callback),
            eventos: (callback) => daoParametros.getEventos(callback),
            tags: (callback) => daoParametros.getTags(callback),
               }, (error, results) => {
                   if (error) {
                    return callback('Error al obtener outfits, eventos y tags: ' + error, null);
                   }
                   //lo envio en json para cuando creo outfit
                   return callback(null, {
                    outfits: results.outfits|| [],
                    eventos: results.eventos,
                    tags: results.tags,
                });
             });
    },
 
    getTags: (callback) => {
        daoParametros.getTags((error, tags) => {
            if (error) {
                return callback('Error al obtener las tags: ' + error, null);
            }
            return callback(null, tags);
        });
    },
    getEstaciones: (callback) => {
        daoParametros.getEstaciones((error, estaciones) => {
            if (error) {
                return callback('Error al obtener las estaciones: ' + error, null);
            }
            return callback(null, estaciones);
        });
    },
    getEventos: (callback) => {
        daoParametros.getEventos((error, eventos) => {
            if (error) {
                return callback('Error al obtener eventos: ' + error, null);
            }
            return callback(null, eventos);
        });
    },
    getPrendasPorOutfit: (data,callback) => {
        daoOutfit.getPrendasByOutfit(data.outfitId,(error, prendas) => {
            if (error) {
                return callback('Error al obtener  prendas del outfit: ' + error, null);
            }
            return callback(null, prendas);
        });
    },
    getEventosPorOutfit:(id,callback)=>{
        daoParametros.getEventosByOutfit(id,(error, eventos) => {
            if (error) {
                return callback('Error en getEventosByOutfit: ' + error, null);
            }
            return callback(null, eventos);
        });
    },
    getTagsPorOutfit:(id,callback)=>{
        daoParametros.getTagsByOutfit(id,(error, tags) => {
            if (error) {
                return callback('Error en getagsbyoutfit: ' + error, null);
            }
            return callback(null, tags);
        });
    },
    getEstacionesPorOutfit:(id,callback)=>{
        daoParametros.getEstacionesByOutfit(id,(error, estaciones) => {
            if (error) {
                return callback('Erroren getEstacionesByOutfit' + error, null);
            }
            return callback(null, estaciones);
        });
    },
    guardarTags:(outfitId, nuevosTags, callback)=>{
        daoParametros.getTagsByOutfit(outfitId, (error,tagsActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = tagsActuales ? tagsActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevosTags.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarTags = () => {
                daoParametros.addTagsToOutfit(outfitId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteTagsFromOutfit(outfitId, aEliminar, (errorEliminar) => {
                    if (errorEliminar) {
                        return callback(errorEliminar);
                    }
                    agregarTags();
                });
            } else {
                agregarTags();
            }
        });
    },
    guardarEstaciones:(outfitId, nuevasEstaciones, callback)=>{
        daoParametros.getEstacionesByOutfit(outfitId, (error, estacionesActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = estacionesActuales ? estacionesActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevasEstaciones.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarEstaciones = () => {
                daoParametros.addEstacionesToOutfit(outfitId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteEstacionesFromOutfit(outfitId, aEliminar, (errorEliminar) => {
                    if (errorEliminar) {
                        return callback(errorEliminar);
                    }
                    agregarEstaciones();
                });
            } else {
                agregarEstaciones();
            }
        });
       
    },
    guardarEventos:(outfitId, nuevosEventos, callback)=>{
        daoParametros.getTagsByOutfit(outfitId, (error,tagsActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = tagsActuales ? tagsActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevosEventos.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarEventos= () => {
                daoParametros.addEventosToOutfit(outfitId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteEventosFromOutfit(outfitId, aEliminar, (errorEliminar) => {
                    if (errorEliminar) {
                        return callback(errorEliminar);
                    }
                    agregarEventos();
                });
            } else {
                agregarEventos();
            }
        });
       
    },
    obtenerPrendasPorCategoria:(categoria,callback)=>{
    async.parallel({
        prendas: (callback) => daoPrenda.getPrendasPorCategoria(categoria, callback),
        categoria: (callback) => daoParametros.getCategoriaPorNombre(categoria, callback)
    }, (error, results) => {
        if (error) {
            return callback(err);        }
        callback(null, results);
    });
    },
};
module.exports=outfitService;