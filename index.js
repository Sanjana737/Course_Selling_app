const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./db")
const app = express();
app.use(express.json())
const { userrouter } = require("./routes/user");
const { courserouter } = require("./routes/course");
const { adminrouter } = require("./routes/admin");

app.use("/user",userrouter);
app.use("/course",courserouter);
app.use("/admin",adminrouter);


async function main() {
    await connectDB(); // wait for DB
    app.listen(3000, () => {
        console.log("Server running");
    });
}

main()

