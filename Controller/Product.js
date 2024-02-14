const productModel = require("../Model/productModel");
const fs = require('fs')
const { default: slugify } = require("slugify");
const categoryModel = require("../Model/categoryModel");
const User = require("../Model/User");
const { hashPassword } = require("../Helper/auth");
const braintree = require('braintree');
const orderModel = require("../Model/orderModel");
require('dotenv').config()

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description,category, price, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(401).json({
          success: false,
          message: "Name is required",
        });

      case !category:
        return res.status(401).json({
          success: false,
          message: "category is required",
        });

      case !description:
        return res.status(401).json({
          success: false,
          message: "Description is required",
        });

      case !quantity:
        return res.status(401).json({
          success: false,
          message: "Quantity is required",
        });

      case !price:
        return res.status(401).json({
          success: false,
          message: "Price is required",
        });
      // case !shipping:
      //   return res.status(401).json({
      //     success: false,
      //     message: "Shipping is required",
      //   });
      case photo && photo.size > 4000000:
        return res.status(401).send({
          success: false,
          message: "Photo is required",
        });
    }

    const products = new productModel({...req.fields,slug:slugify(name)})

    if(photo){
      products.photo.data = fs.readFileSync(photo.path)
      products.photo.contentType = photo.type
    }

    const createdProduct = await productModel.create(products)
    res.status(200).send({
      success:true,
      message:"Product is created successfully",
      createdProduct
    })
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in create Product",
    });
  }
};


exports.getProducts = async(req,res) =>{
  try{
    const products = await productModel.find({}).populate("category").select("-photo").limit(10).sort({createdAt : -1})
    res.status(200).send({
      success:true,
      Total : products.length,
      message:"Product is fetch from the database successfully",
      products
    })

  }catch(error){
    // console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error in get products",
      error
    })

  }
}


exports.getSingleProduct = async(req,res) =>{
  try{
   const product = await productModel.findOne({slug:req.params.slug}).populate("category").select("-photo")

    res.status(200).send({
      success:true,
      message:"get the single Products successfully",
      product
    })
  }catch(error){
    // console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error in get the single product"
    })
  }
}


           
exports.productPhoto = async(req,res) =>{
  try{
    const product = await productModel.findById(req.params.pid).select("photo")
    if(product.photo.data) {
      res.set('Content-type',product.photo.contentType)

      return res.status(200).send(product.photo.data)

    }
  }catch(error){
    // console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error in product photo"
    })
  }
}


exports.deleteProduct = async(req,res)=>{
  try{
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).json({
      success:true,
      message:"Product delete successfully"
    })

  }catch(error){
    // console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error in delete product"
    })
  }
}



exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(401).json({
          success: false,
          message: "Name is required",
        });

      case !category:
        return res.status(401).json({
          success: false,
          message: "category is required",
        });

      case !description:
        return res.status(401).json({
          success: false,
          message: "Description is required",
        });

      case !quantity:
        return res.status(401).json({
          success: false,
          message: "Quantity is required",
        });

      case !price:
        return res.status(401).json({
          success: false,
          message: "Price is required",
        });
      // case !shipping:
      //   return res.status(401).json({
      //     success: false,
      //     message: "Shipping is required",
      //   });
      case !photo:
        return res.status(401).json({
          success: false,
          message: "Photo is required",
        });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    // const products = new productModel({...req.fields,slug:slugify(name)})

    // if(photo){
    //   products.photo.data = fs.readFileSync(photo.path)
    //   products.photo.contentType = photo.type
    // }

    // const {id} = req.params.pid
    // const createdProducts = await productModel.findByIdAndUpdate(id,products,{new:true})
    res.status(200).json({
      success:true,
      message:"Product is update successfully",
      products
    })
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in update Product",
    });
  }
};


exports.filterProduct = async(req,res)=>{
  try{
    const {checked,radio} = req.body
    let args = {}
    if(checked.length > 0) args.category = checked
    
    if(radio.length) args.price = { $gte: radio[0] , $lte : radio[1]}
    const products = await productModel.find(args)

    res.status(200).send({
      success : true,
      message:"Product is filterd successfully",
      products
    })

  }catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in Filter Product"
    })
  }
}

exports.countProduct = async(req,res)=>{
  try{
   const total = await productModel.find({}).estimatedDocumentCount()
   res.status(200).send({
    success:true,
    message:"Count the product successfully",
    total
   })
  }catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in count the product"
    })
  }
}

exports.listProduct = async(req,res)=>{
  try{
    const perPage = 4
    const page = req.params.page ? req.params.page :1
    const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt : -1})

    res.status(200).send(
      {
        success:true,
        message:"List product success",
        products
      }
    )
  }catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in Product list controller"
    })
  }
}

exports.searchProduct = async(req,res) =>{
  try{
    const {keyword} =req.params
    const results = await productModel.find({
      $or:[
        {name : { $regex : keyword,$options:"i"}},
        {description : { $regex : keyword,$options:"i"}}
      ]
    }).select("-photo")

    res.json({
      results
    })
  }catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in search Product"
    })
  }
}



exports.relatedProducts = async(req,res)=>{
  try{
      const {pid,cid} = req.params
      const products = await productModel.find({
        category:cid,
        _id:{$ne:pid}
      })
      .select("-photo")
      .limit(3)
      .populate("category")

      res.status(200).send({
        success:true,
        products
      })
  }
  catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in related Product Controller"
    })
  }
}

exports.categoryProduct = async(req,res)=>{
  try{
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
      success:true,
      category,
      products
    })
  }
  catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in category Product"
    })
  }
}

exports.updateProfile =async(req,res)=>{
  try{
      const {name,email,password,phone,address} = req.body
      const user = await User.findById(req.user._id)

      if(password && password.length <6){
        return res.json({error:'password is required and 6 charecter long'})
      }
      const hashedPassword = password ? await hashPassword(password) : undefined
      const updatedUser = await User.findByIdAndUpdate(req.user._id,{
        name:name || user.name,
        password:hashedPassword || user.password,
        phone:phone || user.phone,
        address:address || user.address,
      },{new:true})
      res.status(200).send({
        success:true,
        updatedUser
      })
  }catch(error){
    // console.log(error)
    res.status(500).json({
      success:false,
      message:"Error in Update Profile",
      error
    })
  }
}

exports.braintreeToken = async(req,res)=>{
  try{
     gateway.clientToken.generate({}, function (err,response){
      if(err){
        res.status(500).send(err)
      }else{
        res.send(response)
      }
     })

  }catch(error){
    //  console.log(error)
     res.status(500).json({
      success:false,
      message:"Error in Brain Tree Token"
     })
  }
}

exports.braintreePayment = async(req,res)=>{
  try{
    const {cart,nonce} = req.body
    let total = 0
    cart.map((i) =>{total += i.price})

    let newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true
      }
    },
    function(error,result){
      if(result){
        const order = new orderModel({
          products:cart,
          payment:result,
          buyer:req.user._id
        }).save()

        res.json({ok:true})
      }else{
        res.status(500).send(error)
      }
    }
    )
    }
  catch(error){
    // console.log(error)
    res.status(500).json({
     success:false,
     message:"Error in Brain Tree Payment"
    })
  }
}