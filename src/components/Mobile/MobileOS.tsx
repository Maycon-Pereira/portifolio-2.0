import { useState, useRef, useEffect } from 'react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileDock } from './MobileDock';
import { MobileHomeApps, MobileDockApps } from './AppGrid';
import { ControlPanel } from './ControlPanel';
import { TaskSwitcher } from './TaskSwitcher';
import { useWindowManager } from '../../context/WindowContext';
import { useSystem } from '../../context/SystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileDateWidget } from './MobileDateWidget';
import { MobileSearchBar } from './MobileSearchBar';
import { Stars } from '../Layout/Stars';
import { HeroBackground } from '../Layout/HeroBackground';

import spacemanJellyfish from '../../img/spacemanJellyfish.jpg';
import spaceSound from '../../assets/spacesound.ogg';

export const MobileOS = () => {
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
    const [isTaskSwitcherOpen, setIsTaskSwitcherOpen] = useState(false);
    const { windows, minimizeWindow, handleWindowBack } = useWindowManager();
    const { isShaking, volume } = useSystem();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Filter active windows (not minimized)
    const activeWindows = windows.filter(w => w.isOpen && !w.isMinimized);

    // Sort by z-index to ensure correct layering
    const sortedWindows = [...activeWindows].sort((a, b) => a.zIndex - b.zIndex);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            if (volume > 0 && audioRef.current.paused) {
                audioRef.current.play().catch(() => { });
            } else if (volume === 0 && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [volume]);

    // Navigation Handlers
    const handleBack = () => {
        if (isControlPanelOpen) {
            setIsControlPanelOpen(false);
            return;
        }
        if (isTaskSwitcherOpen) {
            setIsTaskSwitcherOpen(false);
            return;
        }
        // Close/Minimize top window
        if (sortedWindows.length > 0) {
            const topWindow = sortedWindows[sortedWindows.length - 1];
            if (handleWindowBack(topWindow.id)) return;
            minimizeWindow(topWindow.id);
        }
    };

    const handleHome = () => {
        if (isControlPanelOpen) setIsControlPanelOpen(false);
        if (isTaskSwitcherOpen) setIsTaskSwitcherOpen(false);

        // Minimize all windows
        activeWindows.forEach(w => minimizeWindow(w.id));
    };

    const handleRecents = () => {
        if (isControlPanelOpen) setIsControlPanelOpen(false);
        setIsTaskSwitcherOpen(!isTaskSwitcherOpen);
    };

    // Touch Handling
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;

        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const deltaY = touchEnd.y - touchStart.y;
        const deltaX = touchEnd.x - touchStart.x;

        // Ensure vertical swipe (Y diff > X diff)
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // Swipe Down (Positive Delta)
            // ONLY trigger if swipe started from the top area (Status Bar) to avoid conflict with app scrolling
            if (deltaY > 50 && touchStart.y < 80) {
                // Open if panel is closed
                if (!isControlPanelOpen) {
                    setIsControlPanelOpen(true);
                }
            }
            // Swipe Up (Negative Delta)
            else if (deltaY < -50) {
                // Close if open
                if (isControlPanelOpen) {
                    setIsControlPanelOpen(false);
                }
            }
        }

        setTouchStart(null);
    };

    return (
        <div
            className={`fixed inset-0 w-screen h-full bg-black overflow-hidden select-none font-sans z-50 ${isShaking ? 'animate-shake' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <audio ref={audioRef} src={spaceSound} loop />

            {/* Wallpaper & Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(30,20,60,0.15), rgba(30,20,60,0.15)), url(${spacemanJellyfish})`,
                        backgroundSize: "cover, 80%",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                />
                <Stars />
                {/* HeroBackground scaled and centered for mobile */}
                <div className="scale-[0.6] origin-top absolute top-[15%] left-0 right-0 z-0">
                    <HeroBackground className="flex items-center text-center w-full" />
                </div>
            </div>

            {/* Status Bar - High z-index to stay on top of windows */}
            <div className="absolute top-0 left-0 right-0 z-[300]">
                <MobileStatusBar onOpenControlPanel={() => setIsControlPanelOpen(true)} />
            </div>

            {/* Main Home Screen Content */}
            <div className="flex inset-0 top-12 bottom-[100px] z-10 w-full">
                {/* Top Section: Date */}


                {/* Bottom Section: Search & Apps */}
                <div className="absolute bottom-25 left-0 w-full flex flex-col gap-6">
                    <MobileDateWidget />
                    <MobileSearchBar />
                    <MobileHomeApps />
                    <MobileDockApps />
                </div>
            </div>

            {/* Active Apps (Full Screen Modals) */}
            <AnimatePresence>
                {sortedWindows.map(window => (
                    <motion.div
                        key={window.id}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        // Adjust bottom to show nav bar safely above device controls
                        className="absolute inset-x-0 bottom-12 top-6 z-20 bg-[#1e1e1e] shadow-2xl overflow-hidden rounded-b-2xl"
                        style={{ zIndex: 20 + window.zIndex }}
                    >
                        {window.component}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Task Switcher Overlay */}
            {isTaskSwitcherOpen && (
                <TaskSwitcher onClose={() => setIsTaskSwitcherOpen(false)} />
            )}

            {/* Control Panel Overlay - Higher than status bar */}
            <AnimatePresence>
                {isControlPanelOpen && (
                    <div className="absolute inset-0 z-[400] pointer-events-none">
                        <div className="pointer-events-auto h-full">
                            <ControlPanel onClose={() => setIsControlPanelOpen(false)} />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Control (Back, Home, Recents) */}
            <div className="absolute bottom-0 left-0 right-0 z-[200]">
                <MobileDock
                    onRecentsClick={handleRecents}
                    onHomeClick={handleHome}
                    onBackClick={handleBack}
                />
            </div>
        </div>
    );
};
