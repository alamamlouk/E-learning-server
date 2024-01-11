const course = require("../models/courseModel")
const User = require("../models/userModel")
const UserCourse = require('../models/userCourseModel')
const HttpError = require("../models/errorModel");
const getCourses = ((req, res) => {
    course.find({}).populate({path: "instructor", select: "email"})
        .then(result => res.status(200).json({"courses":result}))
        .catch((error) => res.status(500).json({msg: error}))
})

//Fix Error handle
const createCourse = async (req, res,next) => {
    try {
        const instructorId = req.params.instructor;
        const {courseName, DateOfAddingCourse, TimeToCompleteTheCourse, category, freeOrNot, price} = req.body;

        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return next(new HttpError("Invalid instructor ID :",400))
        }

        const newCourse = await course.create({
            courseName, DateOfAddingCourse, TimeToCompleteTheCourse, category, freeOrNot, price, instructor,
        });

        await User.findByIdAndUpdate(instructorId, {$addToSet: {courseCreated: newCourse}});

        res.json({message: 'Course created successfully'});
    } catch (error) {

        return next(new HttpError("Error creating course : "+error.message,500))
    }
}

//Fix Error Handle
const setCourseRating = async (req, res) => {
    const courseId = req.body.courseId;
    const findCourse = course.findById(courseId);
    if (!findCourse) {
        return res.status(400).josn({message: "Course not found "})
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


module.exports = {
    getCourses,
    createCourse,
    setCourseRating,
    editCourse
}