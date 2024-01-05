const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Student","Instructor","administrator"]
    },
    // profileImage:{
    //         data:Buffer,
    //         contentType:String,
    //         required:false
    // },
    phoneNumber:{
        type:Number,
    },
    courseCreated:[{
        type:mongoose.Types.ObjectId,
        ref:'courses'
    }]
});
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('users', userSchema);
