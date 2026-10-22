
import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductSituationsSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando Seeds de situações dos produtos...");

    const repository = dataSource.getRepository(ProductSituation);

    const situations = [
      "Disponível",
      "Indisponível",
      "Descontinuado",
    ];

    for (const name of situations) {
      const existing = await repository.findOneBy({ name });

      if (!existing) {
        await repository.save(repository.create({ name }));
        console.log(`Situação criada: ${name}`);
      } else {
        console.log(`Situação já existe: ${name}`);
      }
    }

    console.log("Seeds de situações dos produtos finalizadas!");
  }
}
