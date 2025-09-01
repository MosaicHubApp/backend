import { MigrationInterface, QueryRunner } from "typeorm";

export class BannedUsersUnique1756726533968 implements MigrationInterface {
    name = 'BannedUsersUnique1756726533968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banned_user" ADD CONSTRAINT "UQ_720f06aad0d852069e09fe5974f" UNIQUE ("bannedUserUserId", "bannedByUserUserId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banned_user" DROP CONSTRAINT "UQ_720f06aad0d852069e09fe5974f"`);
    }

}
