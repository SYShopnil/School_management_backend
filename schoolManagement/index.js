//get the require file
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser")
const adminRoute = require("./src/route/admin")
const studentRoute = require("./src/route/student")
const teacherRoute = require("./src/route/teacher")
const loginRoute = require("./src/route/user")

//work with dot env file
const port = process.env.PORT || 8080
const mongoUrl = process.env.URL

//body parser part
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//creat the server
app.listen(port, () => {console.log(`Server is running on ${port}`)})

//connect to the database
mongoose.connect(mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(() => {
    console.log("server is connected to the database school_management");
})
.catch(err => {
    console.log(err);
})

//root route
app.get("/",(req, res) => {
    res.send("<h1>I am from root</h1>")
})

//others route
app.use("/user/admin", adminRoute)
app.use("/user/student", studentRoute)
app.use("/user/teacher", teacherRoute)
app.use("/user", loginRoute)

//default route
app.get("*",(req, res) => {
    res.status(404).send("<h1>Page not found</h1>")
})

