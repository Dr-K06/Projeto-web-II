
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { ProductCategory } from "./ProductCategories";
import { ProductSituation } from "./ProductSituations";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(
        () => ProductSituation,
        (productSituation) => productSituation.products
    )
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation;

    @ManyToOne(
        () => ProductCategory,
        (productCategory) => productCategory.products
    )
    @JoinColumn({ name: "productCategoryId" })
    productCategory!: ProductCategory;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt!: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;
}
