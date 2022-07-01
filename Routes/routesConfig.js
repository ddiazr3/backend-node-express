const verifyToken = require('../middleware/routes/validate-token')
const login = require("./login");
const empresa = require("./empresa");
const dashboard = require("./dashboard");
const ingresoEgreso = require("./ingresoegreso");
const role = require("./roles");
const usuario = require("./usuarios");
const tipoPlaca = require("./tipoPlacas");
const reportes = require("./reportes");

module.exports = function (app) {
    app.use('/login', login);
    app.use('/empresa', empresa)
    app.use('/dashboard', dashboard)
    app.use('/ingreso-vehiculo', ingresoEgreso)
    app.use('/roles', role)
   // app.use('/usuarios', verifyToken, usuario)
    app.use('/usuarios', usuario)
    app.use('/placas', tipoPlaca)
    app.use('/reportes', reportes)
}


