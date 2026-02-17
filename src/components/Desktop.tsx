import { useWindowManager } from '../context/WindowContext';
import { WindowFrame } from './WindowManager/WindowFrame';
import { AnimatePresence } from 'framer-motion';

interface DesktopProps {
    currentWorkspace: number;
    onWorkspaceChange: (index: number) => void;
}

export const Desktop = ({ currentWorkspace }: DesktopProps) => {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowManager();

    // Filter windows for current workspace (excluding minimized ones for tiling calculation)
    const activeWindows = windows.filter(w => w.isOpen && w.workspaceId === currentWorkspace && !w.isMinimized);

    // Tiling Logic REMOVED for floating window support
    // const getTiledStyle = ...

    return (
        <div className="absolute inset-0 z-[60] overflow-hidden pointer-events-none">
            {/* Workspace Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold text-[#ffffff05] pointer-events-none select-none">
                {currentWorkspace + 1}
            </div>

            {/* Windows Container */}
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence>
                    {activeWindows.map((window) => (
                        <WindowFrame
                            key={window.id}
                            id={window.id}
                            title={window.title}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            // overrideStyle={getTiledStyle(index, activeWindows.length)} // Disabled tiling
                            zIndex={window.zIndex}
                            onClose={() => closeWindow(window.id)}
                            onMinimize={() => minimizeWindow(window.id)}
                            onMaximize={() => maximizeWindow(window.id)}
                            onFocus={() => focusWindow(window.id)}
                            width={window.width}
                            height={window.height}
                            initialX={window.x}
                            initialY={window.y}
                            originRect={window.originRect}
                            icon={window.icon}
                        >
                            {window.component}
                        </WindowFrame>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
