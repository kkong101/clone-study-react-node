const express = require('express')
const router = express.Router();
const multer = require('multer');
const {Product} = require('../models/Product')

var storage = multer.diskStorage({
    destination : function (req,file,cb) {
        cb(null, 'uploads/')
    }, 
    filename : function (req,file,cb) {
        cb(null, `${Date.now()}_${file.originalname}` )
    }
})

var upload = multer({storage : storage}).single("file");

router.post('/',(req,res) => {
    console.log('test')
    console.log(req.body)

    const product = new Product(req.body)
    product.save((err) => {
        if(err) {
            return res.status(400).json({success: false, err})
        } else {
            return res.status(200).json({success: true})
        }
    })
})


router.post('/image',(req,res) => {
    upload(req,res, err => {
        if(err) {
            return req.json({ success : false , err})
        }
        
        return res.json({ success: true, filePath :res.req.file.path , fileName: res.req.file.fileName})
    })
})


router.post('/products',(req,res) => {
    // product collection에 들어 있는 모든 상품 정보를 가져오기 

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(reql.body.skip) : 0;
    let term = req.body.searchTerm

    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            findArgs[key] = req.body.filters[key]
        } 
    }

    if(term) {
        Product.find(findArgs)
        .find({$text: {$search: term }})
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err,productInfo) => {
            if(err) return res.status(400).json({success: false, err})
            return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
        })
    } else {
        Product.find()
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err,productInfo) => {
            if(err) return res.status(400).json({success: false, err})
            return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
        })
    }  
})


router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    console.log("req.query.id", req.query.id)

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
    }

    console.log("productIds", productIds)


    //we need to find the product information that belong to product Id 
    Product.find({ '_id': { $in: productIds } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});


module.exports = router;