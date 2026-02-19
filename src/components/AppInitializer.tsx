import { useEffect, useRef } from 'react';
import { useWindowManager } from '../context/WindowContext';
import { Terminal } from './Terminal/Terminal';

export const AppInitializer = () => {
    const { openWindow } = useWindowManager();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            // Should not open terminal by default on mobile
            if (window.innerWidth < 600) return;

            // Open Terminal by default with fixed dimensions (based on notebook standards)
            const width = 341;
            const height = 460;
            const x = window.innerWidth - width - 10; // Position on the right with a small margin
            const y = (window.innerHeight - height) / 2; // Center vertically
            openWindow('terminal', 'Terminal', <Terminal />, 0, '💻', { width, height, x, y });
        }
    }, [openWindow]);

    return null;
};
