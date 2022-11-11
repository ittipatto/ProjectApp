var express = require('express');
var router = express.Router();
const Manages = require('../models/manages')
var axios = require('axios')
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact');
});

module.exports = router;