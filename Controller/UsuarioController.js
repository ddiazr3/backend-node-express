const Usuarios = require('../Models/Usuarios')
const mongoose = require("mongoose");

//muestra el listado de usuarios activos
const index = (req, res) => {
    Usuarios.find((error, result) => {
        if (error) {
            res.send(error)
        }
        res.json(result)
    })
};

//almacena y actualiza
const store = (req, res) => {


    const newUser = new Usuarios({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        dpi: req.body.dpi,
        email: req.body.email,
        password: req.body.password
    })

    newUser.save((error, result) => {
        if (error) {
            res.send(error)
        }

        res.json(result)
    })
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
const update = (req, res) => {
    const id = req.params.id
    Usuarios.findOneAndUpdate({_id: id}, {
            $set: req.body
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
    Usuarios.deleteOne({_id: req.params.id})
        .then(() => resp.json({message: "Usuario eliminado"}))
        .catch((err) => res.send(err))
}

module.exports = {
    index,
    store,
    edit,
    update,
    eliminar
}
