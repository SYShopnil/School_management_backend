const mongoose = require("mongoose")
const Schema = mongoose.Schema

const submissionSchema = new Schema({
    studentId: String,
    className: String,
    subject: String,
    studentAnswer: [
        {
            questionNo: Number,
            answer: String
        }
    ],
    submissionTime: {
        type: Date,
        defualt: Date.now
    }
})

//export part
module.exports = mongoose.model("submitAnswer", submissionSchema)