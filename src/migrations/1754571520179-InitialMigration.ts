import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754571520179 implements MigrationInterface {
    name = 'InitialMigration1754571520179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(500) NOT NULL, "password" character varying(200) NOT NULL, "photo_url" character varying(1000), "is_verified" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "description" character varying(1000) NOT NULL DEFAULT '', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
