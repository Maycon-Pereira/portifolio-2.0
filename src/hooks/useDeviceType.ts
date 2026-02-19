
import { useState, useEffect } from 'react';

export const useDeviceType = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 600; // Using the same 600px threshold we set in AppInitializer
        }
        return false;
    });

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 600);
        };

        // Initial check
        checkDevice();

        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return { isMobile };
};
