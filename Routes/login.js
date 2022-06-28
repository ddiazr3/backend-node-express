const express = require('express'),
     router = express.Router(),
    inicialEvent = require('../Events/InicialEvent');

router.get('/login', function (res, res, next) {
    inicialEvent.countCar();
    res.send("Estamos en el login")
})

module.exports = router;
