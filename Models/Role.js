const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleEschema = new mongoose.Schema({
    role: {type: String, required: true},
    description: String,
    created_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Role', RoleEschema)
