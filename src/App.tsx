import { useState } from 'react'
import { useI18n } from './hooks/useI18nHook'
import { TopBar } from './components/TopBar/TopBar'
import { Desktop } from './components/Desktop'
import { Dock } from './components/Dock/Dock'
import { SystemProvider } from './context/SystemContext'
import { MobileOS } from './components/Mobile/MobileOS'
import { useDeviceType } from './hooks/useDeviceType'
import { HeroBackground } from './components/Layout/HeroBackground'
import { Stars } from './components/Layout/Stars'
import { AppInitializer } from './components/AppInitializer'
import bgImage from './img/spacemanJellyfish.jpg'

import { WindowProvider } from './context/WindowContext'
import { HackerProvider, useHacker } from './context/HackerContext'
import { HackerOverlay } from './components/Hacker/HackerOverlay'

const AppContent = () => {
    const { phase } = useHacker();
    const [currentWorkspace, setCurrentWorkspace] = useState(0);
    const { isMobile } = useDeviceType();

    const handleNavigate = (index: number) => {
        setCurrentWorkspace(index);
    };

    return (
        <WindowProvider>
            <SystemProvider>
                <AppInitializer />
                <HackerOverlay />

                {isMobile ? (
                    <MobileOS />
                ) : (
                    <div className={`font-sans text-white h-screen overflow-hidden relative selection:bg-[#9664ff4d] bg-black ${phase === 'glitch' ? 'animate-shake' : ''}`}>

                        {/* Background for Desktop is now managed here or inside DesktopEnvironment if we refactored, but sticking to existing structure inside App.tsx for Desktop for now to avoid large refactors */}
                        <div className="fixed inset-0 z-0 pointer-events-none">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(30,20,60,0.15), rgba(30,20,60,0.15)), url(${bgImage})`,
                                    backgroundSize: "cover, 80%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat"
                                }}
                            />
                            <Stars />
                            <HeroBackground />
                        </div>

                        {/* Conteúdo Desktop */}
                        <div className={`relative z-10 h-full ${phase === 'glitch' ? 'translate-x-2 -translate-y-1' : ''}`}>

                            <TopBar
                                onNavigate={handleNavigate}
                                currentWorkspace={currentWorkspace}
                            />

                            <div
                                id="brightness-overlay"
                                className="fixed top-0 left-0 w-screen h-screen bg-black pointer-events-none z-[9999] opacity-0 transition-opacity duration-100 ease-linear"
                            />

                            <Desktop
                                currentWorkspace={currentWorkspace}
                                onWorkspaceChange={setCurrentWorkspace}
                            />

                            <Dock
                                currentWorkspace={currentWorkspace}
                                onNavigate={setCurrentWorkspace}
                            />
                        </div>
                    </div>
                )}
            </SystemProvider>
        </WindowProvider>
    )
}

function App() {
    useI18n();
    return (
        <HackerProvider>
            <AppContent />
        </HackerProvider>
    );
}

export default App;
