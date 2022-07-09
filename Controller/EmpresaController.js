const Empresa = require('../Models/Empresa'),
    Tarifas = require('../Models/Tarifas'),
    TarifaEmpresa = require('../Models/TarifasEmpresa'),
    mongoose = require("mongoose"),
    bcrypt = require("bcrypt")
const RoleModuloPermisos = require("../Models/RoleModuloPermisos");
const Roles = require("../Models/Role");
Joi = require("@hapi/joi");

const schemaEmpresa = Joi.object({
    empresa: Joi.string().min(2).max(100).required(),
    direccion: Joi.string().min(2).max(100).required(),
    telefono: Joi.string().min(2).max(100).required()
})

//muestra el listado de usuarios activos
const index = async (req, res) => {
    try {
        const data = await Empresa.find()
            .exec()

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
        tiempo: tiempo
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
