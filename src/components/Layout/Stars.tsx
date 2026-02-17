import { useEffect, useState } from 'react';

// Animation defined in CSS/Tailwind layer or custom style
// We'll use inline styles for dynamic positioning

interface Star {
    id: number;
    left: string;
    top: string;
    duration: string;
    delay: string;
}

export const Stars = ({ count = 100 }: { count?: number }) => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const newStars: Star[] = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${Math.random() * 2 + 1}s`,
            delay: `${Math.random() * 2}s`,
        }));
        setStars(newStars);
    }, [count]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full w-[2px] h-[2px] animate-pulse"
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDuration: star.duration,
                        animationDelay: star.delay,
                        opacity: 0.8, // Base opacity, pulse handles the rest
                    }}
                />
            ))}
            <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        .animate-pulse {
             animation: twinkle infinite alternate;
        }
      `}</style>
        </div>
    );
};
