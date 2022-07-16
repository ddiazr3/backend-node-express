const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioEmpresaEschema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    created_date: {type: Date, default: Date.now}
})

// const UsuarioEmpresa = mongoose.model('UsuarioEmpresa', UsuarioEmpresaEschema);
//
// const rolesEmpresaIds = async (userid) => {
//     let empresas = await UsuarioEmpresa.find({usuario: userid}).exec();
//     let empresasIds = empresas.map(el => {
//         return el.empresa
//     })
//     return empresasIds
// }
//
// module.exports = {
//     UsuarioEmpresa,
//     rolesEmpresaIds
// }
module.exports = mongoose.model('UsuarioEmpresa', UsuarioEmpresaEschema);
