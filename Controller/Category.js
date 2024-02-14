const { default: slugify } = require("slugify")
const categoryModel = require("../Model/categoryModel")

exports.createCategory = async(req,res)=>{
 try{
    const {name} = req.body

    if(!name){
        return res.status(401).json({
            success:false,
            message:"Require the data"
        })
    }
    const existingCategory = await categoryModel.findOne({name})

    if(existingCategory){
        return res.status(402).json({
            success:false,
            message:"Category is already created"
        })
    }

    //Some Changes is hear
   const category =  await categoryModel.create({name,slug:slugify(name)})
//    console.log(category)
   res.status(201).json({
    success:true,
    message:"Category is created Successfully",
    category
   })

 }catch(error){
    // console.log(error)
    res.status(500).json({
            success:false,
            message:"Something went Wrong in create Category "
        })
 }
}

exports.updateCategory = async(req,res)=>{
    try{
        const {name} = req.body
        // const exist = await categoryModel.findOne({name})

        // if(!exist){
        //     return res.status(404).json({
        //         success:false,
        //         message:"category is not exist"
        //     })
        // }

        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

        res.status(200).json({
            success:true,
            message:"category is updated successfully"

        })


    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong in update category"
        })
    }
}


exports.allCategory = async(req,res)=>{
    try{
        const category = await categoryModel.find({})

        res.status(200).send({
            success:true,
            message:'All category fetch successfully',
            category
        })

    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong in get all category"
        })
    }
}

exports.singleCategory = async(req,res)=>{
    try{

        const singleCategory = await categoryModel.findOne({slug:req.params.slug})
       
        // if(!singleCategory){
        //     return res.status(404).json({
        //         success:false,
        //         message:"category not found"
        //     })
        // }
        res.status(200).json({
            success:true,
            message:"Category is found successfully",
            singleCategory
        })

    }catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong in single category"
        })
    }
}

exports.deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params

        await categoryModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"category is deleted successfully"
        })

    }
    catch(error){
        // console.log(error)
        return res.status(500).json({
            success:false,
            message:'something went wrong in delete category'
        })
    }
}