const Modulos = require('../Models/Modulos'),
    Permisos = require('../Models/Permisos'),
    ModuloPermisos = require('../Models/ModuloPermisos'),
    Usuarios = require("../Models/Usuarios"),
    Joi = require("@hapi/joi");

const schemaModulo = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    icon: Joi.string().min(1).max(50).required(),
    permisos: Joi.array().required(),
    orden: Joi.number().integer().required(),
})

//muestra el listado de modulos
const index = async (req, res) => {

    try {
        const data = await Modulos.find()
            .populate('modulopadre')
            .exec()
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json({error: "No se encontraron datos"})
    }

};

//muestra el catalago de permisos
const permisos = async (req, res) => {

    try {
        const data = await Permisos.find()
            .sort("-created_date")
            .exec()
        const padres = await Modulos.find({path: null})
            .sort("-created_date")
            .exec()

        const datos = {
            permisos: data,
            modulospadres: padres
        }
        res.status(200).json(datos)
    } catch (e) {
        res.status(200).json({error: "No se encontraron datos"})
    }

};

//almacena y actualiza
const store = async (req, res) => {

    const {name, path, icon, orden = 1, modulopadreId = null, permisos} = req.body

    const {error} = schemaModulo.validate({
        name: name,
        icon: icon,
        permisos: permisos,
        orden: orden
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const moduloExist = await Modulos.findOne({name: name})

    if (moduloExist) {
        return res.status(400).send({error: "Módulo ya existe"});
    }
    const newModulo = new Modulos({
        name: name,
        path: path,
        icon: icon,
        orden: orden,
        modulopadre: modulopadreId
    })

    //se guarda el modulo
    newModulo.save((error, result) => {
        if (error) {
            return res.status(400).send({error: "No se almaceno el módulo"});
        }
    })


    permisos.forEach((per) => {
        console.log("guardando " + per)
        const newPermisoModulo = new ModuloPermisos({
            permiso: per,
            modulo: newModulo._id
        })
        newPermisoModulo.save((err, result) => {
            if (error) {
                return res.status(400).send({error: "No se almaceno el modulo permiso"});
            }
        })
    })
    return res.status(200).send({success: "Modulo almacenado"});
}

//show / edit
const edit = async (req, res) => {
    const id = req.params.id

    try {
        const permisos = await ModuloPermisos.find({modulo: id}, {permiso: 1, _id: 0}).exec();
        const modulos = await Modulos.findById(id).exec();

        const perArray = [];
        permisos.forEach((per) => {
            perArray.push(per.permiso)
        })

        const data = {
            modulos: modulos,
            permisos: perArray
        }
        console.log(data)
        res.status(200).json(data);


    } catch (e) {
        res.status(400).json({error: "No se encontraron datos"})
    }

}

//metodo que elimina
const update = async (req, res) => {
    const id = req.params.id

    const {_id, name, path, icon, orden = 1, modulopadreId = null, permisos} = req.body

    const {error} = schemaModulo.validate({
        name: name,
        icon: icon,
        permisos: permisos,
        orden: orden
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const moduloExist = await Modulos.findOne({name: name, _id: {$ne: _id}})
    if (moduloExist) {
        return res.status(400).send({error: "Módulo ya existe"});
    }

    //eliminamos todos los permisos y se agregan nuevos
    ModuloPermisos.deleteMany({modulo: id}).exec();

    const updateModulo = {
        name: name,
        path: path,
        icon: icon,
        orden: orden,
        modulopadre: modulopadreId
    }

    // //se guarda el modulo
    Modulos.findOneAndUpdate({_id: id}, {
            $set: updateModulo
        }, {new: true},
        (error, result) => {
            if (error) {
                return res.status(400).send({error: "No se actulizo el modulo permiso"});
            }
        })
    permisos.forEach((per) => {
        console.log("guardando " + per + " modulo id " + id)
        const newPermisoModulo = new ModuloPermisos({
            permiso: per,
            modulo: id
        })
        newPermisoModulo.save((err, result) => {
            if (error) {
                return res.status(400).send({error: "No se almaceno el modulo permiso"});
            }
        })
    })

    return res.status(200).send({success: "Actualizado"});
}

//metodo que elimina logicamente al usuario
const eliminar = (req, res) => {
    const id = req.params.id
    //eliminamos todos los permisos y se agregan nuevos
    try {

        console.log("eliminando modulo " + id)
        ModuloPermisos.deleteMany({modulo: id}).exec();
        Modulos.findByIdAndRemove(id).exec();
        return res.status(200).send({success: "Eliminado"});
    } catch (e) {
        return res.status(200).send({error: e});
    }


}

//metodo que muestra los modulos con permisos
const modulos = async (req, res) => {

    try {
        const modulos = await Modulos.find({path: {$ne: null}})
            .exec()
        const MP = [];
        for (const mod of modulos) {
            const mpermisos = await ModuloPermisos
                .find({modulo: mod._id},{modulo:0, created_date:0})
                .populate({path: 'permiso', select: 'nombrefriendly -_id'}).exec()
            let data = []
            data [0] = mod.name
            data [1] = mpermisos
            MP.push(data)
        }
        res.status(200).json(MP)
    } catch (e) {
        return res.status(400).json({error: "No se encontraron datos"})
    }

}


module.exports = {
    index,
    permisos,
    store,
    edit,
    update,
    eliminar,
    modulos
}
