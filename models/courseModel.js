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
        type:String,
        required:true
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

});
module.exports=mongoose.model('courses',courseSchema);