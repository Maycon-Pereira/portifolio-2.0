import { useState, useEffect, useRef } from 'react';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface UseResizableProps {
    initialWidth: number;
    initialHeight: number;
    minWidth?: number;
    minHeight?: number;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
    onResize?: (params: { width: number; height: number; x?: number; y?: number }) => void;
}

export const useResizable = ({
    initialWidth,
    initialHeight,
    minWidth = 200,
    minHeight = 150,
    onResizeStart,
    onResizeEnd,
    onResize
}: UseResizableProps) => {
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
    const isResizing = useRef(false);
    const resizeDirection = useRef<ResizeDirection | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });

    // We need to know the window's current position to resize left/top correctly (expanding left moves x)
    // But since the hook doesn't manage position directly for the general case,
    // we rely on the callback `onResize` to handle x/y updates if needed.
    // However, to calculate the delta, we only need mouse movement.

    const initResize = (direction: ResizeDirection) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        isResizing.current = true;
        resizeDirection.current = direction;
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { width: size.width, height: size.height };

        if (onResizeStart) onResizeStart();

        document.body.style.userSelect = 'none';
        document.body.style.cursor = getCursor(direction);
    };

    // Keep latest callback in ref to avoid re-binding effect
    const latestOnResize = useRef(onResize);
    const latestOnResizeEnd = useRef(onResizeEnd);

    useEffect(() => {
        latestOnResize.current = onResize;
        latestOnResizeEnd.current = onResizeEnd;
    }, [onResize, onResizeEnd]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing.current || !resizeDirection.current) return;

            const dx = e.clientX - startPos.current.x;
            const dy = e.clientY - startPos.current.y;

            const currentWidth = startSize.current.width;
            const currentHeight = startSize.current.height;

            let newWidth = currentWidth;
            let newHeight = currentHeight;
            let newXChange = 0;
            let newYChange = 0;

            const dir = resizeDirection.current;

            // Horizontal resize
            if (dir.includes('e')) {
                newWidth = Math.max(minWidth, currentWidth + dx);
            } else if (dir.includes('w')) {
                const potentialWidth = Math.max(minWidth, currentWidth - dx);
                // If width changed, we moved left
                if (potentialWidth !== currentWidth) {
                    newWidth = potentialWidth;
                    newXChange = dx; // Delta to adjust x position
                }
            }

            // Vertical resize
            if (dir.includes('s')) {
                newHeight = Math.max(minHeight, currentHeight + dy);
            } else if (dir.includes('n')) {
                const potentialHeight = Math.max(minHeight, currentHeight - dy);
                if (potentialHeight !== currentHeight) {
                    newHeight = potentialHeight;
                    newYChange = dy;
                }
            }

            // Always trigger update if mouse moved significantly or if we just want to be responsive
            // But we only set state if size actually changed
            if (newWidth !== currentWidth || newHeight !== currentHeight) { // Wait, comparison should be against current state? 
                // Actually startSize is fixed for the drag. Logic is correct: new vs start.
                // But we need to compare against *last applied* size to avoid redundant updates?
                // setSize checks equality internally usually.

                setSize({ width: newWidth, height: newHeight });

                if (latestOnResize.current) {
                    latestOnResize.current({
                        width: newWidth,
                        height: newHeight,
                        x: (dir.includes('w')) ? (currentWidth - newWidth) : undefined,
                        y: (dir.includes('n')) ? (currentHeight - newHeight) : undefined
                    });
                }
            }
        };

        const onMouseUp = () => {
            if (isResizing.current) {
                isResizing.current = false;
                resizeDirection.current = null;
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
                if (latestOnResizeEnd.current) latestOnResizeEnd.current();
            }
        };

        // Add listeners only once (or when min dimensions change)
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [minWidth, minHeight]); // Removed 'size' and 'onResize' dependencies


    const getCursor = (dir: ResizeDirection) => {
        switch (dir) {
            case 'n': case 's': return 'ns-resize';
            case 'e': case 'w': return 'ew-resize';
            case 'ne': case 'sw': return 'nesw-resize';
            case 'nw': case 'se': return 'nwse-resize';
        }
    };

    // Update size locally if initial props change (e.g. window resize event from context)
    useEffect(() => {
        setSize({ width: initialWidth, height: initialHeight });
    }, [initialWidth, initialHeight]);

    return { size, setSize, initResize, isResizing: isResizing.current };
};
