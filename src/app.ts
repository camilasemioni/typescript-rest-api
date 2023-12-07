import express from 'express';
import 'express-async-errors';
import 'dotenv/config';
import connectDB from './database/connect.database';

const app = express();

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(`${process.env.MONGO_URI}`);
        app.listen(port, () =>
            console.log(`Server listening on port ${port}...`),
        );
    } catch (error) {
        console.log(error);
    }
};

start();
