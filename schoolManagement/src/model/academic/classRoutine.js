const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const routineSchema = new Schema({
    className: String,
    routine:[
        {
            day: String,
            period:[
                {
                    no: Number,
                    subject: String,
                    teacherName: {
                        type: String,
                        default: ""
                    },
                     timeStart: {
                        type: String,
                        default: ""
                    },
                    timeEnd:{
                        type: String,
                        default: ""
                    }
                } //number of period a day
            ]
        }
    ],
    modification:{
        createdAt:{
            type: Date,
            default: Date.now
        },
        updatedAt:{
            type:Date,
            default: Date.now
        }
    }
})

module.exports = mongoose.model("classRoutine", routineSchema)