const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDB } = require("./db")
const app = express();
app.use(express.json())
app.use(cors())
const { userrouter } = require("./routes/user");
const { courserouter } = require("./routes/course");
const { adminrouter } = require("./routes/admin");
const { paymentrouter } = require("./routes/payment");

app.use("/user",userrouter);
app.use("/course",courserouter);
app.use("/admin",adminrouter);
app.use("/payment",paymentrouter);


async function main() {
    await connectDB(); // wait for DB
    app.listen(3000, () => {
        console.log("Server running");
    });
}

main()

