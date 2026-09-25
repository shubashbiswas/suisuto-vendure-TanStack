import { useState, useEffect, useCallback } from "react";
import { Link } from "@/platform/tanstack/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface SlideItem {
	id: string;
	title: string;
	subtitle: string;
	tag: string;
	imageUrl: string;
	link: string;
	ctaText: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
	{
		id: "slide-1",
		title: "Festive Grandeur: Royal Panjabi & Heritage Weaves",
		subtitle: "Meticulously woven with 300-count organic cotton and intricate jacquard motifs.",
		tag: "Eid Edition 2026",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/qaY9mGqiiyXMLzXv29tOCsPmcF3FWBAVfjByTF6n.png",
		link: "/shop?category=panjabi",
		ctaText: "Shop Festive Edit",
	},
	{
		id: "slide-2",
		title: "Dhakai Muslin & Jamdani Sarees",
		subtitle: "Certified generational pit-loom craftsmanship direct from master artisan clusters.",
		tag: "Masterpiece Archive",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/nu1GJOaSFIuujkY7YqcVnHFVRpxdz4BEhLEKrEAd.jpg",
		link: "/shop?category=sarees",
		ctaText: "Explore Sarees",
	},
	{
		id: "slide-3",
		title: "Modern Architectural Tailoring",
		subtitle: "Structured silhouettes, casual luxury shirts, and tailored trousers for the contemporary wardrobe.",
		tag: "Contemporary Atelier",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/tQ6PgmHxTEN4UPrO622pihs445CSrdHBCMERAta8.jpg",
		link: "/shop?category=shirts",
		ctaText: "Discover Tailoring",
	},
];

export function FullWidthSlidesSection({
	slides = DEFAULT_SLIDES,
}: {
	slides?: SlideItem[];
}) {
	const validSlides = Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_SLIDES;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const nextSlide = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % validSlides.length);
	}, [validSlides.length]);

	const prevSlide = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + validSlides.length) % validSlides.length);
	}, [validSlides.length]);

	useEffect(() => {
		if (isPaused || validSlides.length <= 1) return;
		const interval = setInterval(nextSlide, 6000);
		return () => clearInterval(interval);
	}, [isPaused, nextSlide, validSlides.length]);

	const currentSlide = validSlides[currentIndex] || validSlides[0];
	if (!currentSlide) return null;

	return (
		<section
			aria-label="Hero Slides Carousel"
			className="relative w-full overflow-hidden bg-neutral-950 group"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div className="relative w-full min-h-[460px] sm:min-h-[540px] md:min-h-[620px] flex items-center">
				{/* Background Images */}
				{validSlides.map((slide, index) => (
					<div
						key={slide.id}
						className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
							index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
						}`}
					>
						<img
							src={slide.imageUrl}
							alt={slide.title}
							className="w-full h-full object-cover object-center"
							loading={index === 0 ? "eager" : "lazy"}
						/>
						{/* Dramatic dark vignette */}
						<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent sm:w-2/3" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
					</div>
				))}

				{/* Foreground content for current active slide */}
				<div className="relative z-20 container mx-auto px-6 sm:px-12 py-16 sm:py-24">
					<div key={currentIndex} className="max-w-xl space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
						<div className="inline-block px-3 py-1 rounded-none bg-primary/80 backdrop-blur-md border border-primary/30 text-[9.5px] font-mono uppercase tracking-[0.3em] text-white">
							{currentSlide.tag}
						</div>

						<h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1]">
							{currentSlide.title}
						</h2>

						<p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-lg">
							{currentSlide.subtitle}
						</p>

						<div className="pt-4">
							<Link
								href={currentSlide.link}
								className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-semibold uppercase tracking-[0.25em] transition-all shadow-xl hover:translate-x-1"
							>
								<span>{currentSlide.ctaText}</span>
								<ArrowRight className="size-4" />
							</Link>
						</div>
					</div>
				</div>

				{/* Navigation arrows */}
				{slides.length > 1 && (
					<>
						<button
							type="button"
							onClick={prevSlide}
							aria-label="Previous slide"
							className="absolute left-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
						>
							<ChevronLeft className="size-5" />
						</button>
						<button
							type="button"
							onClick={nextSlide}
							aria-label="Next slide"
							className="absolute right-4 top-1/2 -translate-y-1/2 z-30 size-11 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
						>
							<ChevronRight className="size-5" />
						</button>
					</>
				)}

				{/* Dots Indicator */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
					{slides.map((slide, index) => (
						<button
							key={`dot-${slide.id}`}
							type="button"
							onClick={() => setCurrentIndex(index)}
							aria-label={`Go to slide ${index + 1}`}
							className={`transition-all duration-300 rounded-full ${
								index === currentIndex
									? "w-8 h-2 bg-white"
									: "size-2 bg-white/40 hover:bg-white/70"
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
