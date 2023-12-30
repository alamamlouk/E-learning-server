const course = require("../models/courseModel")
const User = require("../models/userModel")
const UserCourse = require('../models/userCourseModel')
const getCourses = ((req, res) => {
    course.find({}).populate({path: "instructor", select: "email"})
        .then(result => res.status(200).json({result}))
        .catch((error) => res.status(500).json({msg: error}))
})

const createCourse = async (req, res) => {
    try {
        const instructorId = req.params.instructor;
        const {courseName, DateOfAddingCourse, TimeToCompleteTheCourse, category, freeOrNot, price} = req.body;

        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(400).json({message: 'Invalid instructor ID'});
        }

        const newCourse = await course.create({
            courseName, DateOfAddingCourse, TimeToCompleteTheCourse, category, freeOrNot, price, instructor,
        });

        await User.findByIdAndUpdate(instructorId, {$addToSet: {courseCreated: newCourse}});

        res.json({message: 'Course created successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error creating course', error: error.message});
    }
};
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
module.exports = {
    getCourses, createCourse, setCourseRating
}