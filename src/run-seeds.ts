
import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";

const runSeeds = async (): Promise<void> => {
  console.log("Iniciando a execução das seeds...");

  try {
    await AppDataSource.initialize();

    console.log("Conexão com o banco estabelecida!");

    await new CreateSituationsSeeds().run(AppDataSource);
    await new CreateProductCategoriesSeeds().run(AppDataSource);
    await new CreateProductSituationsSeeds().run(AppDataSource);

    console.log("Todas as seeds foram executadas!");
  } catch (error) {
    console.error("Erro ao executar as seeds:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Conexão encerrada.");
    }
  }
};

runSeeds();
