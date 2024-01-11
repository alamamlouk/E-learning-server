const category=require("../models/Category")
const HttpError=require("../models/errorModel")

//Add Category
const createCategory=async (req,res,next)=>{
    try{
        const{
            categoryName
        }=req.body
        if(!categoryName)
        {
            return next(new HttpError("fill in  the  fields",422))
        }
        const findCategory=await category.findOne({categoryName: categoryName})
        if(findCategory){
            return next(new HttpError("Category already exist",422))
        }
        const newCategory=await category.create(
            req.body
        )
        res.status(201).json(newCategory)
    }catch (error){
        return next(new HttpError("error in adding the category",500))
    }
}
//Update Category
const updateCategory=async (req,res,next)=>{
    try {
        let{categoryName}=req.body;
        let categoryId=req.params.id
        if(!categoryName){
            return next(new HttpError("field shouldn't be empty ",422))
        }
        let updatedCategory=await category.findByIdAndUpdate(categoryId,{categoryName:categoryName },{new:true} )
        if(!updatedCategory){
            return next(new HttpError("Couldn't Update post",400))
        }
        res.status(200).json(updatedCategory)
    }catch (error){
        return next(new HttpError(error))
    }
}
// Delete Category
const deleteCategory=async (req,res,next)=>{
    try {
        const categoryId=req.params.id
        if(!categoryId)
        {
            return next(new HttpError("Category invalid",400))
        }
        const findCategory= await category.findById(categoryId)
        if(!findCategory){
            return next(new  HttpError("Invalid Category",400))
        }
        await category.findByIdAndDelete(categoryId)
        res.json("Category deleted successfully")
    }catch (error){
        return next(new HttpError(error))
    }
}
const getCategories=async (req,res,next)=>{
    try{
        const categories = await category.find().sort({categoryName: 1})
        res.status(200).json(categories)
    }catch (error){
        return next(new HttpError(error))
    }
}

module.exports={
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
}