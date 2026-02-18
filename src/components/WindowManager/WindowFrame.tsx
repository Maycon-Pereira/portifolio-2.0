import { useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { useResizable } from '../../hooks/useResizable';
import { motion } from 'framer-motion';

interface WindowFrameProps {
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
    isMinimized: boolean;
    isMaximized: boolean;
    overrideStyle?: React.CSSProperties;
    zIndex: number;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onFocus: () => void;
    width?: number;
    height?: number;
    initialX?: number;
    initialY?: number;
    originRect?: { x: number, y: number, width: number, height: number };
    icon?: string;
}

export const WindowFrame = ({
    title,
    children,
    isMinimized,
    isMaximized,
    zIndex,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    width,
    height,
    initialX,
    initialY,
    originRect,
    icon
}: WindowFrameProps) => {

    // 75% of screen size by default
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 800;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 600;

    const defaultWidth = width || (screenW * 0.75);
    const defaultHeight = height || (screenH * 0.75);

    // Handle drag start: if maximized, restore and position under cursor
    const handleDragStart = (e: MouseEvent) => {
        if (isMaximized) {
            // Calculate new position to center the window horizontally under the cursor
            // but keep the same relative percentage if possible, or just center it.
            // Centering is safer and more predictable.
            const newLeft = e.clientX - (defaultWidth / 2);
            const newTop = e.clientY - 22; // Slight offset so cursor is on header (approx center of 45px)

            // Restore window state
            onMaximize();

            // Force update drag state immediately to prevent "jumping" to 0,0 or old position
            setDragState(
                { x: newLeft, y: newTop },
                { x: defaultWidth / 2, y: 22 } // Offset: cursor in middle of header
            );
            return true;
        }
    };

    // We need to use useDraggable, but handle drag only on the header.
    // The hook attaches listeners to `handleRef`.
    const { elementRef, handleRef, position, hasBeenDragged, setDragState } = useDraggable({
        onDragStart: handleDragStart
    });

    // Use Resizable
    // Track the initial position and size when resizing starts
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });

    const onResizeHandler = ({ height, x, y }: { height: number; x?: number; y?: number }) => {
        // x and y from useResizable are total deltas from the start of resize
        // So we calculate new position relative to the START position.

        let newX = resizeStartPos.current.x + (x || 0);
        let newY = resizeStartPos.current.y + (y || 0);
        let newHeight = height;

        // Constraint: Header Height (32px)
        const HEADER_HEIGHT = 32;

        // Check Top Constraint
        if (newY < HEADER_HEIGHT) {
            newY = HEADER_HEIGHT;

            // If we hit top, we must adjust height to keep bottom anchored
            // NewHeight = OriginalBottom - HEADER_HEIGHT
            const currentBottom = resizeStartPos.current.y + resizeStartSize.current.height;
            if (y !== undefined) {
                newHeight = currentBottom - HEADER_HEIGHT;
                // Force hook state update for height
                setSize(prev => ({ ...prev, height: newHeight }));
            }
        }

        if (x !== undefined || y !== undefined) {
            setDragState({ x: newX, y: newY }, { x: 0, y: 0 });
        }
    };

    const { size, setSize, initResize } = useResizable({
        initialWidth: defaultWidth,
        initialHeight: defaultHeight,
        onResize: onResizeHandler,
        onResizeStart: () => {
            resizeStartPos.current = { x: position.x, y: position.y };
            resizeStartSize.current = { width: size.width, height: size.height };
        }
    });

    // Default position: center screen if not dragged
    // If initialX/Y provided, use them. Otherwise center.
    const defaultPosition = !hasBeenDragged.current ? {
        top: initialY !== undefined ? initialY : (screenH - defaultHeight) / 2,
        left: initialX !== undefined ? initialX : (screenW - defaultWidth) / 2,
    } : {
        top: position.y,
        left: position.x
    };

    if (isMinimized) return null;

    const headerHeight = 30; // Approx height with py-3 and text-sm

    const maximizedStyle: any = {
        top: headerHeight, // Header height
        left: 56, // Left dock width + margin
        width: typeof window !== 'undefined' ? window.innerWidth - 56 : '100vw',
        height: typeof window !== 'undefined' ? window.innerHeight - headerHeight : '100vh',
        borderRadius: 0,
    };

    const currentWidth = isMaximized ? maximizedStyle.width : size.width;
    const currentHeight = isMaximized ? maximizedStyle.height : size.height;
    const currentTop = isMaximized ? maximizedStyle.top : defaultPosition.top;
    const currentLeft = isMaximized ? maximizedStyle.left : defaultPosition.left;

    // Helper to check if string is an image path
    const isImagePath = (str?: string) => str && (str.includes('/') || str.includes('data:image') || str.endsWith('.svg') || str.endsWith('.png'));

    return (
        <motion.div
            ref={elementRef}
            initial={originRect ? {
                top: originRect.y,
                left: originRect.x,
                width: originRect.width,
                height: originRect.height,
                opacity: 0,
                scale: 0.5
            } : { opacity: 0, scale: 0.9 }}
            animate={{
                top: currentTop,
                left: currentLeft,
                width: currentWidth,
                height: currentHeight,
                opacity: 1,
                scale: 1,
                borderRadius: isMaximized ? 0 : '0.5rem'
            }}
            exit={{
                opacity: 0,
                scale: 0,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    mass: 0.8,
                    duration: 0.3,
                }
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3
            }}
            className={`fixed bg-[#141428e6] backdrop-blur-xl border border-[#9664ff4d] shadow-2xl overflow-hidden flex flex-col`}
            style={{ zIndex }}
            onMouseDown={onFocus}
        >
            {/* Resize Handles (Only when not maximized) */}
            {!isMaximized && (
                <>
                    {/* Edges */}
                    <div className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize z-50" onMouseDown={initResize('n')} />
                    <div className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize z-50" onMouseDown={initResize('s')} />
                    <div className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize z-50" onMouseDown={initResize('w')} />
                    <div className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize z-50" onMouseDown={initResize('e')} />

                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-50" onMouseDown={initResize('nw')} />
                    <div className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-50" onMouseDown={initResize('ne')} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-50" onMouseDown={initResize('sw')} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50" onMouseDown={initResize('se')} />
                </>
            )}

            {/* Window Header (Draggable) */}
            <div
                ref={handleRef} // Always enable drag ref, but control effect via logic
                className={`flex items-center justify-between px-4 py-1 bg-[#1e1e32] border-b border-[#9664ff33] select-none cursor-grab active:cursor-grabbing min-h-[32px]`}
                onDoubleClick={onMaximize}
            >
                {/* Title / Breadcrumbs Area */}
                <div className="flex-1 flex items-center overflow-hidden mr-4">
                    {/* If title is a string, wrap it. If it's a node (breadcrumbs), render as is. */}
                    {typeof title === 'string' ? (
                        <span className="text-sm font-bold text-[#d0d0ff] flex items-center gap-2">
                            {icon && (
                                isImagePath(icon) ? (
                                    <img src={icon} alt="" className="w-4 h-4 object-contain opacity-70" />
                                ) : (
                                    <span className="opacity-70">{icon}</span>
                                )
                            )}
                            {title}
                        </span>
                    ) : (
                        <div className="w-full text-sm font-medium text-[#d0d0ff]">
                            {title}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 no-drag">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2ecc] transition-colors group relative"
                        title="Minimize"
                    >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">-</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                        className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840cc] transition-colors group relative"
                        title="Maximize"
                    >
                        <span className="absolute inset-0 flex items-center justify-center text-[6px] opacity-0 group-hover:opacity-100 text-black font-bold">□</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57cc] transition-colors group relative"
                        title="Close"
                    >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">x</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-[#0f0c1e80] custom-scrollbar">
                {children}
            </div>

            {/* Custom Scrollbar Styles specific to window content */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(150, 100, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(150, 100, 255, 0.4);
                }
            `}</style>
        </motion.div>
    );
};
