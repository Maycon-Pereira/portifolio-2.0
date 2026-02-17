import { useState, useEffect, useRef } from 'react';

export const useDraggable = ({ onDragStart }: { onDragStart?: (e: MouseEvent) => boolean | void } = {}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const isMouseDownRef = useRef(false);
    const dragOrigin = useRef({ x: 0, y: 0 });
    const dragOffset = useRef({ x: 0, y: 0 });
    const hasBeenDragged = useRef(false);

    const setDragState = (newPosition: { x: number, y: number }, newOffset: { x: number, y: number }) => {
        setPosition(newPosition);
        dragOffset.current = newOffset;
        hasBeenDragged.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
    };

    useEffect(() => {
        const handle = handleRef.current;
        const element = elementRef.current;
        if (!handle || !element) return;

        const onMouseDown = (e: MouseEvent) => {
            // Prevent drag if clicking on controls inside the header (like dots)
            if ((e.target as HTMLElement).closest('.no-drag')) return;

            isMouseDownRef.current = true;
            dragOrigin.current = { x: e.clientX, y: e.clientY };

            // Do NOT start dragging yet. Wait for movement threshold.
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isMouseDownRef.current) return;

            if (!isDraggingRef.current) {
                // Check threshold
                const dx = Math.abs(e.clientX - dragOrigin.current.x);
                const dy = Math.abs(e.clientY - dragOrigin.current.y);
                const threshold = 5;

                if (dx > threshold || dy > threshold) {
                    // Start Dragging
                    isDraggingRef.current = true;
                    setIsDragging(true);

                    let customOffsetSet = false;

                    // Call optional callback (e.g., to restore maximized window)
                    if (onDragStart) {
                        const result = onDragStart(e);
                        if (result === true) {
                            customOffsetSet = true;
                        }
                    }

                    // Initialize position on first drag if not set
                    if (!hasBeenDragged.current && !customOffsetSet) {
                        const rect = element.getBoundingClientRect();
                        setPosition({ x: rect.left, y: rect.top });
                        hasBeenDragged.current = true;
                    }

                    // Set initial offset relative to the *current* mouse position
                    // Note: If onDragStart changed the window (maximized -> restored), 
                    // setDragState might have already updated hasBeenDragged/offset.
                    // But if it was a normal drag, we do it here.
                    if (!customOffsetSet) {
                        const rect = element.getBoundingClientRect();
                        dragOffset.current = {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                        };
                    }

                    document.body.style.userSelect = 'none';
                    document.body.style.cursor = 'grabbing';
                } else {
                    return; // Movement too small, treat as click/static
                }
            }

            // Normal Drag Logic
            let newLeft = e.clientX - dragOffset.current.x;
            let newTop = e.clientY - dragOffset.current.y;

            // Clamp to viewport
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(32, Math.min(newTop, maxTop)); // 32px is TopBar height

            setPosition({ x: newLeft, y: newTop });
        };

        const onMouseUp = () => {
            isMouseDownRef.current = false;

            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                setIsDragging(false);
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
            }
        };

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            handle.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [onDragStart]);

    return { elementRef, handleRef, position, hasBeenDragged, setDragState, isDragging };
};
