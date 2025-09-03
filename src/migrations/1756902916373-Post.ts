import { MigrationInterface, QueryRunner } from "typeorm";

export class Post1756902916373 implements MigrationInterface {
    name = 'Post1756902916373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_photo" ("post_photo_id" SERIAL NOT NULL, "photo_url" character varying(500) NOT NULL, "order_number" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, CONSTRAINT "PK_58875c08277316a2914d728326d" PRIMARY KEY ("post_photo_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('post_auto_closed')`);
        await queryRunner.query(`CREATE TABLE "notification" ("notification_id" SERIAL NOT NULL, "type" "public"."notification_type_enum" NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, CONSTRAINT "PK_fc4db99eb33f32cea47c5b6a39c" PRIMARY KEY ("notification_id"))`);
        await queryRunner.query(`CREATE TABLE "tag_category" ("tag_category_id" SERIAL NOT NULL, "tag_category_name" character varying(200) NOT NULL, CONSTRAINT "PK_7606268998439422623dcb577a0" PRIMARY KEY ("tag_category_id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("tag_id" SERIAL NOT NULL, "tag_name" character varying(200) NOT NULL, "tagCategoryTagCategoryId" integer, CONSTRAINT "PK_e9fe36a7c01af44f6c47f972f0b" PRIMARY KEY ("tag_id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("post_id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "description" character varying(1500) NOT NULL, "opened_at" TIMESTAMP NOT NULL DEFAULT now(), "is_closed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "author_id" integer, CONSTRAINT "PK_4d093caee4d33b2745c7d05a41d" PRIMARY KEY ("post_id"))`);
        await queryRunner.query(`CREATE TABLE "post_tags_tag" ("postPostId" integer NOT NULL, "tagTagId" integer NOT NULL, CONSTRAINT "PK_e3b920f70ace5c4bfe84485456f" PRIMARY KEY ("postPostId", "tagTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b0bd6d476923337ce79dca77f" ON "post_tags_tag" ("postPostId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d026c77cbcadb0d162ed58f75d" ON "post_tags_tag" ("tagTagId") `);
        await queryRunner.query(`ALTER TABLE "post_photo" ADD CONSTRAINT "FK_043bb23f9d39bc93f7c4e8c5fe3" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_3ee113bf568b5efdc29cd95a360" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_f702e1630d1f877e78412174208" FOREIGN KEY ("tagCategoryTagCategoryId") REFERENCES "tag_category"("tag_category_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_1b0bd6d476923337ce79dca77f3" FOREIGN KEY ("postPostId") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_d026c77cbcadb0d162ed58f75d1" FOREIGN KEY ("tagTagId") REFERENCES "tag"("tag_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_d026c77cbcadb0d162ed58f75d1"`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_1b0bd6d476923337ce79dca77f3"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_f702e1630d1f877e78412174208"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_3ee113bf568b5efdc29cd95a360"`);
        await queryRunner.query(`ALTER TABLE "post_photo" DROP CONSTRAINT "FK_043bb23f9d39bc93f7c4e8c5fe3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d026c77cbcadb0d162ed58f75d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b0bd6d476923337ce79dca77f"`);
        await queryRunner.query(`DROP TABLE "post_tags_tag"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "tag_category"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TABLE "post_photo"`);
    }

}
