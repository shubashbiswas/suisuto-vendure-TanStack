import { MigrationInterface, QueryRunner } from 'typeorm';

export class CampaignIndexesAndPriority1790046009829 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "priority" integer NOT NULL DEFAULT 0;`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "IDX_campaign_market_status" ON "campaign" ("market", "status");`,
            undefined
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_campaign_market_slug_unique" ON "campaign" ("market", "slug");`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `DROP INDEX IF EXISTS "IDX_campaign_market_slug_unique";`,
            undefined
        );
        await queryRunner.query(
            `DROP INDEX IF EXISTS "IDX_campaign_market_status";`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "campaign" DROP COLUMN IF EXISTS "priority";`,
            undefined
        );
    }
}
