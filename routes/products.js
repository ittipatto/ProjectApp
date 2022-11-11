var express = require('express');
var router = express.Router();
const Manages = require('../models/manages')
const { check, validationResult } = require('express-validator');
const { request } = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
    Manages.getAllProducts(function(err,manages){
        if(err) throw err
        res.render('products', { manages:manages });
    })

});


router.post('/search',(req, res)=> {
    const search = req.body.searchBar
    console.log(search) 
})

module.exports = router;