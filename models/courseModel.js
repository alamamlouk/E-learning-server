const mongoose =require('mongoose')

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    DateOfAddingCourse:{
        type:Date,
        required:true
    },
    TimeToCompleteTheCourse:{
        type:Number,
        require:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"categories"
    },
    freeOrNot:{
        type:Boolean,
        required:true
    },
    price:{
        type:Number,
        required:false
    },
    instructor:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    description:{
        type:String,
        required:true
    },
    courseImage:{
        type:String,
    },
    lessons:[{
        lessonName: {
            type: String,
            required: true
        },
        lessonContent: {
            type: String,
            required: true
        }
    }]

});
module.exports=mongoose.model('courses',courseSchema);