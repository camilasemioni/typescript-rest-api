import express from 'express';
import 'express-async-errors';
import 'dotenv/config';
import connectDB from './database/connect.database';
import router from './routes/customer.route';

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/client', router);

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
