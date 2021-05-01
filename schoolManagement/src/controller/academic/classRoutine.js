const Class = require("../../model/academic/class")
const bcrypt = require("bcrypt")
const User = require("../../model/user/user")
const ClassRoutine = require("../../model/academic/classRoutine")
const routineValidation = require("../../../validation/classRoutine")

//update class routine
const updateClassRoutineController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params
        const findClass = await Class.findOne({className}) //search is there have any class 
        if(findClass){
            const findClassRoutine = await ClassRoutine.findOne({className}) //search the class routine
            if(findClassRoutine){
                // const classRoutine = findClassRoutine //store the class routine 
                const updateClassRoutine = await ClassRoutine.updateOne(
                    {
                        className
                    }, //querry
                    {
                        $set: req.body //update whole class routine
                    }, //update
                    {} //option
                ) //did the update operation

                if(updateClassRoutine){
                    res.json({
                        message: "Class routine successfully updated"
                    })
                }else{
                    res.json({
                        message: "Class routine update failed"
                    })
                }
            }else{
                res.json({
                    message: "class routine not found"
                })
            }
        }else{
            res.status(404).json({
                message: "Class not found"
            })
        }
    }
    catch(err){

    }
}

//delete a class routine
const deleteClassRoutineController = async (req, res) => {
    try{
        const {className} = req.params //get the class name from params
        const isValidClass = await Class.findOne({className}) //find that is it a valid class or not 
        if(isValidClass){
            const {isDeleted} = isValidClass //get the is Deleted status
            if(isDeleted == false){
                const isClassRoutine = await ClassRoutine.findOne({className}) //get the class routine
                const {isDeleted} = isClassRoutine.status //get the is deleted status from data base
                if(isDeleted == false){
                     const isUpdated = await ClassRoutine.updateOne(
                        {
                            className
                        }, //query
                        {
                            $set:{
                                "status.isDeleted": true //this is the delete update  
                            }
                        }, //update
                        {} //option
                    )
                    if(isUpdated){
                        res.json({
                            message: "class routine deleted successfully"
                        })
                    }else{
                        res.json({
                            message: "Class routine not found "
                        })
                    }
                }else{
                    res.json({
                        message: "respective class routine have already deleted"
                    })
                }
            }else{
                res.json({
                    message: "Class already deleted"
                })
            }
        }else{
            res.status(404).json({
                message: "Class routine not found"
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

//see  class routine by class name
const showClassRoutineController = async (req, res) => {
    try{
        const {className} = req.params //get the name of the class name by params
        const findClassRoutine = await ClassRoutine.findOne(
            {
                $and: [
                    {
                        className
                    },
                    {
                        "status.isDeleted": false
                    }
                ]
            }
        )
        if(findClassRoutine){
            const classRoutine = findClassRoutine //store the data here
            res.json({
                message: `found class routine of class ${(classRoutine.className).toLowerCase()}`,
                classRoutine
            })
        }else{
            res.status(404).json({
                message: "Class routine not found"
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
    updateClassRoutineController,
    deleteClassRoutineController,
    showClassRoutineController
}