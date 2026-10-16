import express from 'express';

//importar variáveis de ambiente do arquivo .env
import dotenv from 'dotenv';
dotenv.config();

//criar uma instância do express
const app = express();

//importar o arquivo de rotas
import login from './controllers/login';

//usar o arquivo de rotas
app.use("/", login);

//iniciar o servidor
app.listen(process.env.PORT, () => {
  console.log(`O servidor está em execução na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});