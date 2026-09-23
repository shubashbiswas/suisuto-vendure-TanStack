import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiMarketEntity1790100000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "market" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "countryCode" character varying,
                "currency" character varying NOT NULL,
                "defaultLanguage" character varying NOT NULL,
                "supportedLanguages" text,
                "urlPrefix" character varying NOT NULL DEFAULT '',
                "channelCode" character varying NOT NULL,
                "enabled" boolean NOT NULL DEFAULT true,
                "isDefault" boolean NOT NULL DEFAULT false,
                "navigation" text,
                "homepage" text,
                "merchandising" text,
                "content" text,
                "seo" text,
                CONSTRAINT "PK_market_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_market_code" UNIQUE ("code")
            )`,
            undefined
        );

        await queryRunner.query(
            `CREATE INDEX "IDX_market_urlPrefix" ON "market" ("urlPrefix")`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_market_channelCode" ON "market" ("channelCode")`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_market_channelCode"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_market_urlPrefix"`, undefined);
        await queryRunner.query(`DROP TABLE "market"`, undefined);
    }
}
