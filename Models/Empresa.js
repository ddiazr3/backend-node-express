const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmpresaEschema = new mongoose.Schema({
    empresa: {type: String, required: true},
    direccion: {type: String, required: true},
    telefono: {type: String, required: true},
    tiempo: {type: "Number", default: 0},
    activo: {type: Boolean, default: true},
    empresapadre: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Empresa'
    },
    usuariocreacion: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Usuario'
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Empresa', EmpresaEschema)
