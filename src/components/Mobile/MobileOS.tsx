import { useState } from 'react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileDock } from './MobileDock';
import { MobileHomeApps, MobileDockApps } from './AppGrid';
import { ControlPanel } from './ControlPanel';
import { TaskSwitcher } from './TaskSwitcher';
import { useWindowManager } from '../../context/WindowContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileDateWidget } from './MobileDateWidget';
import { MobileSearchBar } from './MobileSearchBar';
import { Stars } from '../Layout/Stars';
import { HeroBackground } from '../Layout/HeroBackground';

// Import background image
import spacemanJellyfish from '../../img/spacemanJellyfish.jpg';

export const MobileOS = () => {
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
    const [isTaskSwitcherOpen, setIsTaskSwitcherOpen] = useState(false);
    const { windows } = useWindowManager();

    // Filter active windows (not minimized)
    const activeWindows = windows.filter(w => w.isOpen && !w.isMinimized);

    // Sort by z-index to ensure correct layering
    const sortedWindows = [...activeWindows].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none font-sans z-50">
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

            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-[200]">
                <MobileStatusBar onOpenControlPanel={() => setIsControlPanelOpen(true)} />
            </div>

            {/* Main Home Screen Content */}
            <div className="absolute inset-0 top-8 bottom-[80px] z-10 flex flex-col justify-end pb-4">
                {/* Date Widget at top of remaining space or pushed up? User said "abaixe a barra de busca e os apps". 
                    If we use justify-end inside this flex container, everything goes to bottom.
                    Let's use a spacer or margin. 
                */}

                <div className="mt-auto mb-8">
                    <MobileDateWidget />
                    <MobileSearchBar />

                    <div className="mt-6 mb-2">
                        <MobileHomeApps />
                    </div>
                </div>

                {/* Dock Area (Apps + Nav) */}
                <div className="w-full pb-2 flex flex-col gap-4">
                    {/* Dock Apps Row */}
                    <MobileDockApps />
                </div>
            </div>

            {/* Active Apps (Full Screen Modals) */}
            <AnimatePresence>
                {!isTaskSwitcherOpen && sortedWindows.map(window => (
                    <motion.div
                        key={window.id}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        // Adjust bottom to show nav bar
                        className="absolute inset-x-0 bottom-12 top-8 z-20 bg-[#1e1e1e] shadow-2xl overflow-hidden rounded-b-2xl"
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

            {/* Control Panel Overlay */}
            {isControlPanelOpen && (
                <ControlPanel onClose={() => setIsControlPanelOpen(false)} />
            )}

            {/* Bottom Navigation Control (Back, Home, Recents) */}
            <div className="absolute bottom-0 left-0 right-0 z-[200]">
                <MobileDock onRecentsClick={() => setIsTaskSwitcherOpen(!isTaskSwitcherOpen)} />
            </div>
        </div>
    );
};
