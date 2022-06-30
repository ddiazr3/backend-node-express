const express = require('express'),
    router = express.Router(),
    ingresoEgresoController = require('../Controller/IngresoEgresoController');

// index
router.get('/', function (req, res, next) {

   // const empresa = empresaController.index(req)

    res.send(empresa)
})

// store
router.post('/',function (req, res, next) {

})

//edit
router.get('/:id',function (req, res, next) {

})

//Actualizar
router.put('/:id', function (req, res, next) {

})

//Eliminar
router.delete('/:id', function (req, res, next) {

})

module.exports = router;
