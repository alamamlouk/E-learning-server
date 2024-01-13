const express=require("express")
const router=express.Router()
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
}=require('../controllers/categoryController')
const authMiddleware=require("../middleware/authMiddleware")

router.post('/createCategory',createCategory)
router.put("/updateCategory/:id",updateCategory)
router.delete("/deleteCategory/:id",deleteCategory)
router.get("/getCategories",getCategories)
module.exports=router