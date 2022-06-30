const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PermisosEschema = new mongoose.Schema({
    permiso: {type: String, required: true},
    nombrefriendly: String,
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Permisos', PermisosEschema)
