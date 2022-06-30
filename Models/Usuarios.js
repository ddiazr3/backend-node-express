const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioEschema = new mongoose.Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    direccion: {type: String, default: null},
    telefono: {type: String, default: null},
    dpi: {type: String, default: null},
    usuariocreacion: {type: mongoose.Schema.Types.ObjectId, default: null},
    activo: {type: Boolean, default: true},
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Usuario', UsuarioEschema);
