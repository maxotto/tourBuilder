const Path = require('path');
const Fs = require('fs-extra');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send({
        success: true,
        message: `folder list is here`,
    })
});

module.exports = router;