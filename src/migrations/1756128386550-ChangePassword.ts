import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePassword1756128386550 implements MigrationInterface {
    name = 'ChangePassword1756128386550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_session" ("password_reset_session_id" SERIAL NOT NULL, "password_reset_token" character varying(64) NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_ce7a2ad0239f3087f91a4301288" UNIQUE ("password_reset_token"), CONSTRAINT "PK_b622bdf41dd458ec3c77e5c6688" PRIMARY KEY ("password_reset_session_id"))`);
        await queryRunner.query(`ALTER TABLE "password_reset_session" ADD CONSTRAINT "FK_c478b60018cccdec187972e6da0" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_session" DROP CONSTRAINT "FK_c478b60018cccdec187972e6da0"`);
        await queryRunner.query(`DROP TABLE "password_reset_session"`);
    }

}
