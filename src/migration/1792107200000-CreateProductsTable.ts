
import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class CreateProductsTable1792107200000
    implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "productSituationId",
                        type: "int",
                    },
                    {
                        name: "productCategoryId",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productSituationId"],
                referencedColumnNames: ["id"],
                referencedTableName: "product_situations",
                onDelete: "RESTRICT",
            })
        );

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productCategoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "product_categories",
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        if (table) {
            for (const foreignKey of table.foreignKeys) {
                await queryRunner.dropForeignKey("products", foreignKey);
            }

            await queryRunner.dropTable("products");
        }
    }
}
