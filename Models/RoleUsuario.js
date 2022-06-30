const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleUsuarioEschema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId
    },
    role: {
        type: mongoose.Schema.Types.ObjectId
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('RoleUsuario', RoleUsuarioEschema)
