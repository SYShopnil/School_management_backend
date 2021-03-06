const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classSchema = new Schema({
    className: {
        type: String,
        unique:true
    },
    studentNumber : {
        type: Number,
        default: 0
    },
    description: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
})

//export part
module.exports = mongoose.model("classes", classSchema)