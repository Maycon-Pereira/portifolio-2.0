import { useEffect, useState } from 'react';
import { Stars } from './Layout/Stars';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // Start fade out almost immediately
        const timer = setTimeout(() => {
            setOpacity(0);
            setTimeout(onComplete, 800); // Wait for transition to finish
        }, 100);
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (opacity === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-black z-[10000] flex justify-center items-center transition-opacity duration-800 ease-out pointer-events-none"
            style={{ opacity }}
        >
            <Stars count={50} />
        </div>
    );
};
