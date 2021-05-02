const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const syllabusSchema = new Schema({
    className:{
        type: String,
        trim : true,
        unique : true
    },
    description : String,
    syllabus : [
        {
            subject: {
                type: String
            },
            file: {
                type: String,
                default: ""
            },
            details: String
        }
    ]
})

//export part
module.exports = mongoose.model("syllabus", syllabusSchema)