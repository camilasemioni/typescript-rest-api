import express from 'express';
import 'dotenv/config';
import connectDB from './database/connect.database';
import customerRouter from './routes/customer.route';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swagger.json';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use('/api/v1', customerRouter);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1', customerRouter);

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
