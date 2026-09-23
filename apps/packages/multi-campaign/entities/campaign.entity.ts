import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';
import {
    CampaignBanner,
    CampaignLandingPage,
    HomepageSectionConfig,
} from '../types/campaign.types';

@Entity('campaign')
@Index(['market', 'slug'], { unique: true })
@Index(['market', 'status'])
export class Campaign extends VendureEntity {
    constructor(input?: DeepPartial<Campaign>) {
        super(input);
        if (input) {
            Object.assign(this, input);
        }
    }

    @Column()
    market: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({ default: 'draft' })
    status: string;

    @Column({ default: 0 })
    priority: number;

    @Column({ type: 'timestamp with time zone', nullable: true })
    startAt?: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    endAt?: Date;

    @Column({ nullable: true })
    heroImageUrl?: string;

    @Column({ nullable: true })
    heroHeadline?: string;

    @Column({ nullable: true })
    heroSubHeadline?: string;

    @Column({ nullable: true })
    heroCtaLabel?: string;

    @Column({ nullable: true })
    heroCtaHref?: string;

    @Column({ nullable: true })
    heroTag?: string;

    @Column('simple-json', { nullable: true })
    homepageSections?: HomepageSectionConfig[];

    @Column('simple-json', { nullable: true })
    landingPages?: CampaignLandingPage[];

    @Column({ nullable: true })
    promotionCode?: string;

    @Column({ nullable: true })
    seoTitle?: string;

    @Column({ nullable: true })
    seoDescription?: string;

    @Column({ nullable: true })
    seoImage?: string;

    @Column('simple-json', { nullable: true })
    banners?: CampaignBanner[];
}
