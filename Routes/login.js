const express = require('express'),
    router = express.Router(),
    Usuario = require('../Models/Usuarios'),
    bcrypt = require("bcrypt"),
    Joi = require("@hapi/joi"),
    jwt = require('jsonwebtoken');
const Usuarios = require("../Models/Usuarios");

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/', async function (req, res) {

    const {email, password} = req.body

    const {error} = schemaLogin.validate({
        email: email,
        password: password
    });
    if (error){
        return res.status(400).json({error: error.details[0].message})
    }

    const user = await Usuario.findOne({email: email});
    if (!user) {
        return res.status(400).json({error: 'Correo no encontrado'})
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
        return res.status(400).json({error: 'contraseña no válida'})
    }

    const tokenGenerate = jwt.sign({
        name: user.nombre,
        id: user._id,
        role: user.role
    }, "supersecreto",{
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    console.log("token generado = "+tokenGenerate)

    Usuario.findOneAndUpdate({_id: user._id}, {
            $set: { token : tokenGenerate}
        }, {new: true},
        (error, result) => {
            if (error) {
                res.send(error)
            }
        })

    return res.json(user)

})

module.exports = router;
