const Usuarios = require('../Models/Usuarios'),
    Empresas = require('../Models/Empresa'),
    UsuarioEmpresa = require('../Models/UsuarioEmpresa'),
    Roles = require('../Models/Role'),
    mongoose = require("mongoose"),
    bcrypt = require("bcrypt")
const Tarifas = require("../Models/Tarifas");
const TarifaEmpresa = require("../Models/TarifasEmpresa");
Joi = require("@hapi/joi");

const schemaUsuairo = Joi.object({
    nombre: Joi.string().min(2).max(25).required(),
    email: Joi.string().min(2).max(25).required().email(),
    password: Joi.string().min(2).max(25).required(),
    roleid: Joi.string().required(),
    empresasids: Joi.array().min(1).required(),
})

const schemaUsuairoUpdate = Joi.object({
    nombre: Joi.string().min(6).max(25).required(),
    email: Joi.string().min(6).max(25).required().email(),
    roleid: Joi.required(),
})
//muestra el listado de usuarios activos
const index = async (req, res) => {

    const {page = 0, limit = 5, nombre = null, email = null, telefono = null} = req.query


    const pageOptions = {
        page: (parseInt(page)) * parseInt(limit),
        limit: parseInt(limit)
    }

    const result = {}

    if (!nombre && !email && !telefono) {
        const totalPage = await Usuarios.countDocuments().exec();
        try {
            const data = await Usuarios.find()
                .sort("-_id")
                .skip(pageOptions.page)
                .limit(pageOptions.limit)
                .exec()
            result.totalData = totalPage;
            result.data = data
            result.rowsPerPage = pageOptions.limit;
            result.page = pageOptions.page;
            res.status(200).json(result)
        } catch (e) {
            res.status(200).json({error: "sad"})
        }
    } else {
        const query = [
            {nombre: {$regex: `^${nombre}`}},
            {email: {$regex: `^${email}`}},
            {telefono: {$regex: `^${telefono}`}}
        ]
        try {
            console.log(`page ${pageOptions.page} limit ${pageOptions.limit}`)
            const data = await Usuarios.find({
                $or: query
            }).sort("-_id")
                .skip(pageOptions.page)
                .limit(pageOptions.limit)
                .exec()

            const totalPage = await Usuarios.countDocuments({
                $or: query
            }).exec();

            result.totalData = totalPage;
            result.data = data
            result.page = pageOptions.page;
            result.rowsPerPage = pageOptions.limit;
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json({error: "No filtro datos"})
        }

    }


    // Usuarios.find((error, result) => {
    //     if (error) {
    //         res.send(error)
    //     }
    //     res.json(result)
    // })
};

const exportar = async (req, res) => {

    const {nombre = null, email = null, telefono = null} = req.query

    if (!nombre && !email && !telefono) {
        try {
            const data = await Usuarios.find({},{nombre:0|1,email:0|1,telefono:0|1,activo:0|1})
                .sort("-_id")
                .exec()
            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({error: "No filtro datos"})
        }
    } else {
        const query = [
            {nombre: {$regex: `^${nombre}`}},
            {email: {$regex: `^${email}`}},
            {telefono: {$regex: `^${telefono}`}}
        ]
        try {
            const data = await Usuarios.find({
                $or: query
            },{nombre:0|1,email:0|1,telefono:0|1,activo:0|1}).sort("-_id")
                .exec()
            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({error: "No filtro datos"})
        }
    }

}

//almacena y actualiza
const store = async (req, res) => {

    const {nombre, direccion, telefono, dpi, email, password, roleid = null, empresasids = []} = req.body

    const {error} = schemaUsuairo.validate({
        nombre: nombre,
        email: email,
        password: password,
        roleid: roleid,
        empresasids: empresasids
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }


    const userExist = await Usuarios.findOne({email: email})

    if (userExist) {
        return res.status(400).send({error: "Correo ya existe"});
    }

    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password, salt)

    const newUser = new Usuarios({
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        dpi: dpi,
        email: email,
        role: roleid,
        password: passwordCrypt
    })

    newUser.save((error, result) => {
        if (error) {
            res.send(error)
        }
    })


    //amarrando usuario empresa
    if(empresasids.length > 0){
        for (const empIDS of empresasids) {
            const userEmpresa = new UsuarioEmpresa({
                usuario: newUser._id,
                empresa: empIDS,
            })
            userEmpresa.save((err, result) => {
                if (error) {
                    return res.status(400).send({error: "No se amarro el usuario empresa"});
                }
            })
        }
    }

    res.status(200).json({error: "Se almaceno con exito"})
}

//show / edit
const edit = (req, res) => {
    const id = req.params.id
    Usuarios.findById(id, {}, (error, result) => {
        if (error) {
            res.send(error)
        }
        res.json(result)
    })
}

//metodo que elimina
const update = async (req, res) => {
    const id = req.params.id

    const {_id, nombre, direccion, telefono, dpi, email, password} = req.body

    const {error} = schemaUsuairoUpdate.validate({
        nombre: nombre,
        email: email
    })
    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const userExist = await Usuarios.findOne({email: email, _id: {$ne: _id}})
    if (userExist) {
        return res.status(400).send({error: "Correo ya existe"});
    }

    const updateUser = {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        dpi: dpi,
        email: email
    }

    if (password) {
        const salt = await bcrypt.genSalt(10);
        const passwordCrypt = await bcrypt.hash(password, salt)
        updateUser.password = passwordCrypt
    }

    Usuarios.findOneAndUpdate({_id: id}, {
            $set: updateUser
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
            res.json(result)
        })
}

//metodo que elimina logicamente al usuario
const eliminar = (req, res) => {

    Usuarios.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                activo: false
            }
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
            res.json({sussess: "Usuario Desactivado"})
        })
}

const activar = (req, res) => {

    Usuarios.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                activo: true
            }
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
            res.json({sussess: "Usuario Activado"})
        })
}

const catalogos = async (req, res) => {

    try {
        const empresas = await Empresas.find()
            .exec()
        const roles = await Roles.find()
            .exec()
        const data = {
            empresas: empresas,
            roles: roles
        }

        res.status(200).json(data)
    } catch (e) {
        res.status(200).json({error: "Error no encontro data"})
    }
};

module.exports = {
    index,
    store,
    edit,
    update,
    eliminar,
    activar,
    exportar,
    catalogos
}
