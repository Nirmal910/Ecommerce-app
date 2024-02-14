const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:{},
        required:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    answer:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true
    },
},{timestamps:true})

module.exports = mongoose.model("user",userSchema)