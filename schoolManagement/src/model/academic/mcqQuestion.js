const mongoose = require("mongoose")
const Schema = mongoose.Schema

const mcqQuestionSchema = new Schema ({
    className: {
        type: String,
        trim: true,
        required: true
    },
    subject: {
        type: String,
        trim: true,
        required: true
    },
    questionSet: [
        {
            questionNo: {
                type: Number,
                required: true
            },
            question: {
                type: String,
                trim: true,
                 required: true
            },
            originalAnswer:{
                type: String,
                trim: true,
                 required: true
            },
            marks: {
                type: Number,
                required: true
            }
        }
    ],
    response: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("quiestion", mcqQuestionSchema)