const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleModuloPermisosEschema = new mongoose.Schema({
    modulopermiso: {
        type: mongoose.Schema.Types.ObjectId
    },
    role: {
        type: mongoose.Schema.Types.ObjectId
    },
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('RoleModuloPermisos', RoleModuloPermisosEschema)
