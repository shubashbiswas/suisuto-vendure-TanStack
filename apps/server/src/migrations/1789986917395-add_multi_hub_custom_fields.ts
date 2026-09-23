import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMultiHubCustomFields1789986917395 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsOriginhub" character varying(255) NOT NULL DEFAULT 'BD_HUB'`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsFabriccareguide" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsModelspecs" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsHscode" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsRecipientkycid" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsIsmultihuborder" boolean DEFAULT false`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsIsmultihuborder"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsRecipientkycid"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsHscode"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsModelspecs"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsFabriccareguide"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsOriginhub"`, undefined);
   }

}
