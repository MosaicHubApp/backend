import { MigrationInterface, QueryRunner } from "typeorm";

export class VerificationSession1754656213595 implements MigrationInterface {
    name = 'VerificationSession1754656213595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification_session" ("verification_session_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "verification_code" character varying(6) NOT NULL, "is_verified" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_9692196807c351526a9fc27b693" PRIMARY KEY ("verification_session_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verification_session"`);
    }

}
