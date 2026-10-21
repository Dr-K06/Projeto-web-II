
import { DataSource } from "typeorm";
import { Situation } from "../entity/Situations";

export default class CreateSituationsSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a criação das seeds de situações...");

    const situationRepository = dataSource.getRepository(Situation);

    const situations = [
      "Ativo",
      "Inativo",
      "Pendente",
    ];

    for (const name of situations) {
      const existing = await situationRepository.findOne({
        where: { namesSituation: name },
      });

      if (!existing) {
        await situationRepository.save(
          situationRepository.create({ namesSituation: name })
        );

        console.log(`Situação criada: ${name}`);
      } else {
        console.log(`Situação já existe: ${name}`);
      }
    }

    console.log("Seeds de situações processadas com sucesso!");
  }
}
