const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModulosEschema = new mongoose.Schema({
    modulo: {type: String, required: true},
    path: String,
    icon: String,
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Modulos', ModulosEschema)
