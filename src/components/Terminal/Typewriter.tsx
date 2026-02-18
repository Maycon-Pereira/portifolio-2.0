import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    delay?: number;
    onComplete?: () => void;
}

export const Typewriter = ({ text, delay = 15, onComplete }: TypewriterProps) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, text, onComplete]);

    return <span className="whitespace-pre-wrap">{currentText}</span>;
};
