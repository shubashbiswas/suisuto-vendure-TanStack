import { MigrationInterface, QueryRunner } from "typeorm";

export class RelaxOriginHubOptions1789986917396 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customFieldsOriginhub" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customFieldsOriginhub" SET DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customFieldsOriginhub" SET DEFAULT 'BD_HUB'`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customFieldsOriginhub" SET NOT NULL`, undefined);
    }
}
