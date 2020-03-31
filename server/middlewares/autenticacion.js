const jwt = require('jsonwebtoken');

// =======================
// Verificación del Token
// =======================

let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next(); //Si no llamaramos a next se quedaría congelado ahí y no seguiria las funciones
    })
}

// =======================
// Verificación del Token IMG
// =======================

let verificarTokenImg = (req, res, next) => { //Si no llamaramos a next se quedaría congelado ahí

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
}

// =======================
// Verificación admin role
// =======================
let verificarAdminRole = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        console.log(req.usuario);

        if (req.usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Rol de usuario no válido'
                }
            });
        }
    })
}

module.exports = {
    verificarToken,
    verificarTokenImg,
    verificarAdminRole
}