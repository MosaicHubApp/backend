import { MigrationInterface, QueryRunner } from "typeorm";

export class PostPhotos1757333289124 implements MigrationInterface {
    name = 'PostPhotos1757333289124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_photo" ADD "file_name" character varying(500) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_photo" DROP COLUMN "file_name"`);
    }

}
