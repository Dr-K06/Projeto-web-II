
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { ProductCategory } from "../entity/ProductCategories";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

// LISTAR PRODUTOS COM PAGINACAO
router.get("/Products", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                mensagem: "O numero da pagina deve ser um inteiro positivo!",
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
                mensagem: "Nenhum produto encontrado!",
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        return res.status(500).json({
            mensagem: "Erro ao listar produtos!",
        });
    }
});

// CONSULTAR PRODUTO PELO ID
router.get("/Products/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID invalido!",
            });
        }

        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOne({
            where: { id },
            relations: {
                productCategory: true,
                productSituation: true,
            },
        });

        if (!product) {
            return res.status(404).json({
                mensagem: `Produto com ID ${id} nao encontrado!`,
            });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error("Erro ao consultar produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao consultar produto!",
        });
    }
});

// CADASTRAR PRODUTO
router.post("/Products", async (req: Request, res: Response) => {
    try {
        const { name, productCategoryId, productSituationId } = req.body;

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "O nome do produto e obrigatorio!",
            });
        }

        const categoryId = Number(productCategoryId);
        const situationId = Number(productSituationId);

        if (
            !Number.isInteger(categoryId) ||
            categoryId <= 0 ||
            !Number.isInteger(situationId) ||
            situationId <= 0
        ) {
            return res.status(400).json({
                mensagem: "Informe IDs validos para categoria e situacao!",
            });
        }

        const categoryRepository =
            AppDataSource.getRepository(ProductCategory);
        const situationRepository =
            AppDataSource.getRepository(ProductSituation);
        const productRepository = AppDataSource.getRepository(Product);

        const category = await categoryRepository.findOneBy({
            id: categoryId,
        });

        if (!category) {
            return res.status(404).json({
                mensagem: "Categoria nao encontrada!",
            });
        }

        const situation = await situationRepository.findOneBy({
            id: situationId,
        });

        if (!situation) {
            return res.status(404).json({
                mensagem: "Situacao do produto nao encontrada!",
            });
        }

        const product = productRepository.create({
            name: name.trim(),
            productCategory: category,
            productSituation: situation,
        });

        const savedProduct = await productRepository.save(product);

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar produto!",
        });
    }
});

// ATUALIZAR PRODUTO
router.put("/Products/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, productCategoryId, productSituationId } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID invalido!",
            });
        }

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                mensagem: "Informe um nome valido para o produto!",
            });
        }

        const categoryId = Number(productCategoryId);
        const situationId = Number(productSituationId);

        if (
            !Number.isInteger(categoryId) ||
            categoryId <= 0 ||
            !Number.isInteger(situationId) ||
            situationId <= 0
        ) {
            return res.status(400).json({
                mensagem: "Informe IDs validos para categoria e situacao!",
            });
        }

        const productRepository = AppDataSource.getRepository(Product);
        const product = await productRepository.findOneBy({ id });

        if (!product) {
            return res.status(404).json({
                mensagem: `Produto com ID ${id} nao encontrado!`,
            });
        }

        const category = await AppDataSource
            .getRepository(ProductCategory)
            .findOneBy({ id: categoryId });

        if (!category) {
            return res.status(404).json({
                mensagem: "Categoria nao encontrada!",
            });
        }

        const situation = await AppDataSource
            .getRepository(ProductSituation)
            .findOneBy({ id: situationId });

        if (!situation) {
            return res.status(404).json({
                mensagem: "Situacao do produto nao encontrada!",
            });
        }

        product.name = name.trim();
        product.productCategory = category;
        product.productSituation = situation;

        const updatedProduct = await productRepository.save(product);

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao atualizar produto!",
        });
    }
});

// EXCLUIR PRODUTO
router.delete("/Products/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID invalido!",
            });
        }

        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOneBy({ id });

        if (!product) {
            return res.status(404).json({
                mensagem: `Produto com ID ${id} nao encontrado!`,
            });
        }

        await repository.remove(product);

        return res.status(200).json({
            mensagem: "Produto excluido com sucesso!",
            product,
        });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        return res.status(500).json({
            mensagem: "Erro ao excluir produto!",
        });
    }
});

export default router;
