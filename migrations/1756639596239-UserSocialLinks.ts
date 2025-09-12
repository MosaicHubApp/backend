import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSocialLinks1756639596239 implements MigrationInterface {
    name = 'UserSocialLinks1756639596239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telegram_username" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_2e5cdd21e3ca9a2cce7533947dc" UNIQUE ("telegram_username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instagram_username" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_416e8b241c102016e6b3ad6bfcd" UNIQUE ("instagram_username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedin_username" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_8c080e1585fbdc2a2608a9511eb" UNIQUE ("linkedin_username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "github_username" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_07eccd596501ea0b6b1805a2f13" UNIQUE ("github_username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_07eccd596501ea0b6b1805a2f13"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "github_username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_8c080e1585fbdc2a2608a9511eb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedin_username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_416e8b241c102016e6b3ad6bfcd"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram_username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_2e5cdd21e3ca9a2cce7533947dc"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegram_username"`);
    }

}
