const Empresa = require('../Models/Empresa'),
    Tarifas = require('../Models/Tarifas'),
    TarifaEmpresa = require('../Models/TarifasEmpresa'),
    UsuarioEmpresas = require('../Models/UsuarioEmpresa'),
    mongoose = require("mongoose"),
    bcrypt = require("bcrypt")
const RoleModuloPermisos = require("../Models/RoleModuloPermisos");
const Roles = require("../Models/Role");
const {isGod} = require("../middleware/god");
const UsuarioEmpresa = require("../Models/UsuarioEmpresa");
Joi = require("@hapi/joi");

const schemaEmpresa = Joi.object({
    empresa: Joi.string().min(2).max(100).required(),
    direccion: Joi.string().min(2).max(100).required(),
    telefono: Joi.string().min(2).max(100).required()
})

//muestra el listado de usuarios activos
const index = async (req, res) => {
    try {
        let data = []
        if(isGod(req)){
            data = await Empresa.find()
                .exec()
        }else{
            let userEmpresas = await UsuarioEmpresas.find({usuario: req.user.id}).populate('empresa').exec()
            data = userEmpresas.map(el => {
                return el.empresa
            })
        }
        res.status(200).json(data)
    } catch (e) {
        res.status(200).json({error: "Error no encontro data"})
    }
};

const catalogos = async (req, res) => {

    try {
        const tarifas = await Tarifas.find()
            .exec()
        const data = {
            tarifas: tarifas
        }

        res.status(200).json(data)
    } catch (e) {
        res.status(200).json({error: "Error no encontro data"})
    }
};

//almacena y actualiza
const store = async (req, res) => {

    const { empresa, direccion, telefono, tiempo, tarificacion = [] } = req.body

    const {error} = schemaEmpresa.validate({
        empresa: empresa,
        direccion: direccion,
        telefono: telefono
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }
    const empresaExist = await Empresa.findOne({empresa: empresa})

    if (empresaExist) {
        return res.status(400).send({error: "Empresa ya existe"});
    }

    const newEmpresa = new Empresa({
        empresa: empresa,
        direccion: direccion,
        telefono: telefono,
        tiempo: tiempo,
        usuariocreacion: req.user.id
    })

    newEmpresa.save((error, result) => {
        if (error) {
            return res.status(400).send({error: "No se almaceno la empresa"});
        }
    })

    if(tarificacion.length > 0){
        for (const tar of tarificacion) {
            const tarEmpresa = new TarifaEmpresa({
                valor: tar.valor,
                empresa: newEmpresa._id,
                tarifa: tar.tarifa._id
            })
            tarEmpresa.save((err, result) => {
                if (error) {
                    return res.status(400).send({error: "No se almaceno el tarifa empresa"});
                }
            })
        }
    }

    if(!isGod(req)){
        //no es el super usuario le agrega esta empresa al usuario para que le aparezca
        const userEmpresa = new UsuarioEmpresa({
            usuario: req.user.id,
            empresa: newEmpresa._id,
        })
        userEmpresa.save((err, result) => {
            if (error) {
                return res.status(400).send({error: "No se amarro el usuario empresa"});
            }
        })
    }
    res.status(200).json({error: "Se almaceno con exito"})
}

//show / edit
const edit = async (req, res) => {
    const id = req.params.id
    try {
        const empresa = await Empresa.findById(id).exec();
        const tarificacion = await TarifaEmpresa.find({empresa: id})
            .populate('tarifa')
            .exec();

        const data = {
            empresa: empresa,
            tarificacion: tarificacion
        }
        res.status(200).json(data)

    } catch (e) {
        res.status(400).json({error: "No se encontraron datos"})
    }
}

//metodo que elimina
const update = async (req, res) => {
    const id = req.params.id
    const { empresa, direccion, telefono, tiempo, tarificacion = [] } = req.body

    const {error} = schemaEmpresa.validate({
        empresa: empresa,
        direccion: direccion,
        telefono: telefono
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }
    //eliminamos todos los rol modulo permisos
    TarifaEmpresa.deleteMany({empresa: id}).exec();

    const updateEmpresa = {
        empresa: empresa,
        direccion: direccion,
        telefono: telefono,
        tiempo: tiempo
    }

    Empresa.findOneAndUpdate({_id: id}, {
            $set: updateEmpresa
        }, {new: true},
        (error, result) => {
            if (error) {
                return res.status(400).send({error: "No se actulizo la empresa"});
            }
        })

    if(tarificacion.length > 0){
        for (const tar of tarificacion) {
            const tarEmpresa = new TarifaEmpresa({
                valor: tar.valor,
                empresa: id,
                tarifa: tar.tarifa._id
            })
            tarEmpresa.save((err, result) => {
                if (error) {
                    return res.status(400).send({error: "No se almaceno el tarifa empresa"});
                }
            })
        }
    }
    res.status(200).json({error: "Se Actualizado con exito"})
}

//metodo que elimina logicamente al usuario
const eliminar = (req, res) => {

    Empresa.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                activo: false
            }
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
            res.json({sussess: "Empresa Desactivada"})
        })
}

const activar = (req, res) => {

    Empresa.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                activo: true
            }
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
            res.json({sussess: "Empresa Activada"})
        })
}

module.exports = {
    index,
    store,
    edit,
    update,
    eliminar,
    activar,
    catalogos,
}
