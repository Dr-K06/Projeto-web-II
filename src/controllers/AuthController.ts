import express, { Request, Response } from 'express';

const Router = express.Router();

// Rota provisória de login
Router.get('/', (req: Request, res: Response) => {
  res.send('Bem vindo pessoal! tela de login da nova rota');
});

export default Router;