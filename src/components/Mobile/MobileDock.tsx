import { Triangle, Circle, Square } from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';

interface MobileDockProps {
    onRecentsClick?: () => void;
    onHomeClick?: () => void;
    onBackClick?: () => void;
}

export const MobileDock = ({ onRecentsClick, onHomeClick, onBackClick }: MobileDockProps) => {
    const { windows, minimizeWindow } = useWindowManager();

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
            return;
        }
        // Default back behavior: minimize top window?
        // Or just navigate back in history?
        // For now, let's say it minimizes the top app.
        const active = windows.filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex);
        if (active.length > 0) {
            minimizeWindow(active[0].id);
        }
    };

    const handleHome = () => {
        if (onHomeClick) {
            onHomeClick();
            return;
        }
        // Minimize all
        windows.forEach(w => {
            if (w.isOpen && !w.isMinimized) minimizeWindow(w.id);
        });
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

    function handleRecents() {
        if (onRecentsClick) onRecentsClick();
    }
};
