const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const User = require("../../model/user/user")
const Syllabus = require("../../model/academic/syllabus")
const syllabusValidation = require("../../../validation/syllabus")
const fileSystem = require("fs")
const e = require("express")

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

//delete syllabus info
const deleteSyllabusInfo = async (req, res ) => {
    try{
        const {className, subject} = req.params //get data from params 
        const isValidClass = await Class.findOne({className}) //check that is it a valid class or not
        if(isValidClass){
            //get the syllabus item
            const isValidSyllabus = await Syllabus.findOne(
                {
                    className,
                    "syllabus.subject": subject
                }
            ).select(`syllabus`) //get the syllabus

            //check is the query item is available in the database or not
            if(isValidSyllabus){
                const storeItInArray = [...isValidSyllabus.syllabus] //store the syllabus query item in to a array
                const isFileAvailable = [] 
                storeItInArray.map( arr => {
                    if(arr.subject == subject){
                        isFileAvailable.push(arr.file) //this is the file name if found otherwise it will return undefined
                    }
                })//find the subject and push the file name of the subject  into a empty array
                const deleteDataPath = `E:/Topper/MERN/Project/school-management_backend/schoolManagement/documents/file/${isFileAvailable[0]}`
                const deleteSyllabusInfo = await Syllabus.updateOne(
                    {
                        className
                    }, //querry
                    {
                        $pull: {
                            "syllabus": {subject} //delete those element by element
                        }
                    }, //update
                    {} // option
                ) //querry and delete element from syllabus
                if(deleteSyllabusInfo && deleteSyllabusInfo.nModified !== 0 ){ //check that is it really modified or not 
                    
                    res.status(200).json({
                        message: "Syllabus item deleted successfully"
                    })

                    //delete the existing file from the root
                    if(isFileAvailable[0]){
                        fileSystem.unlink(deleteDataPath, (err)=> {
                            if(err){
                                console.log(err);
                            }
                        })
                    }else{
                        console.log("There don't have any file in the database");
                    }
                }else{
                    res.status(404).json({
                        message: "Syllabus not found or it's updated already"
                    })
                }
            }else{
                res.json({
                    message : "items not found"
                })
            }
        }else{
            res.status(404).json({
                message: `${className} is not found`
            })
        }
    }catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//add syllabus info
const addSyllabusInfo = async (req, res) => {
    try{
        const {className, subject} = req.params //get the data from params 
        const isValidClass = await Class.findOne({className}) //check that is there have any class with this name
        if(isValidClass){
            const findTheSyllabus = await Syllabus.findOne({className})
            const isSubjectAvailable = findTheSyllabus.syllabus.find(data => {
                return data.subject == subject
            })
            if(!isSubjectAvailable){ //check that is the new add subject is available or not
                  const isAddInfo = await Syllabus.updateOne(
                    {
                        className //query by class name,
                    }, //querry
                    {
                        $push: {
                            syllabus: {...req.body} //push what i will get from body
                        }
                    }, //update
                    {} //option
                ) //check and add some info in to the respective syllabus info
                if(isAddInfo.nModified){
                    res.status(200).json({
                        message: "Syllabus item add successfully"
                    })
                }else{
                    res.json({
                        message: "Syllabus item add failed"
                    })
                }
            }else{
                res.json({
                    message: "Subject is available you can edit it"
                })
            }
        }else{
            res.status(404).json({
                message: "Class Not found"
            })
        }
    }
    catch(err){
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
    viewSyllabusByClass,
    deleteSyllabusInfo,
    addSyllabusInfo
}