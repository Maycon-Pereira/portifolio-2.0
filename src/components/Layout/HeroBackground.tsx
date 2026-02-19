import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../hooks/useI18nHook';

export const HeroBackground = ({ className }: { className?: string }) => {
    const { t } = useI18n();
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [typingDone, setTypingDone] = useState(false);
    const prevLangRef = useRef<string | null>(null);

    const lines = [
        { text: t('hero.name'), delay: 100 },
        { text: t('hero.subtitle'), delay: 60 },
        { text: t('hero.specialty'), delay: 40 },
    ];

    // When language changes after typing is done, update displayed lines instantly
    const currentTexts = `${t('hero.name')}|${t('hero.subtitle')}|${t('hero.specialty')}`;
    useEffect(() => {
        if (prevLangRef.current !== null && prevLangRef.current !== currentTexts && typingDone) {
            setDisplayedLines([t('hero.name'), t('hero.subtitle'), t('hero.specialty')]);
        }
        prevLangRef.current = currentTexts;
    }, [currentTexts, typingDone]);

    useEffect(() => {
        if (typingDone) return;
        if (lineIndex >= lines.length) {
            setTypingDone(true);
            return;
        }

        const currentLine = lines[lineIndex];
        if (charIndex < currentLine.text.length) {
            const timer = setTimeout(() => {
                setDisplayedLines(prev => {
                    const updated = [...prev];
                    updated[lineIndex] = currentLine.text.slice(0, charIndex + 1);
                    return updated;
                });
                setCharIndex(charIndex + 1);
            }, currentLine.delay);
            return () => clearTimeout(timer);
        } else {
            // Line finished, move to next after a short pause
            const timer = setTimeout(() => {
                setLineIndex(lineIndex + 1);
                setCharIndex(0);
                setDisplayedLines(prev => [...prev, '']);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [lineIndex, charIndex, typingDone]);

    const isTypingDone = typingDone;
    const cursorLineIndex = isTypingDone ? lines.length - 1 : lineIndex;

    const containerClass = className || "absolute top-1/2 -translate-y-1/2 left-[5%]";

    return (
        <div className={`${containerClass} flex flex-col gap-3 select-none pointer-events-none z-[1]`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <h1 className="text-[120px] font-[800] leading-[1] text-white tracking-[-4px] m-0 hero-glow hero-flicker min-h-[120px] opacity-100">
                {displayedLines[0] || ''}
                {cursorLineIndex === 0 && <span className="blink-cursor text-[#64ffda]">|</span>}
            </h1>
            <h2 className="text-[40px] font-[600] leading-[1.2] text-[#9664ff] m-0 tracking-[-1px] min-h-[48px]">
                {displayedLines[1] || ''}
                {cursorLineIndex === 1 && <span className="blink-cursor text-[#64ffda]">|</span>}
            </h2>
            <p className="text-[24px] font-[300] leading-[1.4] text-[#c8c8e680] m-0 tracking-[2px] uppercase min-h-[34px]">
                {displayedLines[2] || ''}
                {cursorLineIndex === 2 && <span className="blink-cursor text-[#64ffda]">|</span>}
            </p>
        </div>
    );
};
