const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TarifasEschema = new mongoose.Schema({
    valor: { type: "Number" , default: 0},
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Empresa'
    },
    tarifa: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Tarifas'
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('TarifaEmpresa', TarifasEschema)
