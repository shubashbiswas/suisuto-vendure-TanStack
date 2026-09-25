import { useState, useRef } from "react";
import { Link } from "@/platform/tanstack/navigation";
import { Volume2, VolumeX, Sparkles, ArrowRight } from "lucide-react";

export function VideoBannerSection({
	videoUrl,
	title = "Curated Atelier Showcase",
	subtitle = "Celebrating timeless craftsmanship, sovereign handloom muslins, and master artisan silks.",
	ctaHref = "/shop",
	ctaText = "Explore Collection",
}: {
	videoUrl?: string;
	title?: string;
	subtitle?: string;
	ctaHref?: string;
	ctaText?: string;
}) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [isMuted, setIsMuted] = useState(true);

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	if (!videoUrl) {
		return null;
	}

	return (
		<section className="relative w-full overflow-hidden bg-black text-white parallax-scroll-container">
			<div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[75vh] min-h-[360px] flex items-center justify-center">
				<video
					ref={videoRef}
					autoPlay
					muted={isMuted}
					loop
					playsInline
					className="absolute inset-0 w-full h-[115%] top-[-7.5%] object-cover opacity-85 parallax-media"
				>
					<source src={videoUrl} type="video/mp4" />
				</video>

				{/* Refined gradient overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/20" />

				{/* Content overlay */}
				<div className="relative z-10 container mx-auto px-4 text-center max-w-4xl py-12">
					<div className="animate-slide-down inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300 mb-4">
						<Sparkles className="size-3 text-amber-400" />
						<span>Runway & Heritage Showcase 2026</span>
					</div>

					<div className="overflow-hidden">
					<h1 className="animate-mask-slide-up stagger-2 font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-4 drop-shadow-md">
						{title}
					</h1>
					</div>

					<p className="animate-reveal-up stagger-4 text-xs sm:text-sm md:text-base text-white/80 font-sans max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow">
						{subtitle}
					</p>

					<div className="animate-reveal-up stagger-6 flex flex-wrap items-center justify-center gap-4">
						<Link
							href={ctaHref}
							className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-white/90 text-xs font-mono font-semibold uppercase tracking-[0.25em] rounded-sm transition-all duration-300 shadow-xl hover:scale-105"
						>
							<span>{ctaText}</span>
							<ArrowRight className="size-3.5" />
						</Link>

						<button
							type="button"
							onClick={toggleMute}
							aria-label={isMuted ? "Unmute video" : "Mute video"}
							className="size-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 flex items-center justify-center transition-all"
						>
							{isMuted ? (
								<VolumeX className="size-4" />
							) : (
								<Volume2 className="size-4" />
							)}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
