import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, ID, Permission, RequestContext } from '@vendure/core';
import { gql } from 'graphql-tag';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from '../services/campaign.service';
import {
    CreateCampaignInput,
    DeletionResponse,
    UpdateCampaignInput,
} from '../types/campaign.types';

export const campaignAdminApiSchema: any = gql`
    type CampaignBanner {
        imageUrl: String!
        headline: String
        href: String
    }

    type CampaignLandingPage {
        subSlug: String!
        title: String!
        sections: [HomepageSectionConfig!]!
        seoTitle: String
        seoDescription: String
    }

    type HomepageSectionConfig {
        type: String!
        props: JSON
    }

    type Campaign {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        market: String!
        name: String!
        slug: String!
        status: String!
        priority: Int
        startAt: DateTime
        endAt: DateTime
        heroImageUrl: String
        heroHeadline: String
        heroSubHeadline: String
        heroCtaLabel: String
        heroCtaHref: String
        heroTag: String
        homepageSections: [HomepageSectionConfig!]
        landingPages: [CampaignLandingPage!]
        promotionCode: String
        seoTitle: String
        seoDescription: String
        seoImage: String
        banners: [CampaignBanner!]
    }

    input HomepageSectionConfigInput {
        type: String!
        props: JSON
    }

    input CampaignLandingPageInput {
        subSlug: String!
        title: String!
        sections: [HomepageSectionConfigInput!]!
        seoTitle: String
        seoDescription: String
    }

    input CampaignBannerInput {
        imageUrl: String!
        headline: String
        href: String
    }

    input CreateCampaignInput {
        market: String!
        name: String!
        slug: String!
        status: String
        priority: Int
        startAt: DateTime
        endAt: DateTime
        heroImageUrl: String
        heroHeadline: String
        heroSubHeadline: String
        heroCtaLabel: String
        heroCtaHref: String
        heroTag: String
        homepageSections: [HomepageSectionConfigInput!]
        landingPages: [CampaignLandingPageInput!]
        promotionCode: String
        seoTitle: String
        seoDescription: String
        seoImage: String
        banners: [CampaignBannerInput!]
    }

    input UpdateCampaignInput {
        id: ID!
        market: String
        name: String
        slug: String
        status: String
        priority: Int
        startAt: DateTime
        endAt: DateTime
        heroImageUrl: String
        heroHeadline: String
        heroSubHeadline: String
        heroCtaLabel: String
        heroCtaHref: String
        heroTag: String
        homepageSections: [HomepageSectionConfigInput!]
        landingPages: [CampaignLandingPageInput!]
        promotionCode: String
        seoTitle: String
        seoDescription: String
        seoImage: String
        banners: [CampaignBannerInput!]
    }

    extend type Query {
        campaigns(market: String, status: String): [Campaign!]!
        campaign(id: ID!): Campaign
    }

    extend type Mutation {
        createCampaign(input: CreateCampaignInput!): Campaign!
        updateCampaign(input: UpdateCampaignInput!): Campaign!
        deleteCampaign(id: ID!): DeletionResponse!
    }
`;

@Resolver()
export class CampaignAdminResolver {
    constructor(private campaignService: CampaignService) {}

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async campaigns(
        @Ctx() ctx: RequestContext,
        @Args('market', { nullable: true }) market?: string,
        @Args('status', { nullable: true }) status?: string,
    ): Promise<Campaign[]> {
        return this.campaignService.findAll(ctx, { market, status });
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async campaign(
        @Ctx() ctx: RequestContext,
        @Args('id') id: ID,
    ): Promise<Campaign | null> {
        return this.campaignService.findOne(ctx, id);
    }

    @Mutation()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async createCampaign(
        @Ctx() ctx: RequestContext,
        @Args('input') input: CreateCampaignInput,
    ): Promise<Campaign> {
        return this.campaignService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async updateCampaign(
        @Ctx() ctx: RequestContext,
        @Args('input') input: UpdateCampaignInput,
    ): Promise<Campaign> {
        return this.campaignService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.SuperAdmin, Permission.Authenticated)
    async deleteCampaign(
        @Ctx() ctx: RequestContext,
        @Args('id') id: ID,
    ): Promise<DeletionResponse> {
        return this.campaignService.delete(ctx, id);
    }
}
