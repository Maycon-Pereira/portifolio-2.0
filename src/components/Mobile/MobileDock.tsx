import { Triangle, Circle, Square } from 'lucide-react';

interface MobileDockProps {
    onRecentsClick?: () => void;
    onHomeClick?: () => void;
    onBackClick?: () => void;
}

export const MobileDock = ({ onRecentsClick, onHomeClick, onBackClick }: MobileDockProps) => {
    // const { windows, minimizeWindow } = useWindowManager(); // Not needed anymore as logic is lifted up

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
            return;
        }
    };

    const handleHome = () => {
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
            <button onClick={handleHome} className="p-4 active:bg-white/10 rounded-full transition-colors">
                <Circle size={18} fill="#ffffffCC" className="opacity-80 text-transparent" />
            </button>

            {/* Back (Triangle) */}
            <button onClick={handleBack} className="p-4 active:bg-white/10 rounded-full transition-colors">
                <Triangle size={18} fill="#ffffffCC" className="opacity-80 text-transparent rotate-[-90deg]" />
            </button>
        </div>
    );

};
