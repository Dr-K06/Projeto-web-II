
import {
  Repository,
  ObjectLiteral,
  FindOptionsOrder,
} from 'typeorm';

export interface PaginationResult<T> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  lastPage: number;
  limit: number;
  previousPage: boolean;
  nextPage: boolean;
}

export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    order: FindOptionsOrder<T> = {},
  ): Promise<PaginationResult<T>> {

    // Validar a página e o limite
    if (!Number.isInteger(page) || page < 1) {
      throw new Error(
        'O número da página deve ser um inteiro positivo!',
      );
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error(
        'O limite deve ser um inteiro positivo!',
      );
    }

    // Contar os registros existentes
    const totalRecords = await repository.count();

    // Calcular a última página
    const lastPage = Math.ceil(totalRecords / limit);

    // Verificar se a página solicitada existe
    if (totalRecords > 0 && page > lastPage) {
      throw new Error(`A página ${page} não existe!`);
    }

    // Calcular o deslocamento
    const offset = (page - 1) * limit;

    // Buscar os registros da página solicitada
    const records = await repository.find({
      take: limit,
      skip: offset,
      order,
    });

    // Retornar os dados e as informações da paginação
    return {
      data: records,
      totalRecords,
      currentPage: page,
      lastPage,
      limit,
      previousPage: page > 1,
      nextPage: page < lastPage,
    };
  }
}
