import express, { Request, Response } from 'express';

const app = express();

app.get("/", (req:Request, res:Response) =>{
  res.send("Bem vindo pessoal!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080: http://localhost:8080");
});