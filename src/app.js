import express from 'express';
import cors from 'cors';
import config from './app/config/config.js';
import notFound from './app/middleware/notFound.js';
import errorHandler from './app/middleware/errorHandler.js';

const app = express();


//* parser
app.use(express.json());
app.use(cors({origin: config.client_url}));

//* application routes
// app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Toy town server is running!')
})

//* use global error handler middleware
app.use(errorHandler);

//* Not found middleware,
app.use(notFound);

export default app;