import { useEffect, useRef } from 'react';
import { useWindowManager } from '../context/WindowContext';
import { Terminal } from './Terminal/Terminal';

export const AppInitializer = () => {
    const { openWindow } = useWindowManager();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            // Open Terminal by default with 25% width, 85% height, positioned on the right
            const width = window.innerWidth * 0.25;
            const height = window.innerHeight * 0.85;
            const x = window.innerWidth * 0.75; // Start at 75% across (occupying the last 25%)
            const y = (window.innerHeight - height) / 2; // Center vertically
            openWindow('terminal', 'Terminal', <Terminal />, 0, '💻', { width, height, x, y });
        }
    }, [openWindow]);

    return null;
};
