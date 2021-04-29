const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    userId:{
        type: String,
        unique: true
    },
     userType:{
        type:String,
        trim: true,
        enum: ["teacher"]
    },
    password:String,
    personalInfo:{
        name:{
            FirstName: {
                type:String,
                trim: true
            },
            LastName:{
                type:String,
                trim: true
            }
        },
        email: {
            type: String,
            unique:true
        },
        dateOfBirth:{
            type: Date,
            trim: true
        },
        contact:{
            permanentAddress: String,
            currentAddress: String,
            mobileNo:String,
        },
        sex:{
            type:String
        },
        image:{
            type: String,
            default: ""
        }
    },
    academicInfo :{
        degree:[
            {
                degreeName: String,
                result: String,
                season: String,
                passingYears: String,
                institute: String
            }
        ],
    },
    officalInfo:{
        salary: {
            type:String
        },
        department:{
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    recoveryToken:{
        type: String,
        default: ""
    },
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


//export part
module.exports = mongoose.model("teachers", teacherSchema)
