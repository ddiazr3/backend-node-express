const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmpresaEschema = new mongoose.Schema({
    empresa: String,
    direccion: String,
    telefono: String,
    tiempo: Integer,
    imprime: {type: Boolean, default: false},
    empresahijo: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Empresa', EmpresaEschema)
