const verifyToken = require('../middleware/routes/validate-token')
const login = require("./login");
const empresa = require("./empresa");
const dashboard = require("./dashboard");
const ingresoEgreso = require("./ingresoegreso");
const role = require("./roles");
const usuario = require("./usuarios");
const tipoPlaca = require("./tipoPlacas");
const reportes = require("./reportes");
const modulos = require("./modulos");
const verificadortoken = require("./verificaciontoken")


module.exports = function (app) {
    app.use('/login', login);
    app.use('/verificar-token',verifyToken, verificadortoken);
    app.use('/empresa',verifyToken, empresa)
    app.use('/dashboard', verifyToken ,dashboard)
    app.use('/ingreso-vehiculo',verifyToken, ingresoEgreso)
    app.use('/roles',verifyToken, role)
   // app.use('/usuarios', verifyToken, usuario)
    app.use('/usuarios',verifyToken, usuario)
    app.use('/placas',verifyToken, tipoPlaca)
    app.use('/reportes',verifyToken, reportes)
    app.use('/modulos',verifyToken, modulos)
}


