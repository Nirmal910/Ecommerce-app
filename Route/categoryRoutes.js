const express = require('express')
const router = express.Router()
const { isUser, isAdmin } = require('../Middleware/authMiddleware')
const { createCategory, updateCategory, allCategory, singleCategory, deleteCategory } = require('../Controller/Category')


router.post('/create-category',isUser,isAdmin,createCategory)
router.put('/update-category/:id',isUser,isAdmin,updateCategory)

router.get("/all-category",allCategory)

router.get("/single-category/:slug",singleCategory)

router.delete("/delete-category/:id",isUser,isAdmin,deleteCategory)

module.exports = router