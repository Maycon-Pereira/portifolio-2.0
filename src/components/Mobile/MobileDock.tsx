import { Triangle, Circle, Square } from 'lucide-react';
import { useHacker } from '../../context/HackerContext';

interface MobileDockProps {
    onRecentsClick?: () => void;
    onHomeClick?: () => void;
    onBackClick?: () => void;
}

export const MobileDock = ({ onRecentsClick, onHomeClick, onBackClick }: MobileDockProps) => {
    const { phase, triggerReboot } = useHacker();

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
            return;
        }
    };

    const handleHome = () => {
        if (phase === 'hacker_ide' || phase === 'connected') {
            triggerReboot();
            return;
        }
        if (onHomeClick) {
            onHomeClick();
            return;
        }
    };

    const handleRecents = () => {
        if (onRecentsClick) {
            onRecentsClick();
            return;
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-around w-full pb-2 pt-1 bg-black/20 backdrop-blur-md z-[9999]">
            {/* Menu / Recents (Square or Hamburger depending on style, but Android usually is Square or Lines) */}
            <button onClick={handleRecents} className="p-4 active:bg-white/10 rounded-full transition-colors">
                <Square size={18} fill="#ffffffCC" className="opacity-80 text-transparent" />
            </button>

            {/* Home (Circle) */}
            <button onClick={handleHome} className={`p-4 active:bg-white/10 rounded-full transition-colors ${phase === 'hacker_ide' || phase === 'connected' ? 'animate-pulse bg-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : ''}`}>
                <Circle size={18} fill={phase === 'hacker_ide' || phase === 'connected' ? '#ff0000CC' : '#ffffffCC'} className={`opacity-80 ${phase === 'hacker_ide' || phase === 'connected' ? 'text-red-500 fill-red-500' : 'text-transparent'}`} />
            </button>

            {/* Back (Triangle) */}
            <button onClick={handleBack} className="p-4 active:bg-white/10 rounded-full transition-colors">
                <Triangle size={18} fill="#ffffffCC" className="opacity-80 text-transparent rotate-[-90deg]" />
            </button>
        </div>
    );

};
