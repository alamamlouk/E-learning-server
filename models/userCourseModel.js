const mongoose =require('mongoose')

const CourseUserSchema=new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' },
        enrolledAt: { type: Date, default: Date.now },
        finishedCourseDate:{type:Date},
        ratedBefore: {type:Boolean,default:false},
        rating:{
            type:Number,
            default:0,
            validate(value) {
                if (value < 0 || value > 5) {
                    throw new Error("Rating must be between 0 and 5");
                }
            }
        },
        QCM_score: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0 || value > 100) {
                    throw new Error("QCM score must be between 0 and 100");
                }

            }
        },
    }
)
module.exports=mongoose.model('courseUsers',CourseUserSchema);