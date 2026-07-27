const { Router } = require("express")
const paymentrouter = Router()
const { purchasesModel , courseModel } = require("../db")
const { userMiddlewear } = require("../middlewares/user")
const Razorpay = require("razorpay")
const crypto = require("crypto")
require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

paymentrouter.post("/create-order", userMiddlewear, async function (req,res) {
    const { courseId } = req.body;
    try{
        const course = await courseModel.findById(courseId)
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }
    
    const options = {
        amount: course.price * 100, 
        currency: "INR",
        receipt: `rcpt_${Math.floor(Math.random() * 1000000)}`
    };
    const order = await razorpay.orders.create(options);
    res.json({
        order,
        courseId
    });
}
catch(error){
    console.error("Razorpay Error:", error); 
    res.status(500).json({ message: "Failed to create order", error: error.message });
}
});



paymentrouter.post("/verify", userMiddlewear, async function(req,res){
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature){
            try{
                await purchasesModel.create({
                    userId: req.userId,
                    courseId: courseId,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id
                })
                res.json({ message: "Payment successful, course unlocked!" });

            }
            catch (error) {
                res.status(500).json({ message: "Error updating database", error: error.message });
            }
        }
        else {
            res.status(400).json({ message: "Invalid payment signature" });
        }
})

module.exports = {
    paymentrouter: paymentrouter
}