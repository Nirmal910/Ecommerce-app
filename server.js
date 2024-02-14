const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const path = require('path')

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, './client/build')))


const db = require("./config/database")
db.connect()
const router = require("./Route/route")
const categoryRoutes = require("./Route/categoryRoutes")
const productRoutes = require('./Route/productRoutes')

app.use("/api/v1",router)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))

})

app.listen(PORT,()=>{
    console.log("App is listen at the port " + PORT)
})

