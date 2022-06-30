const express = require('express'),
    router = express.Router(),

    { index, store, edit, update, eliminar } = require('../Controller/UsuarioController');

// index
router.get('/',index)

// store
router.post('/',store);

//edit
router.get('/edit/:id', edit)

//Actualizar
router.put('/:id', update)

//Eliminar
router.delete('/:id',eliminar)

module.exports = router;
