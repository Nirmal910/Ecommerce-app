const JWT = require("jsonwebtoken")
const User = require("../Model/User")

exports.isUser = async(req,res,next)=>{
    try{
    //  const token = req.header('Authorization')
     const token = req.headers.authorization
    //    console.log("Token =========" + token)
       const decode = JWT.verify(token,process.env.JWT_SECRET)
       req.user = decode
       next()
    }
    catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in midddleware"
        })
    }
}

exports.isAdmin = async(req,res,next)=>{
    try{
        const user = await User.findById({_id : req.user._id})
        if(user.role !== 1){
            return res.status(401).json({
                success:false,
                message:"Role is not match"
            })
        }
        next()

    }
    catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            error,
            message:"Error in is Admin middleware"
        })
    }
}