const express = require('express'),
    router = express.Router();


router.get('/', async function (req, res) {
    res.send("ok")
})

module.exports = router;
