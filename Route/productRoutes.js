const express = require("express")
const formidable = require('express-formidable')
const { isUser, isAdmin } = require("../Middleware/authMiddleware")
const { createProduct,
     getProducts, 
     getSingleProduct, 
     productPhoto, 
     deleteProduct, 
     updateProduct, 
     filterProduct, 
     countProduct, 
     listProduct,
     searchProduct,
     relatedProducts,
     categoryProduct,
     braintreeToken,
     braintreePayment
    }
 = require("../Controller/Product")
const router = express.Router()

router.post('/create-product',isUser,isAdmin,formidable(),createProduct)
router.get('/get-products',getProducts)
router.get("/get-product/:slug",getSingleProduct)
router.get("/product-photo/:pid" , productPhoto)
router.delete("/delete-product/:pid",deleteProduct)
router.put('/update-product/:pid',isUser,isAdmin,formidable(),updateProduct)

//filter Product
router.post("/product-filter",filterProduct)
//count the product
router.get("/product-count",countProduct)
router.get("/product-list/:page",listProduct)
router.get("/search/:keyword",searchProduct)

router.get("/relatedProduct/:pid/:cid",relatedProducts)

router.get("/product-category/:slug",categoryProduct)

//Payment Route

router.get('/braintree/token',braintreeToken)
router.post('/braintree/payment',isUser,braintreePayment)


module.exports = router