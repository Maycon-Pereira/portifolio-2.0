import { useState, useEffect } from 'react';
import { useHacker } from '../../context/HackerContext';

export const Clock = () => {
    const [time, setTime] = useState(new Date());
    const { phase } = useHacker();
    const [glitchText, setGlitchText] = useState('');

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (phase === 'glitch') {
            timer = setInterval(() => {
                // Generate random hex string
                setGlitchText(Math.random().toString(16).substring(2, 10).toUpperCase());
            }, 50); // fast change
        } else {
            timer = setInterval(() => setTime(new Date()), 1000);
        }

        return () => clearInterval(timer);
    }, [phase]);

    const formattedTime = time.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <div className={`font-medium ${phase === 'glitch' ? 'text-red-500 font-mono animate-pulse' : ''}`}>
            {phase === 'glitch' ? `0x${glitchText}` : formattedTime}
        </div>
    );
};
