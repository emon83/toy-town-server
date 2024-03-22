import express from 'express';
import cors from 'cors';
import config from './app/config/config.js';
import notFound from './app/middleware/notFound.js';
import router from './app/router/routes.js';
import globalErrorHandler from './app/middleware/errorHandler.js';

const app = express();

//* parser
app.use(express.json());
app.use(cors({origin: config.client_url}));

//* application routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Toy town server is running!')
})

//* Not found middleware,
app.use(notFound);

//* use global error handler middleware
app.use(globalErrorHandler);

export default app;