import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
    targetDate?: string;
    headline?: string;
    subHeadline?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownSection({ targetDate, headline, subHeadline }: CountdownProps) {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setMounted(true);
        if (!targetDate) return;

        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    // Client-side only rendering to prevent SSR hydration mismatches
    if (!mounted || !targetDate) {
        return null;
    }

    return (
        <section className="py-12 bg-black text-white border-y border-white/10">
            <div className="container mx-auto px-4 text-center space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] font-mono tracking-[0.25em] uppercase text-white/80">
                    <Clock className="size-3 text-amber-400" />
                    <span>Limited Time Access</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight">
                    {headline || "Limited Edition Campaign Window"}
                </h3>

                {subHeadline && (
                    <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-sans leading-relaxed">
                        {subHeadline}
                    </p>
                )}

                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto pt-2">
                    {[
                        { label: "Days", value: timeLeft.days },
                        { label: "Hours", value: timeLeft.hours },
                        { label: "Mins", value: timeLeft.minutes },
                        { label: "Secs", value: timeLeft.seconds },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-white/5 border border-white/10 p-3 rounded text-center backdrop-blur-sm"
                        >
                            <span className="block font-mono text-2xl sm:text-3xl font-bold tracking-tight text-amber-300">
                                {String(item.value).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/60">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
