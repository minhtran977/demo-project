// src/index.js
import cors from 'cors'; // Import CORS
import dotenv from 'dotenv';
import express, { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error-middlware';
import router from './routers';
import { dataSource } from './setting/configuration';
import options from './setting/swagger';

dotenv.config();

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const specs = swaggerJsdoc(options);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.use('/api', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use('/', router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
