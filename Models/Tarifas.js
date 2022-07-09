const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TarifasEschema = new mongoose.Schema({
    nombre: String,
    valorMinutos: { type: "Number", default : 0},
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Tarifas', TarifasEschema)
