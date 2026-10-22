
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// LISTAR SITUAÇÕES COM PAGINAÇÃO
router.get("/ProductSituations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                mensagem: "O número da página deve ser um inteiro positivo!",
            });
        }

        if (!Number.isInteger(limit) || limit < 1) {
            return res.status(400).json({
                mensagem: "O limite deve ser um inteiro positivo!",
            });
        }

        const result = await PaginationService.paginate(
            repository,
            page,
            limit,
            { id: "DESC" }
        );

        if (result.totalRecords === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma situação de produto encontrada!",
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao listar situações de produtos:", error);
        return res.status(500).json({
            mensagem: "Erro ao listar situações de produtos!",
        });
    }
});

// CONSULTAR SITUAÇÃO PELO ID
router.get("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: `Situação com ID ${id} não encontrada!`,
            });
        }

        return res.status(200).json({ situation });
    } catch (error) {
        console.error("Erro ao consultar situação de produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao consultar situação de produto!",
        });
    }
});

// CADASTRAR SITUAÇÃO
router.post("/ProductSituations", async (req: Request, res: Response) => {
    try {
        const { name } = req.body as { name?: string };

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "O nome da situação é obrigatório!",
            });
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const normalizedName = name.trim();

        const existing = await repository.findOneBy({
            name: normalizedName,
        });

        if (existing) {
            return res.status(409).json({
                mensagem: "Já existe uma situação com esse nome!",
            });
        }

        const situation = repository.create({ name: normalizedName });
        const saved = await repository.save(situation);

        return res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: saved,
        });
    } catch (error) {
        console.error("Erro ao cadastrar situação de produto:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(409).json({
                mensagem: "Já existe uma situação com esse nome!",
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao cadastrar situação de produto!",
        });
    }
});

// ATUALIZAR SITUAÇÃO
router.put("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body as { name?: string };

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "Informe um nome válido para a situação!",
            });
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: `Situação com ID ${id} não encontrada!`,
            });
        }

        const normalizedName = name.trim();
        const duplicate = await repository.findOneBy({
            name: normalizedName,
        });

        if (duplicate && duplicate.id !== id) {
            return res.status(409).json({
                mensagem: "Já existe outra situação com esse nome!",
            });
        }

        situation.name = normalizedName;
        const saved = await repository.save(situation);

        return res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situation: saved,
        });
    } catch (error) {
        console.error("Erro ao atualizar situação de produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao atualizar situação de produto!",
        });
    }
});

// DELETAR SITUAÇÃO
router.delete("/ProductSituations/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id });

        if (!situation) {
            return res.status(404).json({
                mensagem: `Situação com ID ${id} não encontrada!`,
            });
        }

        await repository.remove(situation);

        return res.status(200).json({
            mensagem: "Situação removida com sucesso!",
            situation,
        });
    } catch (error) {
        console.error("Erro ao deletar situação de produto:", error);
        return res.status(409).json({
            mensagem: "Não foi possível excluir a situação. Verifique se há produtos associados.",
        });
    }
});

export default router;
