const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioEmpresaEschema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('UsuarioEmpresa', UsuarioEmpresaEschema)
