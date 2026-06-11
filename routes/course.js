const { Router } = require("express");
const courserouter=Router();
const { adminModel, courseModel, purchasesModel, userModel } = require("../db");
const { userMiddlewear } = require("../middlewares/user");


courserouter.post("/purchase", userMiddlewear, async function(req,res){
    const userId = req.userId
    const courseId = req.body.courseId
    const course = await courseModel.findById(courseId);
    if(!courseId){
        return res.status(404).json({
            message: "course doesn't exsist"
        })
    }
    const exsistingcourse = await courseModel.findOne({
        userId,
        courseId
    });
    if(exsistingcourse){
        return res.status(400).json({
            message:"Already purchased"
        });
    }
    const user = await userModel.findById(userId);
    if(user.balance<course.price){
        return res.status(400).json({
            message:"insufficient balance"
        });
    }
    user.balance-=course.price;
    await user.save();
    await purchasesModel.create({
        userId,
        courseId
    })
    res.json({
        message: "successfully bought the course"
    })
})


courserouter.get("/preview", async function(req,res){
    const courses = await courseModel.find({})
    res.json({
       courses
    })
})
 module.exports={
    courserouter: courserouter
 }



