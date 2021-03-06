const express = require('express'),
    router = express.Router(),
    { index, permisos, store, edit, update, eliminar, modulos} = require('../Controller/ModulosController');

// index
router.get('/', index)

// index
router.get('/permisos', permisos)

// // store
router.post('/',store)
//
// //edit
router.get('/edit/:id',edit)
//
// //Actualizar
router.put('/:id', update)
//
// //Eliminar
router.delete('/:id',eliminar)

//Muestra modulos
router.get('/modulos',modulos)

module.exports = router;
