const  mongoose  = require("mongoose");
const { type } = require("node:os");
const { number } = require("zod");
require("dotenv").config();
async function connectDB() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
}
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: { type: String, unique: true},
    password: String,
    firstname: String,
    lastname:String,

});

const adminSchema = new Schema({
    email: { type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String,

});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorid: ObjectId,


});


const purchaseSchema = new Schema({
    userId: { type: ObjectId, ref: "user", required: true },
    courseId: { type: ObjectId, ref: "course", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchasesModel = mongoose.model("purchase",purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchasesModel,
    connectDB,
}
