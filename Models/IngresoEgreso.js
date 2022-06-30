const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngresoEgresoEschema = new mongoose.Schema({
    placa: String,
    descripcion: String,
    tipoplaca: {type: mongoose.Schema.Types.ObjectId, default: null},
    usuarioingreso: {type: mongoose.Schema.Types.ObjectId},
    usuariosalida: {type: mongoose.Schema.Types.ObjectId},
    empresa: {type: mongoose.Schema.Types.ObjectId, default: null},
    fechaingreso: {type: Date, default: Date.now}
    fechaegreso: {type: Date, default: null}
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('IngresoEgreso', IngresoEgresoEschema)
