import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './/routes/router.js';

dotenv.config();

const app = express();

app.use(cors(), json());

app.use(router);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
