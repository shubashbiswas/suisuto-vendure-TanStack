import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStockLocationCustomFields1790100000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsStandardtransitdays";`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsCrossbordercarrier";`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsDomesticcarrier";`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsCountrycode";`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stock_location" DROP COLUMN IF EXISTS "customFieldsHubcode";`,
            undefined
        );
    }
}
