const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleEschema = new mongoose.Schema({
    role: {type: String, required: true},
    description: String,
    usuariocreacion: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Role', RoleEschema)
