import express from 'express';
import 'dotenv/config';
import customerRouter from './routes/customer.route';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swagger.json';
import errorMiddleware from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use('/api/v1', customerRouter);

app.use(errorMiddleware);

export default app;
