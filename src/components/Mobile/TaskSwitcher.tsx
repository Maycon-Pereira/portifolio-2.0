import { useWindowManager } from '../../context/WindowContext';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskSwitcherProps {
    onClose: () => void;
}

export const TaskSwitcher = ({ onClose }: TaskSwitcherProps) => {
    const { windows, focusWindow, closeWindow } = useWindowManager();
    // Sort by z-index descending (most recent first)
    const activeWindows = windows
        .filter(w => w.isOpen && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);

    if (activeWindows.length === 0) {
        return (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center text-white/50" onClick={onClose}>
                No recent apps
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[500] flex flex-col items-center justify-between py-8 gap-6" onClick={onClose}>
            <div className="text-white text-sm font-bold uppercase tracking-widest mt-4">Recents</div>

            <div className="flex gap-6 overflow-x-auto w-full px-8 items-center h-full no-scrollbar snap-x snap-mandatory">
                {activeWindows.map(window => (
                    <motion.div
                        key={window.id}
                        layoutId={window.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -800, transition: { duration: 0.3 } }}
                        drag="y"
                        dragConstraints={{ top: -1000, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={(_, { offset, velocity }) => {
                            // Swipe UP to close (negative Y offset)
                            if (offset.y < -100 || velocity.y < -500) {
                                closeWindow(window.id);
                            }
                        }}
                        className="relative w-[85vw] h-[75vh] bg-[#1e1e1e] rounded-[32px] border border-[#333] shadow-2xl flex-shrink-0 flex flex-col overflow-hidden group snap-center"
                        onClick={(e) => {
                            focusWindow(window.id);
                            onClose();
                        }}
                    >
                        {/* Header preview */}
                        <div className="h-8 bg-[#2d2d2d] flex items-center px-3 border-b border-[#333]">
                            <span className="text-xs text-white truncate font-medium">{window.title}</span>
                            <button
                                className="ml-auto p-1.5 text-red-400 hover:bg-red-900/50 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeWindow(window.id);
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                        {/* Mini preview (just an icon or simple representation) */}
                        <div className="flex-1 flex items-center justify-center text-[#ffffff20]">
                            <div className="text-6xl">
                                {window.id === 'terminal' ? '💻' :
                                    window.id === 'projects' ? '📂' :
                                        window.id === 'skills' ? '📊' :
                                            window.id === 'about' ? '👨‍🚀' :
                                                window.id === 'contact' ? '📞' : '📄'}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Spacer for last item */}
                <div className="w-4 flex-shrink-0" />
            </div>

            {/* Close All Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    activeWindows.forEach(w => closeWindow(w.id));
                    onClose();
                }}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white/80 text-sm font-medium backdrop-blur-sm transition-colors border border-white/5"
            >
                Close All
            </button>
        </div>
    );
};
