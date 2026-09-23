import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMarketCountryCodesAndToken1790100000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "market" ADD "supportedCountryCodes" text`, undefined);
        await queryRunner.query(`ALTER TABLE "market" ADD "channelToken" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "channelToken"`, undefined);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "supportedCountryCodes"`, undefined);
    }
}
