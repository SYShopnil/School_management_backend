const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userType: String,
    email:String
})

module.exports = mongoose.model("user", userSchema)