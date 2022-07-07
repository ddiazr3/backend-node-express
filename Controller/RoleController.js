const Roles = require("../Models/Role"),
    RoleModuloPermisos = require("../Models/RoleModuloPermisos")
Joi = require("@hapi/joi");

/**
 * Este sirve para hacer el ABC de la empresa
 * */
const schemaModulo = Joi.object({
    role: Joi.string().min(1).max(50).required(),
    permisosrole: Joi.array().required(),
})

// index
const index = async (req, res) => {

    try {
        const data = await Roles.find()
            .exec()
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json({error: "No se encontraron datos"})
    }

};

//almacena y actualiza
const store = async (req, res) => {

    console.log("guardando la informacion")

    const {role, descripcion, permisosrole = [], empresasids = []} = req.body

    const {error} = schemaModulo.validate({
        role: role,
        permisosrole: permisosrole
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const newRole = new Roles({
        role: role,
        description: descripcion
    })

    newRole.save((error, result) => {
        if (error) {
            return res.status(400).send({error: "No se almaceno el rol"});
        }
    })

    for (const permisos of permisosrole) {
        const rmp = new RoleModuloPermisos({
            modulopermiso: permisos,
            role: newRole._id
        })

        rmp.save((err, result) => {
            if (error) {
                return res.status(400).send({error: "No se almaceno el rol modulo permiso"});
            }
        })
    }

    res.status(200).json({error: "Se almaceno con exito"})
}

//show / edit
const edit = async (req, res) => {
    const id = req.params.id
    console.log("id "+id)
    try {
        const role = await Roles.findById(id).exec();
         const modulePermisos = await RoleModuloPermisos.find({role: id}, {modulopermiso: 1, _id: 0}).exec();

        const perArray = [];
        modulePermisos.forEach((per) => {
            perArray.push(per.modulopermiso)
        })
        const data = {
            role: role,
            modulopermisos: perArray
        }
        res.status(200).json(data)

    } catch (e) {
        res.status(400).json({error: "No se encontraron datos"})
    }
}

//actualiza todo el rol con sus permisos
const update = async (req, res) => {

    const id = req.params.id
    const {role, descripcion = null, permisosrole = [], empresasids = []} = req.body

    const {error} = schemaModulo.validate({
        role: role,
        permisosrole: permisosrole
    })

    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }
    //eliminamos todos los rol modulo permisos
    RoleModuloPermisos.deleteMany({role: id}).exec();

    const updateRole = {
        role: role,
        description: descripcion
    }

    Roles.findOneAndUpdate({_id: id}, {
            $set: updateRole
        }, {new: true},
        (error, result) => {
            if (error) {
                return res.status(400).send({error: "No se actulizo el role"});
            }
        })

    for (const permisos of permisosrole) {
        const rmp = new RoleModuloPermisos({
            modulopermiso: permisos,
            role: id
        })

        rmp.save((err, result) => {
            if (error) {
                return res.status(400).send({error: "No se almaceno el rol modulo permiso"});
            }
        })
    }

    return res.status(200).send({success: "Actualizado"});
}

//metodo que elimina
const eliminar = async (req, res) => {
    const id = req.params.id
    //eliminamos todos los rol modulo permisos
    try {
        RoleModuloPermisos.deleteMany({role: id}).exec();
       const roleDelete = await Roles.deleteOne({_id: id}).exec();
       console.log(roleDelete)
        return res.status(200).send({success: "Eliminado"});
    }catch (e) {
        return res.status(400).send({error: "No se logro eliminar"});
    }

}

module.exports = {
    index,
    store,
    edit,
    update,
    eliminar
}
