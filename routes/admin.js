const { Router } = require("express");
const adminrouter = Router();
const { adminModel, courseModel } = require("../db");
const { z } = require("zod")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { JWT_ADMIN_PASS } = require("../config");
const { adminMiddlewear } = require("../middlewares/admin");
const required = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
    firstname: z.string().min(1),
    lastname: z.string().min(1)
   });

adminrouter.post("/signup", async function(req,res){
    try{
        const parsed = required.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                message: "invalid input",
                errors: parsed.error.errors
            });
        }
    
        const { email,password,firstname,lastname } = parsed.data;
        const hashp= await bcrypt.hash(password,10);
        await adminModel.create({
            email,
            password: hashp,
            firstname,
            lastname,
        })
        res.json({
            message: "signup successfull"
        })
    }
    catch(err){
        res.status(500).json({
            message:"something went wrong"
        });
    }
    })


adminrouter.post("/signin", async function(req,res){
    const { email, password }= req.body;
    const admin = await adminModel.findOne({
        email: email
    });
    const validadmin = admin &&  await bcrypt.compare(password, admin.password);
    if(!validadmin){
        res.status(401).json({
            message: "Incorrect Credentials"
        })
    }

    const token = jwt.sign({
        id: admin._id

    },JWT_ADMIN_PASS);

    return res.json({
        token,
        message: "signin successfull"
    })
})

adminrouter.post("/course",adminMiddlewear, async function(req,res){
    const adminid=req.adminId;
    const { title, description,price,imageUrl } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorid: adminid
    })
    res.json({
        message: "course created successfully",
        courseid: course._id
    })
})

adminrouter.put("/course", adminMiddlewear, async function(req,res){
    const adminid=req.adminId;
    const { title, description,price,imageUrl, courseid } = req.body;
    const course = await courseModel.updateOne({
        _id: courseid,
        creatorid: adminid
    },{
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
       
    })
    res.json({
        message: "course updated",
        courseid: course._id
    })
})

adminrouter.get("/course/bulk",adminMiddlewear,async function(req,res){
    const adminid=req.adminId;
    
    const courses = await courseModel.find({
        creatorid: adminid
    })
    res.json({
        message: "here are ur courses",
        courses
    })
})

module.exports={
    adminrouter: adminrouter
 }