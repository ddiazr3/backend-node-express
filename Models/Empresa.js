const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmpresaEchema = new mongoose.Schema({
    name: String,
    created_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Empresa', EmpresaEchema)
