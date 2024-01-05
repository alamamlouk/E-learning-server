const user = require('../models/userModel')
const getUsers = ((req, res) => {
    const role=req.user.role
    console.log(role)
    if(role==="administrator")
    {
        user.find({})
            .then(result => res.status(200).json({result}))
            .catch((error) => res.status(500).json({msg: error}))
    }
    else {
        return res.status(401).json({message:"unauthorized"})
    }

})
//update User
//Delete User
//Get All Users

module.exports = {
    getUsers,
}