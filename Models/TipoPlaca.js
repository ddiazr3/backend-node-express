const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TipoPlacaEschema = new mongoose.Schema({
    tipo: String,
    empresa: { type: mongoose.Schema.Types.ObjectId, default: null },
    usuariocreacion: {type: mongoose.Schema.Types.ObjectId, default: null  },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('TipoPlaca', TipoPlacaEschema)
