
import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Situation } from '../entity/Situations';

const router = express.Router();

// LISTAR TODAS AS SITUAÇÕES
router.get('/Situations', async (_req: Request, res: Response) => {
  try {
    const situationRepository = AppDataSource.getRepository(Situation);
    const situations = await situationRepository.find();

    return res.status(200).json(situations);
  } catch (error) {
    console.error('Erro ao listar situações:', error);

    return res.status(500).json({
      mensagem: 'Erro ao listar situações!',
    });
  }
});

// CONSULTAR UMA SITUAÇÃO PELO ID

router.get('/Situations/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    console.log('ID recebido na rota:', req.params.id);
    console.log('ID convertido para número:', id);

    const situationRepository = AppDataSource.getRepository(Situation);

    const situation = await situationRepository.findOne({
      where: { id: id },
    });

    console.log('Resultado da consulta:', situation);

    if (!situation) {
      return res.status(404).json({
        mensagem: `Nenhuma situação encontrada com o ID ${id}!`,
      });
    }

    return res.status(200).json({
      mensagem: `Situação de ID ${id} encontrada com sucesso!`,
      situation: situation,
    });
  } catch (error) {
    console.error('Erro ao consultar situação:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao consultar situação!',
    });
  }
});


// CADASTRAR SITUAÇÃO SEM PERMITIR NOMES DUPLICADOS
router.post('/Situations', async (req: Request, res: Response) => {
  try {
    const { namesSituation } = req.body as {
      namesSituation?: string;
    };

    if (
      typeof namesSituation !== 'string' ||
      namesSituation.trim() === ''
    ) {
      return res.status(400).json({
        mensagem: 'O nome da situação é obrigatório!',
      });
    }

    const nome = namesSituation.trim();
    const situationRepository = AppDataSource.getRepository(Situation);

    const situationExists = await situationRepository.findOne({
      where: { namesSituation: nome },
    });

    if (situationExists) {
      return res.status(409).json({
        mensagem: 'Já existe uma situação com esse nome!',
      });
    }

    const newSituation = situationRepository.create({
      namesSituation: nome,
    });

    const savedSituation = await situationRepository.save(newSituation);

    return res.status(201).json({
      mensagem: 'Situação cadastrada com sucesso!',
      situation: savedSituation,
    });
  } catch (error) {
    console.error('Erro ao cadastrar situação:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      return res.status(409).json({
        mensagem: 'Já existe uma situação com esse nome!',
      });
    }

    return res.status(500).json({
      mensagem: 'Erro ao cadastrar situação!',
      erro: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
