# Multi-Campaign Vendure Plugin (`@suisuto/vendure-multi-campaign-plugin`)

A production-grade, multi-market campaign management and dynamic merchandising plugin for Vendure. It enables marketing and merchandising teams to create seasonal drops, urgency countdown windows, regional promotional codes, sub-slug landing pages, and dynamic homepage layouts with zero code deployments.

---

## 1. Features & Capabilities

- **Strict Multi-Market Isolation**: Campaigns created for a specific market (`in`, `bd`, `global`) never leak into other storefronts.
- **Priority-Based Campaign Precedence**: Assign an integer priority (`priority`) to active campaigns so competing seasonal drops (e.g. Diwali vs Durga Puja) resolve deterministically.
- **Time-Window Scheduling**: Configure `startAt` and `endAt` datetime windows. Campaigns activate and expire automatically without redeployments.
- **Dynamic Homepage Composition**: Dictate section types (`hero`, `countdown`, `campaign-banner`, `featured-collection`, `artisan-story`, `newsletter`) and order dynamically from the Vendure Admin Dashboard.
- **Sub-Slug Editorial Landing Pages**: Configure custom editorial routes (e.g. `/${market}/campaign/${slug}/offers`) with independent layout sections and SEO metadata.
- **Automated Cache Invalidation**: Publishes `CampaignEvent` to Vendure's `EventBus` on `create`, `update`, and `delete`, notifying storefronts via `/api/revalidate` with `tags: ['campaigns', 'campaign-${market}', 'campaign-${slug}']`.
- **Integrity Safeguards**: Enforces URL-safe lowercase slugs, composite unique constraint on `(market, slug)`, and date sanity (`startAt <= endAt`).
- **Vendure Admin Dashboard Extension**: React-based control page with live storefront links, status toggles, priority controls, and datetime pickers.

---

## 2. Installation & Configuration

### In `vendure-config.ts`

```ts
import { MultiCampaignPlugin } from '@suisuto/vendure-multi-campaign-plugin';

export const config: VendureConfig = {
    // ...
    plugins: [
        // ...
        MultiCampaignPlugin.init({
            storefrontRevalidateUrl: process.env.STOREFRONT_URL || 'http://localhost:3001',
            revalidateSecret: process.env.REVALIDATION_SECRET,
        }),
    ],
};
```

*(Note: `CampaignPlugin` is also exported as an alias for backwards compatibility).*

---

## 3. GraphQL Schema & API Surface

### 3.1 Shop API

```graphql
extend type Query {
    activeCampaigns(market: String!): [Campaign!]!
    campaignBySlug(market: String!, slug: String!): Campaign
}
```

#### Querying Active Campaigns:
```graphql
query GetActiveCampaigns($market: String!) {
    activeCampaigns(market: $market) {
        id
        market
        name
        slug
        status
        priority
        startAt
        endAt
        heroImageUrl
        heroHeadline
        heroSubHeadline
        heroCtaLabel
        heroCtaHref
        heroTag
        homepageSections {
            type
            props
        }
        landingPages {
            subSlug
            title
            sections {
                type
                props
            }
            seoTitle
            seoDescription
        }
        promotionCode
        seoTitle
        seoDescription
        banners {
            imageUrl
            headline
            href
        }
    }
}
```

### 3.2 Admin API

Protected with `@Allow(Permission.SuperAdmin, Permission.Authenticated)`:

```graphql
extend type Query {
    campaigns(market: String, status: String): [Campaign!]!
    campaign(id: ID!): Campaign
}

extend type Mutation {
    createCampaign(input: CreateCampaignInput!): Campaign!
    updateCampaign(input: UpdateCampaignInput!): Campaign!
    deleteCampaign(id: ID!): DeletionResponse!
}
```

---

## 4. EventBus & Cache Invalidation Flow

When an administrator creates, updates, or deletes a campaign:

1. `CampaignService` saves the entity and publishes `CampaignEvent(ctx, campaign, 'created' | 'updated' | 'deleted')`.
2. `MultiCampaignPlugin` subscribes to `CampaignEvent` and issues a `POST` request to the storefront's `/api/revalidate` endpoint:
   ```json
   {
       "tags": [
           "campaigns",
           "campaign-in",
           "campaign-diwali"
       ]
   }
   ```
3. The storefront invalidates in-memory and edge caches instantly without requiring a redeployment or server restart.

---

## 5. Database Schema & Migration

The `Campaign` entity uses the `campaign` table with composite indexes:

- `IDX_campaign_market_slug_unique`: Unique index on `("market", "slug")` preventing URL route collisions.
- `IDX_campaign_market_status`: Composite index on `("market", "status")` optimizing active campaign queries.

Applied via TypeORM migration:
`apps/server/src/migrations/1790046009829-campaign_indexes_and_priority.ts`

---

## 6. Running Tests

Run the test suite from the repository root:

```bash
pnpm run test:multi-campaign
```

Or within the package directory:

```bash
pnpm --filter @suisuto/vendure-multi-campaign-plugin test
```
