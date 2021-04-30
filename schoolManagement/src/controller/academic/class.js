const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const { classValidation } = require("../../../validation/class")
const User = require("../../model/user/user")
const ClassRoutine = require("../../model/academic/classRoutine")
const routineValidation = require("../../../validation/classRoutine")
const { id } = require("../../../validation/classRoutine")
const Syllabus = require("../../model/academic/syllabus")
const syllabusValidation = require("../../../validation/syllabus")

//creat a class
const newCLassController = async (req, res) => {
    try{
        const {error} = classValidation.validate(req.body)
        if(error){ //if there have any error during validation operation
            console.log(error);
            res.json({
                message: "class validation error",
                error
            })
        }else{
            const newClass = new Class(req.body) //create the class 
            const saveNewClass = await newClass.save() //save the new class
            if(saveNewClass){
                res.status(201).json({
                    message: "new class has been created successfully",
                    saveNewClass
                })
            }
        }

    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}

//creat a class routine
const routineController = async (req, res) => {
    try{
        const {error} = routineValidation.validate(req.body) //check the routine validation
        if(error){
            res.json({
                error
            })
        }else{
            const newClassRoutine = new ClassRoutine(req.body) //create the class routine
            const isSaved = await newClassRoutine.save() 
            if(isSaved){
                res.json({
                    message: "class routine successfully created"
                })
            }
        }
    }
    catch(err){
        console.log(err);
        res.json({
            err
        })
    }
}


//creat a syllabus
const creatSyllabusController = async (req, res) => {
    const {error} = syllabusValidation.validate(req.body) //validation the body data of syllabus
    if(error){
        res.json({
            message: "syllabus validation error",
            error
        })
    }else{
        const fileName = req.file.filename //get the upload file name
        const createNewSyllabus = new Syllabus({
            ...req.body,
            file: fileName
        }) //create the new syllabus
        const saveData = await createNewSyllabus.save() //save the data into the database
        if(saveData){
            res.status(201).json({
                message: "new syllabus has been created"
            })
        }
    }
} 

//update class
const updateClassController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params
        const findClass  = await Class.findOne({className}) //find the class from the database
        if(findClass){
            const updateTheClass = await Class.updateOne(
                {
                    className
                }, //query
                {
                    $set: req.body
                }, //update data
                {} //option
            ) //find the student and update data
            if(updateTheClass){
                res.json({
                    message: `Class ${findClass.className} has updated successfully`
                })
            }else{
                res.json({
                    message: "update failed"
                })
            }
        }else{
            res.json({
                message: "Class not found"
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

//delete class 
const deleteClassController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params
        const findTheClass = await Class.findOne({className}) //find the expected class from database
        if(findTheClass){
            const deleteClass = await Class.updateOne(
                {
                    className
                }, //querry
                {
                    $set:{
                        isDeleted: true,
                    }
                }, //update part
            )
            if(deleteClass){
                res.json({
                    message: `Class ${findTheClass.className} is deleted `
                })
            }
        }else{
            res.json({
                message: "Class not found"
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

//view all class list
const viewClassController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from the params
        const findClass = await Class.findOne({className}) //find the class according to the params value
        if(findClass){
            res.json({
                message: `Class ${findClass.className} found`,
                findClass
            })
        }else{
            res.status(404).json({
                message: "Class not found"
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
    newCLassController,
    routineController,
    creatSyllabusController,
    updateClassController,
    deleteClassController,
    viewClassController
}   