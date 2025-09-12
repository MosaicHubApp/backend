import { MigrationInterface, QueryRunner } from "typeorm";

export class Interests1756301365631 implements MigrationInterface {
    name = 'Interests1756301365631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "interest_category" ("interest_category_id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_b41c91902237428605c34955368" PRIMARY KEY ("interest_category_id"))`);
        await queryRunner.query(`CREATE TABLE "interest_subcategory" ("interest_subcategory_id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "interestCategoryInterestCategoryId" integer, CONSTRAINT "PK_9072f895660bbacc1f9e95dedf7" PRIMARY KEY ("interest_subcategory_id"))`);
        await queryRunner.query(`CREATE TABLE "interest" ("interest_id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "interestSubcategoryInterestSubcategoryId" integer, CONSTRAINT "PK_ad9c4de39cef87e602cc7f0ca7b" PRIMARY KEY ("interest_id"))`);
        await queryRunner.query(`ALTER TABLE "interest_subcategory" ADD CONSTRAINT "FK_71745e8f9a8d8d04b488e050e7c" FOREIGN KEY ("interestCategoryInterestCategoryId") REFERENCES "interest_category"("interest_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interest" ADD CONSTRAINT "FK_0548a4a7391698937756a86e3ec" FOREIGN KEY ("interestSubcategoryInterestSubcategoryId") REFERENCES "interest_subcategory"("interest_subcategory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interest" DROP CONSTRAINT "FK_0548a4a7391698937756a86e3ec"`);
        await queryRunner.query(`ALTER TABLE "interest_subcategory" DROP CONSTRAINT "FK_71745e8f9a8d8d04b488e050e7c"`);
        await queryRunner.query(`DROP TABLE "interest"`);
        await queryRunner.query(`DROP TABLE "interest_subcategory"`);
        await queryRunner.query(`DROP TABLE "interest_category"`);
    }

}
