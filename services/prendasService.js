
const DAOPrenda = require("../DAO/DAOPrendas");
const daoPrenda = new DAOPrenda();
const DAOParametros = require("../DAO/DAOParametrosPrendas");
const daoParametros = new DAOParametros();
const async = require('async');
//const rembg= require('@remove-background-ai/rembg.js'); // Importamos la función para eliminar el fondo
const fs = require('fs'); // Solo necesario si decides guardar algo en el servidor
const path = require('path'); // Solo necesario si decides guardar algo en el servidor

const { spawn } = require('child_process');
const prendaService = {
    createPrenda(prendaData, callback) {
        try {
            // Ejecutamos el script de Python para eliminar el fondo de la imagen
            const pythonScriptPath = path.resolve(__dirname, '../remove_background.py');
            const pythonProcess = spawn('python', [pythonScriptPath]);
    
            let imageBuffer = Buffer.alloc(0);
            pythonProcess.stdin.write(prendaData.foto);
            pythonProcess.stdin.end();
    
            // Acumula los datos de la imagen
            pythonProcess.stdout.on('data', (chunk) => {
                imageBuffer = Buffer.concat([imageBuffer, chunk]);
            });
    
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    prendaData.foto = Buffer.from(imageBuffer.toString(), 'base64'); // Convertimos la imagen procesada
    
                    // Llamamos al DAO para insertar la prenda en la base de datos
                    daoPrenda.create(prendaData, (error, prendaId) => {
                        if (error) {
                            console.error('Error creando la prenda:', error);
                            return callback(error, null); // Devolvemos error si falla la creación
                        }
                        return callback(null, prendaId); // Devolvemos el id de la prenda creada
                    });
                } else {
                    console.error('Error al procesar la imagen con Python');
                    return callback('Error al procesar la imagen', null); // Si Python falla, devolvemos error
                }
            });
    
            pythonProcess.stderr.on('data', (data) => {
                console.error('Error al eliminar el fondo:', data.toString());
                return callback('Error al procesar la imagen', null); // Devolvemos error si Python tiene un problema
            });
        } catch (error) {
            console.error('Error llamando al script de Python:', error);
            return callback('Error al procesar la imagen', null); // Capturamos errores del bloque try
        }
    },
    
    deletePrenda: (data, callback) => {
        daoPrenda.getPrendaById(data.id,data.usuarioId, (error, prenda) => {
            if (error) {
                return callback('Error al eliminar prenda: ' + error, null); 
            } 
            else if (!prenda) {
                return callback(null, null); // Usuario no encontrado
            }
            else{
               daoPrenda.deletePrenda(prenda.id_prenda, (error) => {
                    if (error) {
                        return callback('Error al eliminar prenda: ' + error, null); 
                    } else {
                        callback(null, true); 
                    }
                });
            } 
        });
    },
    updatePrenda:(data, callback) => {
    daoPrenda.update(data.prendaId, data.field, data.value, (error, result) => {
        if (error) {
            return callback('Error al actualizar prenda: ' + error, null); 
        }
        // Responder con el resultado de la actualización
        return callback(error, null); 
});
    },
    showPrenda:(data, callback) => {
        
        daoPrenda.getPrendaById(data.prendaId,data.usuarioId, (error, prenda) => {
            if (error) {
                return callback('Error al obtener prenda: ' + error, null); //error
            } 
            else if (!prenda) {             //no existe la prenda
                return callback(null, null); 
            }
           else{
            return callback(null, prenda);//devolver info prenda
           }
        });
    },
    getPrendaPhoto:(data,callback)=>{
        const { prendaId, userId } = data;
        daoPrenda.getPrendaById(prendaId, userId, (error, prenda) => {
            if (error || !prenda) {
                return callback(null, null); // Usuario no encontrado
            }
            else {
                return callback(null, prenda.foto); // Devuelves solo la imagen
            }
        });
    },
    searchPrendas:(data, callback) => {
        daoPrenda.search(data, (error, prendas) => {
            if (error) {
                return callback('Error en la busqueda', null); 
            }
            callback(null, prendas); 
        });
    },
    filterPrenda:(data, callback) => {
        daoPrenda.filter(data, (error, prendas) => {
            if (error) {
                return callback('Error al filtrar', null); 
            }
            callback(null, prendas); 
        });
    },
    
    list:(id, callback) => {
         async.parallel({
                   prendas: (callback) => daoPrenda.getPrendaByUsuario(id, callback),
                   categorias: (callback) => daoParametros.getCategorias(callback),
                   tipos: (callback) => daoParametros.getTipos(callback), // Añadir la consulta para obtener tipos
               }, (error, results) => {
                   if (error) {
                    return callback('Error al obtener prendas, categorías y tipos: ' + error, null);
                   }
                   //lo envio en json para cuando creo outfit
                   return callback(null, {
                    prendas: results.prendas || [],
                    categorias: results.categorias,
                    tipos: results.tipos,
                });
             });
    },
    getCategorias: (callback) => {
        daoParametros.getCategorias((error, categorias) => {
            if (error) {
                return callback('Error al obtener las categorías: ' + error, null);
            }
            return callback(null, categorias);
        });
    },
    getEstilos: (callback) => {
        daoParametros.getEstilos((error, estilos) => {
            if (error) {
                return callback('Error al obtener las categorías: ' + error, null);
            }
            return callback(null, estilos);
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
    getColores: (callback) => {
        daoParametros.getColores((error, colores) => {
            if (error) {
                return callback('Error al obtener colores: ' + error, null);
            }
            return callback(null, colores);
        });
    },
    getTiposPorCategoria: (categoriaId,callback) => {
        daoParametros.getTiposPorCategoria(categoriaId,(error, tipos) => {
            if (error) {
                return callback('Error al obtener tipos: ' + error, null);
            }
            return callback(null, tipos);
        });
    },
    getEstilosPorPrenda:(id,callback)=>{
        daoParametros.getEstilosByPrenda(id,(error, estilos) => {
            if (error) {
                return callback('Error en getEstilosByPrenda: ' + error, null);
            }
            return callback(null, estilos);
        });
    },
    getColoresPorPrenda:(id,callback)=>{
        daoParametros.getColoresByPrenda(id,(error, colores) => {
            if (error) {
                return callback('Error en getColoresByPrenda: ' + error, null);
            }
            return callback(null, colores);
        });
    },
    getEstacionesPorPrenda:(id,callback)=>{
        daoParametros.getEstacionesByPrenda(id,(error, estaciones) => {
            if (error) {
                return callback('Erroren getEstacionesByPrenda' + error, null);
            }
            return callback(null, estaciones);
        });
    },
    guardarEstilos:(prendaId, nuevosEstilos, callback)=>{
        daoParametros.getEstilosByPrenda(prendaId, (error, estilosActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = estilosActuales ? estilosActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevosEstilos.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarEstilos = () => {
                daoParametros.addEstilosToPrenda(prendaId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteEstilosFromPrenda(prendaId, aEliminar, (errorEliminar) => {
                    if (errorEliminar) {
                        return callback(errorEliminar);
                    }
                    agregarEstilos();
                });
            } else {
                agregarEstilos();
            }
        });
    },
    guardarEstaciones:(prendaId, nuevasEstaciones, callback)=>{
        daoParametros.getEstacionesByPrenda(prendaId, (error, estacionesActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = estacionesActuales ? estacionesActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevasEstaciones.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarEstaciones = () => {
                daoParametros.addEstacionesToPrenda(prendaId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteEstacionesFromPrenda(prendaId, aEliminar, (errorEliminar) => {
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
    guardarColores:(prendaId, nuevosColores, callback)=>{
        daoParametros.getColoresByPrenda(prendaId, (error, coloresActuales) => {
            if (error) {
                return callback(error);
            }
    
            const actualesIds = coloresActuales ? coloresActuales.map(c => String(c.id)) : [];
            const nuevosIds = nuevosColores.map(String);
    
            const aAgregar = nuevosIds.filter(id => !actualesIds.includes(id));
            const aEliminar = actualesIds.filter(id => !nuevosIds.includes(id));
    
            const agregarColores = () => {
                daoParametros.addColoresToPrenda(prendaId, aAgregar, (errorAgregar) => {
                    if (errorAgregar) {
                        return callback(errorAgregar);
                    }
                    return callback(null); // Éxito
                });
            };
    
            if (aEliminar.length > 0) {
                daoParametros.deleteColoresFromPrenda(prendaId, aEliminar, (errorEliminar) => {
                    if (errorEliminar) {
                        return callback(errorEliminar);
                    }
                    agregarColores();
                });
            } else {
                agregarColores();
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
module.exports=prendaService;