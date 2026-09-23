import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncMarketIndexes1790084717389 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_market_urlPrefix"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_market_channelCode"`, undefined);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "UQ_market_code"`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_773f4f8f00f00e220d8b792a6b" ON "market" ("code")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c951d1d3048caefed1b0df714d" ON "market" ("urlPrefix")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_86bf322647e559434e704a7c9c" ON "market" ("channelCode")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_86bf322647e559434e704a7c9c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_c951d1d3048caefed1b0df714d"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_773f4f8f00f00e220d8b792a6b"`, undefined);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "UQ_market_code" UNIQUE ("code")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_market_channelCode" ON "market" ("channelCode")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_market_urlPrefix" ON "market" ("urlPrefix")`, undefined);
    }
}
