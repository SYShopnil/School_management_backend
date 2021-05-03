const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userId:{
        type: String,
        unique: true
    },
     userType:{
        type:String,
        trim: true,
        enum: ["admin"],
        default: "admin"
    },
    password:String,
    // retypePassword: String,
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
                passingYears: String
            }
        ],
    },
    officalInfo:{
        salary: {
            type:String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted:{
            type: Boolean,
            default: false
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
module.exports = mongoose.model("admin", adminSchema)
