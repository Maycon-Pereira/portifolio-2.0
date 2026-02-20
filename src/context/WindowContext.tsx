import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

export interface WindowState {
    id: string;
    title: ReactNode;
    component: ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    icon?: string;
    workspaceId: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    originRect?: { x: number, y: number, width: number, height: number };
}

interface WindowContextType {
    windows: WindowState[];
    openWindow: (id: string, title: string, component: ReactNode, workspaceId: number, icon?: string, options?: { width?: number, height?: number, x?: number, y?: number, originRect?: { x: number, y: number, width: number, height: number } }) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    toggleWindow: (id: string, workspaceId: number) => void;
    closeAllWindows: () => void;
    setWindowTitle: (id: string, title: ReactNode) => void;
    updateWindow: (id: string, updates: Partial<WindowState>) => void;
    registerBackHandler: (id: string, handler: () => boolean) => void;
    unregisterBackHandler: (id: string) => void;
    handleWindowBack: (id: string) => boolean;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: ReactNode }) => {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [topZIndex, setTopZIndex] = useState(100);

    const [cascadeOffset, setCascadeOffset] = useState(0);
    const backHandlers = useRef<Record<string, () => boolean>>({});

    const focusWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, zIndex: topZIndex + 1, isMinimized: false };
            }
            return w;
        }));
        setTopZIndex(prev => prev + 1);
    }, [topZIndex]);

    const openWindow = useCallback((id: string, title: string, component: ReactNode, workspaceId: number, icon?: string, options?: { width?: number, height?: number, x?: number, y?: number, originRect?: { x: number, y: number, width: number, height: number } }) => {
        // Calculate position BEFORE updating state to avoid side effects in updater
        let finalX = options?.x;
        let finalY = options?.y;
        const finalWidth = options?.width || (typeof window !== 'undefined' ? window.innerWidth * 0.75 : 800);
        const finalHeight = options?.height || (typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600);
        let shouldIncrementCascade = false;

        // If no explicit position provided, calculate cascade position
        if (finalX === undefined || finalY === undefined) {
            if (typeof window !== 'undefined') {
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;
                const headerHeight = 32;

                // Start at center
                const baseX = (screenW - finalWidth) / 2;
                const baseY = (screenH - finalHeight) / 2;

                // Apply current cascade offset
                const offsetX = cascadeOffset * 20;
                const offsetY = cascadeOffset * 20;

                let tempX = baseX + offsetX;
                let tempY = baseY + offsetY;

                // Check bounds
                if (tempY + finalHeight > screenH - 5 || tempX + finalWidth > screenW - 5) {
                    // Reset cascade for THIS window and next
                    setCascadeOffset(1); // Set to 1 for NEXT window (since this one uses 0)
                    tempX = baseX;
                    tempY = baseY;
                    // We don't increment here because we just reset.
                } else {
                    shouldIncrementCascade = true;
                }

                finalX = tempX;
                finalY = Math.max(headerHeight, tempY);
            } else {
                finalX = 0;
                finalY = 0;
            }
        }

        if (shouldIncrementCascade) {
            setCascadeOffset(prev => prev + 1);
        }

        setWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                // If exists, just focus.
                if (!existing.isOpen || existing.isMinimized || existing.workspaceId !== workspaceId) {
                    setTimeout(() => focusWindow(id), 0);
                    return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, workspaceId } : w);
                }
                setTimeout(() => focusWindow(id), 0);
                return prev;
            }

            // Check auto-maximize
            const someMaximized = prev.some(w => w.isOpen && w.isMaximized && !w.isMinimized);
            const shouldMaximize = someMaximized && !options?.width && !options?.height;

            return [...prev, {
                id,
                title,
                component,
                isOpen: true,
                isMinimized: false,
                isMaximized: shouldMaximize,
                zIndex: topZIndex + 1,
                icon,
                workspaceId,
                width: options?.width,
                height: options?.height,
                x: finalX,
                y: finalY,
                originRect: options?.originRect // Store origin rect
            }];
        });
        setTopZIndex(prev => prev + 1);
    }, [topZIndex, focusWindow, cascadeOffset]);

    const closeWindow = useCallback((id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const minimizeWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    }, []);

    const maximizeWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    }, []);

    const toggleWindow = useCallback((id: string, workspaceId: number) => {
        setWindows(prev => {
            const win = prev.find(w => w.id === id);
            if (!win) return prev;

            // If minimized -> Restore
            if (win.isMinimized) {
                setTimeout(() => focusWindow(id), 0);
                return prev.map(w => w.id === id ? { ...w, isMinimized: false, workspaceId } : w); // Brings to current workspace
            }

            // If dragging/focused -> Minimize
            const openWindows = prev.filter(w => w.isOpen && !w.isMinimized);
            const isTop = openWindows.every(w => w.zIndex <= win.zIndex);

            if (isTop) {
                return prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
            } else {
                // Focus and bring to front
                setTimeout(() => focusWindow(id), 0);
                return prev.map(w => w.id === id ? { ...w, workspaceId } : w);
            }
        });
    }, [focusWindow]);

    const closeAllWindows = useCallback(() => {
        setWindows([]);
    }, []);

    const setWindowTitle = useCallback((id: string, title: ReactNode) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, title } : w));
    }, []);

    const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    }, []);

    const registerBackHandler = useCallback((id: string, handler: () => boolean) => {
        backHandlers.current[id] = handler;
    }, []);

    const unregisterBackHandler = useCallback((id: string) => {
        delete backHandlers.current[id];
    }, []);

    const handleWindowBack = useCallback((id: string): boolean => {
        const handler = backHandlers.current[id];
        if (handler) {
            return handler();
        }
        return false;
    }, []);

    return (
        <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, toggleWindow, closeAllWindows, setWindowTitle, updateWindow, registerBackHandler, unregisterBackHandler, handleWindowBack }}>
            {children}
        </WindowContext.Provider>
    );
};

export const useWindowManager = () => {
    const context = useContext(WindowContext);
    if (!context) throw new Error('useWindowManager must be used within a WindowProvider');
    return context;
};
