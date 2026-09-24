import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core';
import { gql } from 'graphql-tag';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from '../services/campaign.service';

export const campaignShopApiSchema: any = gql`
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

    type CampaignPluginStatus {
        enabled: Boolean!
    }

    extend type Query {
        activeCampaigns(market: String!): [Campaign!]!
        campaignBySlug(market: String!, slug: String!): Campaign
        campaignPluginStatus: CampaignPluginStatus!
    }
`;

@Resolver()
export class CampaignShopResolver {
    constructor(private campaignService: CampaignService) {}

    @Query()
    async campaignPluginStatus(@Ctx() ctx: RequestContext) {
        return this.campaignService.getPluginStatus();
    }

    @Query()
    async activeCampaigns(
        @Ctx() ctx: RequestContext,
        @Args('market') market: string
    ): Promise<Campaign[]> {
        return this.campaignService.findActive(ctx, market);
    }

    @Query()
    async campaignBySlug(
        @Ctx() ctx: RequestContext,
        @Args('market') market: string,
        @Args('slug') slug: string
    ): Promise<Campaign | null> {
        return this.campaignService.findBySlug(ctx, market, slug);
    }
}
