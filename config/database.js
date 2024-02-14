const mongoose = require("mongoose")
require("dotenv").config()

exports.connect = async() =>{
    try{
        const conn = await mongoose.connect(process.env.DATABASE,{})
        console.log("Db is connected")
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}