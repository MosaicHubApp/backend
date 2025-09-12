import { MigrationInterface, QueryRunner } from "typeorm";

export class BannedUsers1756725670957 implements MigrationInterface {
    name = 'BannedUsers1756725670957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banned_user" ("user_id" SERIAL NOT NULL, "bannedUserUserId" integer, "bannedByUserUserId" integer, CONSTRAINT "PK_e741e6e39a859033258f5127ccb" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "banned_user" ADD CONSTRAINT "FK_d5dae800cecfc309b85befbd841" FOREIGN KEY ("bannedUserUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banned_user" ADD CONSTRAINT "FK_3bf88bc6b056b7bdb4066c4ec34" FOREIGN KEY ("bannedByUserUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banned_user" DROP CONSTRAINT "FK_3bf88bc6b056b7bdb4066c4ec34"`);
        await queryRunner.query(`ALTER TABLE "banned_user" DROP CONSTRAINT "FK_d5dae800cecfc309b85befbd841"`);
        await queryRunner.query(`DROP TABLE "banned_user"`);
    }

}
