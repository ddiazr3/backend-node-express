const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModulosEschema = new mongoose.Schema({
    name: {type: String, required: true},
    path: { type: String, default: null},
    icon: String,
    orden: { type: "Number"},
    modulopadre: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Modulos', ModulosEschema)
