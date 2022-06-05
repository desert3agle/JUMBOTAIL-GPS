const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        let mongoURI;
        
        if(process.env.NODE_ENV !== "test") mongoURI = process.env.MONGO_URI;
        else mongoURI = process.env.MONGO_URI_TEST;

        const conn = await mongoose.connect(mongoURI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;