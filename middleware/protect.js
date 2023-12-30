const jwt=require("jsonwebtoken")

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.jwt;
        if (!token) {
            console.log("here")
            return res.redirect('login');
        } // Redirect if no token
        req.user = jwt.verify(token, process.env.JWT_SECRECT); // Attach decoded user data to request for further use
        next(); // Proceed to the route handler
    } catch (error) {
        console.log(error.message)
        return res.redirect('/auth/login'); // Redirect if invalid token
    }
};
module.exports=checkAuth