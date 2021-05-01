const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const User = require("../../model/user/user")
const Syllabus = require("../../model/academic/syllabus")
const syllabusValidation = require("../../../validation/syllabus")
const fileSystem = require("fs")

//upload a syllabus
const uploadSyllabusController = async (req, res) => {
    try{
         const {className} = req.params //get the class name from params
         const findSyllabus = await Syllabus.findOne({className}) //get the syllabus searching by class name
         if(findSyllabus){
             const {_id, file} = findSyllabus 
             const oldFileName = file //store the old file name
             const route = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${oldFileName}` //route of the old file location folder
             const {filename} = req.file //get the upload file name
            const uploadFile = await Syllabus.findByIdAndUpdate(
                {_id},//querry
                {
                    $set: {
                        file: filename //store the name of the syllabus file
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
        const {className} = req.params // get the class name from the params
        const findSyllabus = await Syllabus.findOne({className}) //find the syllabus with the class name
        if(findSyllabus){
            const syllabus = findSyllabus //store the syllabus here
            const fileName = syllabus.file //get the syllabus file name
            const myFileRoute = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${fileName}` //this is the route of the main hard file
            if(myFileRoute){
                res.download(myFileRoute, (err) => {
                    if(err){
                        console.log(err);
                        res.json({
                            message: "file download time error",
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