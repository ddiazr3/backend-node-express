const express = require('express'),
    router = express.Router(),
    {index, store, edit, update, eliminar, activar, exportar, catalogos} = require('../Controller/UsuarioController');

// index
router.get('/', index)

// store
router.post('/', store);

//edit
router.get('/edit/:id', edit)

//Actualizar
router.put('/:id', update)

//Desactiva
router.delete('/:id', eliminar)

//Activa
router.get('/activar/:id', activar)

//exportar
router.get('/export', exportar);

//catalogos
router.get('/catalogos', catalogos);

module.exports = router;
