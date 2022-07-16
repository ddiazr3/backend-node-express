const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleEschema = new mongoose.Schema({
    role: {type: String, required: true},
    description: {type: String, default: null},
    estado: {type: Boolean, default: true},
    usuariocreacion: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Empresa'
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Role', RoleEschema)
