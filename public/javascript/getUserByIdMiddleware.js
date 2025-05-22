const DAOUsuario = require("../../DAO/DAOUsuarios");
const daoUsuario =  new DAOUsuario();
function getUserByIdMiddleware(req, res, next) {
    const userId = req.session.user_id;
    if (!userId) {
        return res.status(401).send('Usuario no autenticado');
    }

    daoUsuario.getUserById(userId, (error, user) => {
        if (error) {
            return res.status(500).send('Error al obtener los datos del usuario: ' + error);
        }
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        req.user = user;
        next();
    });
}

module.exports = getUserByIdMiddleware;
