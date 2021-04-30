const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const syllabusSchema = new Schema({
    className: String,
    description: String,
    file: {
        default: "",
        type: String
    }
})

//export part
module.exports = mongoose.model("syllabus", syllabusSchema)