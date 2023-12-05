import mongoose from "mongoose";

const connectDB = (uri: string) => {
    return mongoose.connect(uri);
}

export = connectDB