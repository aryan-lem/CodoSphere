const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.URL)
        console.log(" Connected to database ")
    } catch (error) {
        console.error("Database connection error:", error.message)
    }
}



module.exports = connectDatabase;