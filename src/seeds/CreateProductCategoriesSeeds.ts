
import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategories";

export default class CreateProductCategoriesSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando Seeds de categorias...");

    const repository = dataSource.getRepository(ProductCategory);

    const categories = [
      "Eletrônicos",
      "Informática",
      "Acessórios",
    ];

    for (const name of categories) {
      const existing = await repository.findOneBy({ name });

      if (!existing) {
        await repository.save(repository.create({ name }));
        console.log(`Categoria criada: ${name}`);
      } else {
        console.log(`Categoria já existe: ${name}`);
      }
    }

    console.log("Seeds de categorias finalizadas!");
  }
}
