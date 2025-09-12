import { MigrationInterface, QueryRunner } from "typeorm";

export class PostPhotosUploader1757335091398 implements MigrationInterface {
    name = 'PostPhotosUploader1757335091398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_photo" ADD "uploader_id" integer`);
        await queryRunner.query(`ALTER TABLE "post_photo" ADD CONSTRAINT "FK_20c3bfcc4e35d20acd7a86ffbc8" FOREIGN KEY ("uploader_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_photo" DROP CONSTRAINT "FK_20c3bfcc4e35d20acd7a86ffbc8"`);
        await queryRunner.query(`ALTER TABLE "post_photo" DROP COLUMN "uploader_id"`);
    }

}
