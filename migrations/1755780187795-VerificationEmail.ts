import { MigrationInterface, QueryRunner } from "typeorm";

export class VerificationEmail1755780187795 implements MigrationInterface {
    name = 'VerificationEmail1755780187795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification_session" ("verification_session_id" SERIAL NOT NULL, "verification_code" character varying(6) NOT NULL, "is_verified" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_e1126f44f4a2fa14b9bcafb6e27" PRIMARY KEY ("verification_session_id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verified_student" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "email_verification_session" ADD CONSTRAINT "FK_f8daa54e5a84ddeb2be1714b4ba" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_verification_session" DROP CONSTRAINT "FK_f8daa54e5a84ddeb2be1714b4ba"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified_student"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "email_verification_session"`);
    }

}
