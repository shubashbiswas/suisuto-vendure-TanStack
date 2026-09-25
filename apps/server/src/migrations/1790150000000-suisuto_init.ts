import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuisutoInit1790150000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ---------------------------------------------------------------------
        // 1. Multi-Hub Custom Fields on Product
        // ---------------------------------------------------------------------
        await queryRunner.query(
            `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "customFieldsOriginhub" character varying(255) DEFAULT '';`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "customFieldsFabriccareguide" text;`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "customFieldsModelspecs" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "customFieldsHscode" character varying(255);`,
            undefined
        );

        // ---------------------------------------------------------------------
        // 2. Multi-Hub Custom Fields on Order
        // ---------------------------------------------------------------------
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "customFieldsRecipientkycid" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "customFieldsIsmultihuborder" boolean DEFAULT false;`,
            undefined
        );

        // ---------------------------------------------------------------------
        // 3. Multi-Hub Custom Fields on StockLocation
        // ---------------------------------------------------------------------
        await queryRunner.query(
            `ALTER TABLE "stock_location" ADD COLUMN IF NOT EXISTS "customFieldsHubcode" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" ADD COLUMN IF NOT EXISTS "customFieldsCountrycode" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" ADD COLUMN IF NOT EXISTS "customFieldsDomesticcarrier" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" ADD COLUMN IF NOT EXISTS "customFieldsCrossbordercarrier" character varying(255);`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" ADD COLUMN IF NOT EXISTS "customFieldsStandardtransitdays" integer DEFAULT 3;`,
            undefined
        );

        // ---------------------------------------------------------------------
        // 4. Multi-Market Entity & Indexes
        // ---------------------------------------------------------------------
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "market" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "countryCode" character varying,
                "supportedCountryCodes" text,
                "currency" character varying NOT NULL,
                "defaultLanguage" character varying NOT NULL,
                "supportedLanguages" text,
                "urlPrefix" character varying NOT NULL DEFAULT '',
                "channelCode" character varying NOT NULL,
                "channelToken" character varying,
                "originHub" character varying,
                "enabled" boolean NOT NULL DEFAULT true,
                "isDefault" boolean NOT NULL DEFAULT false,
                "navigation" text,
                "homepage" text,
                "merchandising" text,
                "content" text,
                "seo" text,
                CONSTRAINT "PK_market_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_market_code" UNIQUE ("code")
            );`,
            undefined
        );

        await queryRunner.query(
            `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_773f4f8f00f00e220d8b792a6b" ON "market" ("code");`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "IDX_c951d1d3048caefed1b0df714d" ON "market" ("urlPrefix");`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "IDX_86bf322647e559434e704a7c9c" ON "market" ("channelCode");`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "IDX_baf3bd0e2c1168ea809664a315" ON "market" ("enabled");`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "IDX_46e1baf632c2d3ffff9fed8001" ON "market" ("isDefault");`,
            undefined
        );

        // ---------------------------------------------------------------------
        // 5. Clean up legacy campaign entity if present
        // ---------------------------------------------------------------------
        await queryRunner.query(`DROP TABLE IF EXISTS "campaign" CASCADE;`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "market" CASCADE;`, undefined);
        await queryRunner.query(`ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsStandardtransitdays";`, undefined);
        await queryRunner.query(`ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsCrossbordercarrier";`, undefined);
        await queryRunner.query(`ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsDomesticcarrier";`, undefined);
        await queryRunner.query(`ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsCountrycode";`, undefined);
        await queryRunner.query(`ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsHubcode";`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "customFieldsIsmultihuborder";`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "customFieldsRecipientkycid";`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsHscode";`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsModelspecs";`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsFabriccareguide";`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "customFieldsOriginhub";`, undefined);
    }
}
