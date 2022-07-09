const express = require('express'),
    router = express.Router(),
    { index, store, edit, update, eliminar, catalogos, activar } = require('../Controller/EmpresaController');

// index
router.get('/',index)

//edit
router.get('/catalogos',catalogos)

// store
router.post('/',store)

//edit
router.get('/edit/:id',edit)

//Actualizar
router.put('/:id', update)

//Desactiva
router.delete('/:id', eliminar)

//Activa
router.get('/activar/:id', activar)

module.exports = router;
