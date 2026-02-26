import { createContext, useContext, useState, ReactNode } from 'react';

export type HackerPhase = 'idle' | 'connecting' | 'glitch' | 'connected' | 'hacker_ide' | 'rebooting' | 'restored';

interface HackerContextType {
    phase: HackerPhase;
    startSequence: () => void;
    triggerReboot: () => void;
    clearRestored: () => void;
}

const HackerContext = createContext<HackerContextType | undefined>(undefined);

export const HackerProvider = ({ children }: { children: ReactNode }) => {
    const [phase, setPhase] = useState<HackerPhase>('idle');

    const startSequence = () => {
        if (phase !== 'idle') return;

        setPhase('connecting');

        // Sequence timing
        setTimeout(() => {
            setPhase('glitch');
            setTimeout(() => {
                setPhase('connected');
                // Vibrate if on mobile during connection
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                }
                setTimeout(() => {
                    setPhase('hacker_ide');
                }, 3000); // stay in connected alert briefly before showing IDE content
            }, 2500); // 2.5s glitch
        }, 3000); // 3s image sequence
    };

    const triggerReboot = () => {
        setPhase('rebooting');
        setTimeout(() => {
            setPhase('restored');
            setTimeout(() => {
                setPhase('idle');
            }, 4000); // Display restored notification for 4s
        }, 5000); // 5s reboot sequence
    };

    const clearRestored = () => {
        if (phase === 'restored') {
            setPhase('idle');
        }
    }

    return (
        <HackerContext.Provider value={{ phase, startSequence, triggerReboot, clearRestored }}>
            {children}
        </HackerContext.Provider>
    );
};

export const useHacker = () => {
    const context = useContext(HackerContext);
    if (!context) {
        throw new Error('useHacker must be used within a HackerProvider');
    }
    return context;
};
