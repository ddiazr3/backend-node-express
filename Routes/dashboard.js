const express = require('express'),
    router = express.Router();
// index
router.get('/', function (req, res, next) {
    res.send("accesodio")
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
