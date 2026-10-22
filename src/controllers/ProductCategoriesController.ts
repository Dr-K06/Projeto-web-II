
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategories";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// LISTAR CATEGORIAS COM PAGINAÇÃO
router.get("/ProductCategories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
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

        /*const totalTeste = await repository.count();
        console.log("Total de categorias no controller:", totalTeste);*/

        const result = await PaginationService.paginate(
            repository,
            page,
            limit,
            { id: "DESC" }
        );

        if (result.totalRecords === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma categoria encontrada!",
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        return res.status(500).json({
            mensagem: "Erro ao listar categorias!",
        });
    }
});

// CONSULTAR CATEGORIA PELO ID
router.get("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id });

        if (!category) {
            return res.status(404).json({
                mensagem: `Categoria com ID ${id} não encontrada!`,
            });
        }

        return res.status(200).json({ category });
    } catch (error) {
        console.error("Erro ao consultar categoria:", error);
        return res.status(500).json({
            mensagem: "Erro ao consultar categoria!",
        });
    }
});

// CADASTRAR CATEGORIA
router.post("/ProductCategories", async (req: Request, res: Response) => {
    try {
        const { name } = req.body as { name?: string };

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "O nome da categoria é obrigatório!",
            });
        }

        const repository = AppDataSource.getRepository(ProductCategory);
        const normalizedName = name.trim();

        const existing = await repository.findOneBy({
            name: normalizedName,
        });

        if (existing) {
            return res.status(409).json({
                mensagem: "Já existe uma categoria com esse nome!",
            });
        }

        const category = repository.create({ name: normalizedName });
        const saved = await repository.save(category);

        return res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!",
            category: saved,
        });
    } catch (error) {
        console.error("Erro ao cadastrar categoria:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(409).json({
                mensagem: "Já existe uma categoria com esse nome!",
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao cadastrar categoria!",
        });
    }
});

// ATUALIZAR CATEGORIA
router.put("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body as { name?: string };

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "Informe um nome válido para a categoria!",
            });
        }

        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id });

        if (!category) {
            return res.status(404).json({
                mensagem: `Categoria com ID ${id} não encontrada!`,
            });
        }

        const normalizedName = name.trim();
        const duplicate = await repository.findOneBy({
            name: normalizedName,
        });

        if (duplicate && duplicate.id !== id) {
            return res.status(409).json({
                mensagem: "Já existe outra categoria com esse nome!",
            });
        }

        category.name = normalizedName;
        const saved = await repository.save(category);

        return res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!",
            category: saved,
        });
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        return res.status(500).json({
            mensagem: "Erro ao atualizar categoria!",
        });
    }
});

// DELETAR CATEGORIA
router.delete("/ProductCategories/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "ID inválido!" });
        }

        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id });

        if (!category) {
            return res.status(404).json({
                mensagem: `Categoria com ID ${id} não encontrada!`,
            });
        }

        await repository.remove(category);

        return res.status(200).json({
            mensagem: "Categoria removida com sucesso!",
            category,
        });
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        return res.status(409).json({
            mensagem: "Não foi possível excluir a categoria. Verifique se há produtos associados.",
        });
    }
});

export default router;
