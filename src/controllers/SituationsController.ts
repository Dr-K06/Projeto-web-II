
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

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: 'ID inválido!',
      });
    }

    const situationRepository = AppDataSource.getRepository(Situation);
    const situation = await situationRepository.findOneBy({ id });

    if (!situation) {
      return res.status(404).json({
        mensagem: `Nenhuma situação encontrada com o ID ${id}!`,
      });
    }

    return res.status(200).json({
      mensagem: `Situação de ID ${id} encontrada com sucesso!`,
      situation,
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
    });
  }
});

// ATUALIZAR SITUAÇÃO PELO ID
router.put('/Situations/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: 'ID inválido!',
      });
    }

    const { namesSituation } = req.body as {
      namesSituation?: string;
    };

    if (
      typeof namesSituation !== 'string' ||
      namesSituation.trim() === ''
    ) {
      return res.status(400).json({
        mensagem: 'Informe um nome válido para a situação!',
      });
    }

    const nome = namesSituation.trim();
    const situationRepository = AppDataSource.getRepository(Situation);

    const situation = await situationRepository.findOneBy({ id });

    if (!situation) {
      return res.status(404).json({
        mensagem: `Nenhuma situação encontrada com o ID ${id}!`,
      });
    }

    // Impedir que outra situação já utilize esse nome
    const duplicate = await situationRepository.findOne({
      where: { namesSituation: nome },
    });

    if (duplicate && duplicate.id !== id) {
      return res.status(409).json({
        mensagem: 'Já existe outra situação com esse nome!',
      });
    }

    situation.namesSituation = nome;

    const updatedSituation = await situationRepository.save(situation);

    return res.status(200).json({
      mensagem: `Situação de ID ${id} atualizada com sucesso!`,
      situation: updatedSituation,
    });
  } catch (error) {
    console.error('Erro ao atualizar situação:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao atualizar situação!',
    });
  }
});

export default router;
