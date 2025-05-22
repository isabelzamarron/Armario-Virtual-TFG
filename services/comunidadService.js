
const DAOComunidad = require("../DAO/DAOComunidad");
const daoComunidad = new DAOComunidad();

const comunidadService = {
    addFollower: (data, callback) => {
        daoComunidad.addFollower(data, (error, resultados) => {
            if (error) {
                return callback('Error al añadir seguidor: ' + error, null);
            }
            callback(null, resultados);
        });
    },
    
    addFollowing: (data, callback) => {
        daoComunidad.addFollowing(data, (error, resultados) => {
            if (error) {
                return callback('Error al añadir seguido: ' + error, null);
            }
            callback(null, resultados);  
        });
    },
    deleteFollower: (data, callback) => {
        daoComunidad.deleteFollower(data, (error, result) => {
            if (error) {
                return callback('Error al eliminar seguido: ' + error, null); 
            }
                callback(null, true); 
        });
    },
    deleteFollowing: (data, callback) => {
        daoComunidad.deleteFollowing(data, (error, result) => {
            if (error) {
                return callback('Error al eliminar seguidor: ' + error, null); 
            }
            callback(null, true); 
        });
    },
    searchUsers:(data, callback) => {
        daoComunidad.searchUsers(data, (error, users) => {
            if (error) {
                return callback('Error en la busqueda', null); 
            }
            callback(null, users); 
        });
    },
    discoveryUsers:(id, callback) => {
        daoComunidad.discoveryUsers(id, (error, users) => {
            if (error) {
                return callback('Error mostrando usuarios', null); 
            }
            callback(null, users); 
        });
    },
    listSeguidores:(id, callback) => {
        daoComunidad.listFollowers(id, (error, users) => {
            if (error) {
                return callback('Error mostrando usuarios', null); 
            }
            callback(null, users); 
        });
    },
    listSeguidos:(id, callback) => {
        daoComunidad.listSeguidos(id, (error, users) => {
            if (error) {
                return callback('Error mostrando usuarios', null); 
            }
            callback(null, users); 
        });
    },
};

module.exports = comunidadService;
