const express = require('express'),
    router = express.Router(),
    empresaController = require('../Controller/EmpresaController');

router.get('/', function (req, res, next) {

    const empresa = empresaController.index(req)

    res.send(empresa)
})

module.exports = router;
