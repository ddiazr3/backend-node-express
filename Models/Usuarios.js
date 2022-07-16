const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UsuarioEschema = new mongoose.Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    direccion: {type: String, default: null},
    telefono: {type: String, default: null},
    dpi: {type: String, default: null},
    usuariocreacion: {type: mongoose.Schema.Types.ObjectId, default: null},
    role: {type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Role'},
    activo: {type: Boolean, default: true},
    token: { type: String, default: null},
    created_date: {type: Date, default: Date.now}
})

UsuarioEschema.methods.getEmpresas = function () {
    return mongoose.model('UsuarioEmpresa').find({usuario: this._id});
}

module.exports = mongoose.model('Usuario', UsuarioEschema);


