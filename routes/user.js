const { Router } = require("express");
const userrouter = Router();
const { userModel, purchasesModel } = require("../db")
const { z } = require("zod")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { JWT_USER_PASS } = require("../config");
const { userMiddlewear } = require("../middlewares/user");

const required = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
    firstname: z.string().min(1),
    lastname: z.string().min(1)
   });


userrouter.post("/signup", async function(req,res){
    
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
    await userModel.create({
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

userrouter.post("/signin", async function(req,res){
    const { email, password }= req.body;
    const user = await userModel.findOne({
        email: email
    });
    const validuser = user &&  await bcrypt.compare(password, user.password);
    if(!validuser){
        return res.status(401).json({
            message: "Incorrect Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id

    },JWT_USER_PASS);

    return res.json({
        token,
        message: "signin successfull"
    })
})

userrouter.get("/purchases",userMiddlewear,async function(req,res){
    const purchases = await purchasesModel.find({
        userId:req.userId
    }).populate("courseId", "title description price");
    res.json({
        purchases
    });
});

module.exports = {
    userrouter: userrouter
}
