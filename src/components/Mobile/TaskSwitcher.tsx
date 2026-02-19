
import React from 'react';
import { useWindowManager } from '../../context/WindowContext';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskSwitcherProps {
    onClose: () => void;
}

export const TaskSwitcher = ({ onClose }: TaskSwitcherProps) => {
    const { windows, focusWindow, closeWindow } = useWindowManager();
    const activeWindows = windows.filter(w => w.isOpen && !w.isMinimized);

    if (activeWindows.length === 0) {
        return (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center text-white/50" onClick={onClose}>
                No recent apps
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center p-8 gap-6" onClick={onClose}>
            <div className="text-white text-sm font-bold uppercase tracking-widest mb-4">Recents</div>
            <div className="flex gap-6 overflow-x-auto w-full px-4 items-center justify-center h-full no-scrollbar">
                {activeWindows.map(window => (
                    <motion.div
                        key={window.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative w-48 h-64 bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl flex-shrink-0 flex flex-col overflow-hidden group"
                        onClick={(e) => {
                            e.stopPropagation();
                            focusWindow(window.id);
                            onClose();
                        }}
                    >
                        {/* Header preview */}
                        <div className="h-6 bg-[#2d2d2d] flex items-center px-2 border-b border-[#333]">
                            <span className="text-[10px] text-white truncate">{window.title}</span>
                            <button
                                className="ml-auto p-1 text-red-400 hover:bg-red-900/50 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeWindow(window.id);
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                        {/* Mini preview (just an icon or simple representation) */}
                        <div className="flex-1 flex items-center justify-center text-[#ffffff20]">
                            {/* We can't easily clone the component state, so just show icon */}
                            <div className="text-4xl">
                                {window.id === 'terminal' ? '💻' :
                                    window.id === 'projects' ? '📂' :
                                        window.id === 'skills' ? '📊' : '📄'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
