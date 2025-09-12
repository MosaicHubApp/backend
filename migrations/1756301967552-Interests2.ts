import { MigrationInterface, QueryRunner } from "typeorm";

export class Interests21756301967552 implements MigrationInterface {
    name = 'Interests21756301967552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_interests_interest" ("userUserId" integer NOT NULL, "interestInterestId" integer NOT NULL, CONSTRAINT "PK_dcf689bac1e4bbb782c961f9590" PRIMARY KEY ("userUserId", "interestInterestId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a76c9451bdb591d8b50bb20dba" ON "user_interests_interest" ("userUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_48f6796e5842b1c36562455b03" ON "user_interests_interest" ("interestInterestId") `);
        await queryRunner.query(`ALTER TABLE "user_interests_interest" ADD CONSTRAINT "FK_a76c9451bdb591d8b50bb20dba9" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_interests_interest" ADD CONSTRAINT "FK_48f6796e5842b1c36562455b03a" FOREIGN KEY ("interestInterestId") REFERENCES "interest"("interest_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_interests_interest" DROP CONSTRAINT "FK_48f6796e5842b1c36562455b03a"`);
        await queryRunner.query(`ALTER TABLE "user_interests_interest" DROP CONSTRAINT "FK_a76c9451bdb591d8b50bb20dba9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48f6796e5842b1c36562455b03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a76c9451bdb591d8b50bb20dba"`);
        await queryRunner.query(`DROP TABLE "user_interests_interest"`);
    }

}
