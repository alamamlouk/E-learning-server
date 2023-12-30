const express = require('express')
const cors = require('cors')
const {
    connect
} = require('mongoose')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
require('dotenv').config()
const app = express()
const auth_routes = require('./routes/auth.routes')
const user_routes = require("./routes/userRoutes")
const cookieParser = require('cookie-parser');


app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: "http://localhost:3000"}))
app.use(cookieParser());


app.use("/api/auth", auth_routes)
app.use("/api/user", user_routes)

app.use(notFound)
app.use(errorHandler)
connect(process.env.MONGO_URI)
    .then(app.listen(5000, () => console.log(
        `server running on port ${process.env.PORT}`
    )))
    .catch(error => {
        console.log(error)
    })