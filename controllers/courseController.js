const course = require("../models/courseModel")
const User = require("../models/userModel")
const UserCourse = require('../models/userCourseModel')
const HttpError = require("../models/errorModel");
const category=require('../models/Category')
const fs=require('fs')
const path=require("path")
const {v4:uuid}=require('uuid')
const getCourses = ((req, res) => {
    course.find({}).populate([
        { path: "instructor", select: "email" },
        { path: "category", select: "categoryName" }
    ])
        .then(result => res.status(200).json({"courses":result}))
        .catch((error) => res.status(500).json({msg: error}))
})
const getCourseById=async (req,res,next)=>{
    try{
        const courseId =  req.params.courseId
        let findCourse = await course.findById(courseId)
        if (!findCourse) {
            return next(new HttpError("course not found", 400))
        }
        res.status(200).json(findCourse)
    }catch (error){
        return next(new HttpError(error))
    }
}
//Fix Error handle
const createCourse = async (req, res,next) => {
    try {
        const instructorId = req.user.id;
        const {courseName, DateOfAddingCourse, TimeToCompleteTheCourse, categoryId, freeOrNot, price,description} = req.body;
        //const lessons=req.body.lessons
        const{courseImage}=req.files
        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return next(new HttpError("Invalid instructor ID :",400))
        }
        const findCategory=await category.findById(categoryId)
        if(!findCategory)
        {
            return next(new HttpError("no available category ",400))
        }
        if(courseImage.size>2000000)
        {
            return  next(new HttpError("Image should be less then 2 MB",422))
        }
        let fileName=courseImage.name
        let splitFileName=fileName.split('.')
        let newFileName=splitFileName[0]+uuid()+"."+splitFileName[splitFileName.length-1]
        await courseImage.mv(path.join(__dirname, "..", "uploads", newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err))
            }else{
                const newCourse = await course.create({
                    courseName,
                    DateOfAddingCourse,
                    TimeToCompleteTheCourse,
                    category:categoryId,
                    freeOrNot,
                    price,
                    instructor,
                    description,
                    courseImage:newFileName,
                    //lessons:lessons
                });
                await User.findByIdAndUpdate(instructorId, {$addToSet: {courseCreated: newCourse}});
                res.json({message: 'Course created successfully',courseId:newCourse._id});
            }
        })
    } catch (error) {

        return next(new HttpError("Error creating course : "+error))
    }
}
const addLessons= async (req,res,next)=>{
    try{
        const courseId = req.params.courseId;
        const findCourse =  await course.findById(courseId);

        if (!findCourse) {
            return next(new HttpError(`Course with ID ${courseId} not found`, 404));
        }

        for (const lesson of req.body) {
            findCourse.lessons.push(lesson);
        }

        await findCourse.save();

        res.status(201).json(findCourse);
    }catch (error)
    {
        return next(new HttpError(error))
    }
}
//Fix Error Handle
const setCourseRating = async (req, res) => {
    const courseId = req.body.courseId;
    const findCourse = course.findById(courseId);
    if (!findCourse) {
        return res.status(400).json({message: "Course not found "})
    }
    try {
        const coursesToAverage = await UserCourse.aggregate([{
            $match: {
                course: courseId, ratedBefore: true
            }
        }, {
            $group: {
                _id: "$course", // Group by course ID
                totalRating: {$sum: "$rating"}, count: {$sum: 1} // Count the number of ratings
            }
        }, {
            $project: {
                courseId: "$_id", // Rename course ID for clarity
                totalRating: "$totalRating"
            }
        }]);

        res.json(coursesToAverage);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error fetching and calculating average ratings'});
    }
}
//Fix Error Handle
const editCourse=async (req,res)=>{
    const courseId=req.params.courseId;
    const findCourse=await course.findById(courseId)
    if(!findCourse){
        return res.status(404).json({message:"Course not Found"})
    }
    try{
        const updatedCourse=await course.findByIdAndUpdate(courseId,req.body,{new:true})
        res.json(updatedCourse)
    }catch (error)
    {
        res.status(400).json({message:'Error in updating Course: '+error.message})
    }
}

//Delete Course
const deleteCourse=async(req,res)=>{}

//findOneCourse
const getCourse=async (req,res)=>{}

const testFile=async (req,res,next)=>{
    try {
        res.json(req.files)
        console.log(req.files)
    }
    catch (error){
        return next(new HttpError(error))
    }
}
const getCoursesByInstructor=async (req,res,next)=>{

    try{
        const instructorId = req.user.id;
        const findInstructor = await User.findById(instructorId)
        if (!instructorId) {
            return next(new HttpError("Instructor not found", 400))
        }
        const findCourses = await course.find({instructor: instructorId})
        res.status(200).json(findCourses)
    }
    catch (error)
    {
        return next(new HttpError(error))
    }

}
module.exports = {
    getCourses,
    getCoursesByInstructor,
    createCourse,
    setCourseRating,
    editCourse,
    addLessons,
    testFile,
    getCourseById
}