import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

//Importar o arquivo com as credenciais do banco de dados
const Router = express.Router();

//inicializar a conexão com o banco de dados
AppDataSource.initialize().then(() => {
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});

//Criar uma rota de login
Router.get("/", (req:Request, res:Response) =>{
  res.send("Bem vindo pessoal! tela de login da nova rota");
})

//Exportar o Router para ser usado em outros arquivos
export default Router