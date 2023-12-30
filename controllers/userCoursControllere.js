const course=require('../models/courseModel')
const User=require('../models/userModel')
const UserCourse = require("../models/userCourseModel");

const getAll = async (req, res) => {

    try {
        const allUsersCourses = await UserCourse.find({}).populate({path:"user", select: "email"}).populate({path:"course",select:"courseName"});
        // Use a different variable name to avoid conflict with the function name
        res.status(200).json({ allUsersCourses });
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error fetching user courses", error: error.message });
    }
};

const enrollInCourse = async (req, res) => {
    try {
        const userId = req.body.userId;
        const courseId = req.body.courseId;
        const existingEnrollment = await UserCourse.findOne({ user: userId, course: courseId });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'User already enrolled in this course' });
        }

        const newEnrollment = new UserCourse({
            user: userId,
            course: courseId,
        });

        await newEnrollment.save();

        res.json({message: "Enjoy the course "});
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to enroll user in course' });
    }
};

const rateCourse=async (req,res)=>{
    try{
        const courseId=req.body.courseId;
        const userId=req.body.userId;
        const courseRate=req.params.rate;
        const findCourse=await course.findById(courseId);
        if(!findCourse)
        {
            return res.status(400).json({
                message:'Invalid Course'
            });
        }
        const updatedCourseUser = await UserCourse.findOneAndUpdate(
            { user: userId, course: courseId },
            { $set: { rating: courseRate ,ratedBefore: true} },
            { runValidators: true,
                pre: function(query, update, options) {
                    if (typeof update.$set.rating !== 'undefined') {
                        const rating = update.$set.rating;
                        if (rating < 0 || rating > 5) {
                            throw new Error('Rating must be between 0 and 5');
                        }
                    }
                }
            }
        );
        res.json({message :'Thank you for rating the course '})
    }catch (error){
        res.status(500).json({message:'error in updating the rating',error:error.message})
    }
}
const setQcmScore=async (req,res)=>{
    try{
        const courseId=req.body.courseId;
        const userId=req.body.userId;
        const qcmScore=req.params.score;
        const findCourse=await course.findById(courseId);
        if(!findCourse)
        {
            return res.status(400).json({
                message:'Invalid Course'
            });
        }
        const updatedCourseUser = await UserCourse.findOneAndUpdate(
            { user: userId, course: courseId },
            { $set: { QCM_score: qcmScore } },
            { runValidators: true,
                pre: function(query, update, options) {
                    if (typeof update.$set.QCM_score !== 'undefined') {
                        const score = update.$set.QCM_score;
                        if (score < 0 || score > 100) {
                            throw new Error('score  must be between 0 and 100');
                        }
                    }
                }
            }
        );
        res.json({message :'Qcm score is added with successful',QCM_score: qcmScore})
    }catch (error){
        res.status(500).json({message:'error in updating the qcmScore',error:error.message})
    }
}
module.exports={
    enrollInCourse,
    getAll,
    rateCourse,
    setQcmScore
}