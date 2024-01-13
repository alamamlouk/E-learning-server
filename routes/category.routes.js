const express=require("express")
const router=express.Router()
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
}=require('../controllers/categoryController')
const authMiddleware=require("../middleware/authMiddleware")

router.post('/createCategory',authMiddleware.authMiddleware,createCategory)
router.put("/updateCategory/:id",authMiddleware.authMiddleware,updateCategory)
router.delete("/deleteCategory/:id",authMiddleware.authMiddleware,deleteCategory)
router.get("/getCategories",authMiddleware.authMiddleware,getCategories)
module.exports=router