import express, { Request, Response } from 'express';

const Router = express.Router();

// Rota de situações
Router.get('/Situations', (req: Request, res: Response) => {
  res.send('Rota de situações funcionando!');
});

export default Router;