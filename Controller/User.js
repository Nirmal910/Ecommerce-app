const User = require("../Model/User")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../Helper/auth")
const orderModel = require("../Model/orderModel")
require("dotenv").config()

exports.registerUser = async(req,res)=>{
    try{
        const {name,email,password,address,phone,answer} = req.body
        // console.log(req.body)

        if(!name || !email || !password || !address || !phone || !answer){
            return res.status(401).json({
                success:false,
                message:"Require all the details"
            })
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"user is already registered"
            })
        }

        const hashedPassword = await hashPassword(password);

        const createUser = await User.create({name,email,password:hashedPassword,phone,address,answer})
        // console.log(createUser)

        res.status(200).json({
            success:true,
            messsage:"success create a user",
            createUser
        })
    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:"false",
            message:"This is fails"
        })
    }
}

exports.login = async(req,res) =>{
    try{
        const {email,password} = req.body

        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Please give a required details"
            })
        }

        const user = await User.findOne({email})

        if(!user){
           return res.status(404).json({
            success:false,
            message:"User is not registerd"
           })
        }
        const match = await comparePassword(password, user.password);

        if(!match){
            return res.status(401).json({
                success:false,
                message:"Password is not match"
            })
        }

        //create a payload
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

        return res.status(200).json({
            success:true,
            message:"Login Successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        })
       
    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:"User is not login something error"
        })
    }
}

// Forget Password 

exports.forgotPassword = async(req,res) =>{
    try{
        const {email,answer,newPassword} = req.body

        if(!email || !answer || !newPassword){
            return res.status(401).json({
                success:false,
                message:"Required all the details"
            })
        }

        const user = await User.findOne({email,answer})

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User is not found"
            })
        }

        const hashedPassword = await hashPassword(password);
        await User.findByIdAndUpdate(user._id , {password:hashedPassword})

        res.status(200).json({
            success:true,
            message:"Password is updated successfully"
        })

    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:true,
            message:"Someting went wrong"
        })
    }
}

exports.test = async(req,res)=>{
    res.send("Protected Routes")
}

exports.getOrder = async(req,res)=>{
    try{
         const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")

         res.send(orders)
    }
    catch(error){
        // console.log(error)
        res.status(500).json({
            success:false,
            message:"Error in get Order Controller"
        })
    }
}

exports.allOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt : -1})
        res.send(orders)
   }
   catch(error){
    //    console.log(error)
       res.status(500).json({
           success:false,
           message:"Error in get All Orders Controller"
       })
   }
}

exports.statusOrder = async(req,res)=>{
    try{
   const {orderId} = req.params
   const {status} = req.body
   const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
   res.send(orders)
    }
    catch(error){
        // console.log(error)
        res.status(500).json({
            success:false,
            message:"Error in get status Order Controller"
        })
    }
}