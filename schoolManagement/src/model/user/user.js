const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userType: {
        type: String,
        default: "admin"
    },
    email:String
})

module.exports = mongoose.model("user", userSchema)