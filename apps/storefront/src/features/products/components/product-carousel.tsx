import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductCardFragment } from "@/features/products/graphql";
import { type FragmentOf, readFragment } from "@/platform/vendure/graphql";

interface ProductCarouselClientProps {
	title: string;
	products: Array<FragmentOf<typeof ProductCardFragment>>;
	currencyCode: string;
}

export function ProductCarousel({
	title,
	products,
	currencyCode,
}: ProductCarouselClientProps) {
	return (
		<section className="py-16 md:py-24 border-b border-border/40 bg-background">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12">
					<span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground block mb-2">
						Haute Couture Runway
					</span>
					<h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
						{title}
					</h2>
				</div>
				<Carousel
					opts={{
						align: "start",
						loop: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-4 md:-ml-6">
						{products.map((product, index) => (
							<CarouselItem
								key={readFragment(ProductCardFragment, product).productId}
								className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
							>
								<ProductCard
									product={product}
									currencyCode={currencyCode}
									priority={index === 0}
									layout="carousel"
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden md:flex -left-4 rounded-none bg-background/90 border-border hover:bg-foreground hover:text-background transition-colors" />
					<CarouselNext className="hidden md:flex -right-4 rounded-none bg-background/90 border-border hover:bg-foreground hover:text-background transition-colors" />
				</Carousel>
			</div>
		</section>
	);
}
