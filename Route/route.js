const express = require("express")
const router = express.Router()
const {registerUser,login,test,forgotPassword, getOrder, statusOrder, allOrders} = require("../Controller/User")
const {isUser, isAdmin} = require("../Middleware/authMiddleware")
const { updateProfile } = require("../Controller/Product")

router.post("/registeruser",registerUser)
router.post("/login",login)
router.get("/test",isUser,isAdmin,test)


//forgot password
router.post("/forgot-password",forgotPassword)
// Protected Route for Dashboard

router.get("/auth-user",isUser , (req,res) =>{
    res.status(200).json({
        success:true,
    })
})

//Protected route for Admin
router.get("/admin-auth",isUser ,isAdmin, (req,res) =>{
    res.status(200).json({
        success:true,
    })
})

router.put("/profile",isUser,updateProfile)

router.get("/order",isUser,getOrder)

router.get("/all-order",isUser,isAdmin,allOrders)

router.put("/order-status",isUser,isAdmin,statusOrder)



module.exports = router