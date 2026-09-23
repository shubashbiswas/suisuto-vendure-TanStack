import {MigrationInterface, QueryRunner} from "typeorm";

export class SyncSchema1790140748431 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_campaign_market_status"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_campaign_market_slug_unique"`, undefined);
        await queryRunner.query(`ALTER TABLE "market" ADD "originHub" character varying`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_130c4b1a42c7a74f4669e6c584" ON "campaign" ("market", "status") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f0f7b4ed54e88aee033f614d1" ON "campaign" ("market", "slug") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2f0f7b4ed54e88aee033f614d1"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_130c4b1a42c7a74f4669e6c584"`, undefined);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "originHub"`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_campaign_market_slug_unique" ON "campaign" ("market", "slug") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_campaign_market_status" ON "campaign" ("market", "status") `, undefined);
   }

}
