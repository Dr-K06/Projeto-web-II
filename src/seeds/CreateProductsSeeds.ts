
import { DataSource } from "typeorm";
import { Product } from "../entity/Products";
import { ProductCategory } from "../entity/ProductCategories";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductsSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando Seeds de produtos...");

    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(ProductCategory);
    const situationRepository = dataSource.getRepository(ProductSituation);

    const category = await categoryRepository.findOneBy({
      name: "Eletrônicos",
    });

    const situation = await situationRepository.findOneBy({
      name: "Disponível",
    });

    if (!category || !situation) {
      throw new Error(
        "Cadastre as categorias e situações antes de executar o Seed de produtos."
      );
    }

    const products = [
      { name: "Notebook", productCategory: category, productSituation: situation },
      { name: "Mouse", productCategory: category, productSituation: situation },
      { name: "Teclado", productCategory: category, productSituation: situation },
    ];

    for (const item of products) {
      const existing = await productRepository.findOneBy({
        name: item.name,
      });

      if (!existing) {
        await productRepository.save(productRepository.create(item));
        console.log(`Produto criado: ${item.name}`);
      } else {
        console.log(`Produto já existe: ${item.name}`);
      }
    }

    console.log("Seeds de produtos finalizadas!");
  }
}
