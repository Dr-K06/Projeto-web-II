import express from 'express';

//importar variáveis de ambiente do arquivo .env
import dotenv from 'dotenv';
dotenv.config();

//criar uma instância do express
const app = express();

import login from './controllers/login';

app.use("/", login);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});