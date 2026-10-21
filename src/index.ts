import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';

import AuthController from './controllers/AuthController';
import SituationsController from './controllers/SituationsController';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', AuthController);
app.use('/', SituationsController);

const PORT = Number(process.env.PORT) || 8080;

AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    app.listen(PORT, () => {
      console.log(
        `O servidor está em execução na porta ${PORT}: http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });