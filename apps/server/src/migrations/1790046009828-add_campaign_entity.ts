import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCampaignEntity1790046009828 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "campaign" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "market" character varying NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "startAt" TIMESTAMP WITH TIME ZONE, "endAt" TIMESTAMP WITH TIME ZONE, "heroImageUrl" character varying, "heroHeadline" character varying, "heroSubHeadline" character varying, "heroCtaLabel" character varying, "heroCtaHref" character varying, "heroTag" character varying, "homepageSections" text, "landingPages" text, "promotionCode" character varying, "seoTitle" character varying, "seoDescription" character varying, "seoImage" character varying, "banners" text, "id" SERIAL NOT NULL, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "campaign"`, undefined);
   }

}
