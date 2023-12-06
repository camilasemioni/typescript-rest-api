import express from 'express';
import 'express-async-errors';
import 'dotenv/config';
import connectDB from './database/connect.database';
import clientRouter from "./routes/customer.route"

const app = express();

app.use(express.json());
app.use("/api/v1", clientRouter)

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
