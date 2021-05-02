const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const User = require("../../model/user/user")
const Syllabus = require("../../model/academic/syllabus")
const syllabusValidation = require("../../../validation/syllabus")
const fileSystem = require("fs")

//upload a syllabus
const uploadSyllabusController = async (req, res) => {
    try{
         const {className, subject} = req.params //get the class name from params
         const findSyllabus = await Syllabus.findOne({className}) //get the syllabus searching by class name
         if(findSyllabus){
             const {_id, syllabus} = findSyllabus 

             //get the old file name step start
             const getTheFileNameFromDataBaseStepOne = syllabus.map(val => {
                 if(val.subject == subject){
                    return val.file
                 }
             }) //step 1
             let getTheFileNameFromDataBaseStepTwo = []
             getTheFileNameFromDataBaseStepOne.map(value => {
                 if(value){
                     getTheFileNameFromDataBaseStepTwo.push(value)
                 }
             }) //step 2
             
            const getTheOldFileName = getTheFileNameFromDataBaseStepTwo[getTheFileNameFromDataBaseStepTwo.length - 1] //step 3 and finally get the data from database
            const oldFileName = getTheOldFileName //store the old file name
            const route = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${oldFileName}` //route of the old file location folder
            const {filename} = req.file //get the upload file name
            const uploadFile = await Syllabus.updateOne(
                {
                    _id,
                    syllabus: {
                        $elemMatch: {
                            subject //query by subject name 
                        }
                    }
                }, //querry
                {
                    $set:{
                        "syllabus.$.file": filename //store the file name here
                    }
                }, //update
                {} //option
            )
            if(uploadFile){
                res.json({
                    message: `Class ${findSyllabus.className} syllabus has been successfully updated`
                })
                //delete the previous file
                 fileSystem.unlink(route, (err) => {
                     if(err){
                         console.log(err);
                         res.json({
                             message: "previous syllabus update time error"
                         })
                     }
                 })
            }else{
                res.json({
                    message: "syllabus update failed"
                })
            }
         }else{
             res.status(404).json({
                 message: "syllabus not found"
             })
         }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//download syllabus file
const downloadSyllabusController = async (req, res) => {
    try{
        const {className, subject} = req.params // get the class name from the params
        const findSyllabus = await Syllabus.findOne({className}) //find the syllabus with the class name
        if(findSyllabus){
             const queryTheExistingFileName = findSyllabus.syllabus.find(syllabusData => {
                if(syllabusData.subject == subject && Boolean(syllabusData.subject) == true ){
                    return syllabusData
                }
            } ) //queryTheFileName is avaialble or not
            const getTheExistingFileName = queryTheExistingFileName.file //finally got the existing file name
            const oldFileName = getTheExistingFileName //store the file name 
            const myFileRoute = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${oldFileName}` //this is the route of the main hard file
            const syllabus = findSyllabus //store the syllabus here
            if(myFileRoute){  //check that is my file route is valid or not
                res.download(myFileRoute, (err) => {
                    if(err){
                        console.log(err);
                        res.json({
                            message: "File not found in the root",
                            err
                        })
                    }else{
                        console.log("Download Successfully");
                    }
                })
            }else{
                res.json({
                    message: "file not found"
                })
            }
        }else{
            res.json({
                message: "Syllabus not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//update syllabus info
const updateSyllabusInfoController = async (req, res) => {
    try{
        const {id} = req.params //get the id from params
        const findSyllabus = await Syllabus.findOne({_id: id}) //find the syllabus with id
        if(findSyllabus){
            const syllabus = findSyllabus
            const updateSyllabus = await Syllabus.findByIdAndUpdate(
                {
                    _id: id //find by id
                }, //querry
                {
                    $set: req.body //update the data
                }, //update
                {} //option
            )
            if(updateSyllabus){
                res.json({
                    message: `Class ${syllabus.className} has been updated successfully`
                })
            }else{
                res.json({
                    message: "Class update failed"
                })
            }
        }else{
            res.json({
                message: "syllabus not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//view syllabus by class
const viewSyllabusByClass = async (req, res) => {
    try{
        const {className} = req.params //get the class name 
        const findSyllabus = await Syllabus.findOne({className}) //get the syllabus by class name
        if(findSyllabus){
            const syllabus = findSyllabus //store the syllabus 
            res.json({
                message: `Class ${syllabus.className} found`,
                syllabus
            })
        }else{
            res.status(404).json({
                message: "Syllabus not found"
            })
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}


//export part
module.exports = {
    uploadSyllabusController,
    downloadSyllabusController,
    updateSyllabusInfoController,
    viewSyllabusByClass
}