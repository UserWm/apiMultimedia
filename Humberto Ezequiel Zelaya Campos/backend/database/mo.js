import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dbproducts';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, {

        });
        console.log("Connected to the Mongosee MongoDB");
    } catch (err) {
        console.error("Error connecting to the MONGO", err);
        process.exit(1);
    }
};

export default connectDB;

/* este es para docker xd*/




