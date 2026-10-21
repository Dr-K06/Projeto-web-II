
import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async (): Promise<void> => {
  console.log("Iniciando a execução das seeds...");

  try {
    await AppDataSource.initialize();

    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    const situationsSeeds = new CreateSituationsSeeds();
    await situationsSeeds.run(AppDataSource);

    console.log("Execução das seeds finalizada!");
  } catch (error) {
    console.error("Erro ao executar as seeds:", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Conexão com o banco de dados encerrada.");
    }
  }
};

runSeeds();
