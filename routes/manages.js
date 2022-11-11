var express = require('express');
var router = express.Router();
const Manages = require('../models/manages')
const { check, validationResult } = require('express-validator');
const { request } = require('express');

router.get('/', function(req, res, next) {
    Manages.getAllProducts(function(err,manages){
        if(err) throw err
        res.render('manages',{data:"Hello Mongoose", manages:manages});
    })
});

router.get('/addProduct', function(req, res, next) {
    res.render('addProduct');
});

router.get('/delete/:id', function(req, res, next) {
    Manages.deleteProduct([req.params.id], function(err){
        if (err) throw err
        res.redirect("/manages")
    })
});


// router.post('/addProduct', function(req, res, next) {
//     console.log(req.body.name);
//     console.log(req.body.price);
//     console.log(req.body.number);
//     console.log(req.body.dangerNumber);
//     console.log(req.body.safeNumber);
// });

router.post('/addProduct',[
    check("name" , "กรุณาป้อนชื่อสินค้า").not().isEmpty(),
    check("price" , "กรุณาป้อนราคาสินค้า").isFloat({min:0}),
    check("number" , "กรุณาป้อนจำนวนสินค้า").isInt({min:0}),
    check("dangerNumber" , "กรุณาป้อนจำนวนที่ใกล้หมด").isInt({min:0}),
    check("safeNumber" , "กรุณาป้อนจำนวนที่่ปลอดภัย").isInt({min:0})
], function(req, res, next) {
    const result = validationResult(req);
    var errors = result.errors;
    for(var key in errors){
        console.log(errors[key].value)
    }
    if (!result.isEmpty()) {
        res.render('addProduct', {
            errors:errors
        }) 
    } else {
        data = new Manages({
            name:req.body.name,
            price:parseFloat(req.body.price),
            number:parseInt(req.body.number),
            dangerNumber:parseInt(req.body.dangerNumber),
            safeNumber:parseInt(req.body.safeNumber)
        })
        Manages.createProduct(data, function(err){
            if(err) console.log(err);
            req.flash("error", "บันทึกข้อมูลเรียบร้อย");
            res.redirect("/manages/addProduct")
        });
    }
});

// router.post('/insert',(req, res)=> {
//     let data = new Manages.createProduct({
//         name:req.body.name,
//         price:parseFloat(req.body.price),
//         number:parseInt(req.body.number),
//         dangerNumber:parseInt(req.body.dangerNumber),
//         safeNumber:parseInt(req.body.safeNumber)
//     })
//     Manages.saveProduct(data,(err)=>{
//         if(err) console.log(err)
//         res.redirect('/')
//     })
// })

router.post('/edit',(req, res)=> {
    const edit_id = req.body.edit_id
    // console.log(edit_id)
    Manages.findOne({_id:edit_id}).exec((err, data)=>{
        res.render('edit',{product:data})
    })
})

router.post('/update',[
    check("name" , "กรุณาป้อนชื่อสินค้า").not().isEmpty(),
    check("price" , "กรุณาป้อนราคาสินค้า").isFloat({min:0}),
    check("number" , "กรุณาป้อนจำนวนสินค้า").isInt({min:0}),
    check("dangerNumber" , "กรุณาป้อนจำนวนที่ใกล้หมด").isInt({min:0}),
    check("safeNumber" , "กรุณาป้อนจำนวนที่่ปลอดภัย").isInt({min:0})
],(req, res)=> {
    const update_id = req.body.update_id
    const result = validationResult(req);
    var errors = result.errors;
    for(var key in errors){
        console.log(errors[key].value)
    }
    if (!result.isEmpty()) {
        res.render('addProduct', {
            errors:errors
        }) 
    } else {
        let data = {
            name:req.body.name,
            price:parseFloat(req.body.price),
            number:parseInt(req.body.number),
            dangerNumber:parseInt(req.body.dangerNumber),
            safeNumber:parseInt(req.body.safeNumber)
        }

            Manages.findByIdAndUpdate(update_id, data).exec(err=> {
        res.redirect('/manages')
    })
    }

    // console.log("ข้อมูลใหม่ที่ส่งมา = ", data)
    // console.log("รหัส = ", update_id)

})


router.post('/updateNumber',[
    check("number" , "กรุณาป้อนจำนวนสินค้า").isInt({min:0})
],(req, res)=> {
    const update_id = req.body.edit_id
    const input = parseInt(req.body.number)
    console.log("รหัส = ", update_id)
    console.log(input);
    Manages.getAllProducts(function(err,manage){
        const result = validationResult(req);
        var errors = result.errors;
        for(var key in errors){
            console.log(errors[key].value)
        }
        if(err) throw err
        Manages.findById(update_id, function (err, docs) {
            const number = parseInt(docs.number)
            const button = req.body.operator
            if (isNaN(input) || input < 0 || (input % 1 != 0) ) {
                res.render('manages',{ manages:manage, errors:errors});
            } else {
                if(button == "plus" ) {
                    const newNumber = number + input
                    let data = {
                        number:parseInt(newNumber)
                    }
                    Manages.findByIdAndUpdate(update_id, data).exec(err=> {
                        res.redirect('/manages')
                    })
                    console.log("Hello plus")
                }else {
                    const newNumber = number - input
                    let data = {
                        number:parseInt(newNumber)
                    }
                    Manages.findByIdAndUpdate(update_id, data).exec(err=> {
                        res.redirect('/manages')
                    })
                    console.log("Hi minus")
                }
            }
        });
    })
})


module.exports = router;

