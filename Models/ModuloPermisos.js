const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModuloPermisosEschema = new mongoose.Schema({
    permiso: {
        type: mongoose.Schema.Types.ObjectId
    },
    modulo: {
        type: mongoose.Schema.Types.ObjectId
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('ModuloPermisos', ModuloPermisosEschema)
