const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    userId:{
        type: String,
        unique: true
    },
    userType:{
        type:String,
        trim: true,
        enum: ["student"]
    },
    password:String,
    // retypePassword: String, optional 
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
        FatherName: String,
        MotherName: String,
        email: {
            type: String,
            unique: true
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
        profilePic:{
            type: String,
            default: ""
        },
        sex: String
    },
    academicInfo :{
        class : String,
        admissionDate:{
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        syllabus:{
            type: String,
            default: ""
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
module.exports = mongoose.model("students", studentSchema)
