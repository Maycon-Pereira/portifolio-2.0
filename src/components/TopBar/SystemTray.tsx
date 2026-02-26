import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../hooks/useI18nHook';
import spaceSound from '../../assets/spacesound.ogg';
import { useHacker } from '../../context/HackerContext';
import { Skull } from 'lucide-react';

// Import SVGs (assuming Vite handles SVGs as URLs by default, or we use standard img tags)
import wifiIcon from '../../img/svg/popover/wifi.svg';
import soundIcon from '../../img/svg/soundSVG.svg';
import muteIcon from '../../img/svg/MuteSound.svg';
import mediumSoundIcon from '../../img/svg/MediumSound.svg';
import batteryIcon from '../../img/svg/popover/battery.svg';
import headsetIcon from '../../img/svg/popover/headsetSVG.svg';
import monitorIcon from '../../img/svg/popover/monitor.svg';
import settingsIcon from '../../img/svg/popover/settingsSVG.svg';
import powerOffIcon from '../../img/svg/popover/poweroff.svg';

export const SystemTray = () => {
    const { t, currentLang, setCurrentLang } = useI18n();
    const { phase } = useHacker();
    const [volume, setVolume] = useState(0); // Start muted
    const [brightness, setBrightness] = useState(100);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const trayRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Derived states
    const currentSoundIcon = volume > 50 ? soundIcon : (volume > 0 ? mediumSoundIcon : muteIcon);

    // Update volume and mute state when slider changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume / 100;
            if (volume > 0) {
                audio.muted = false;
                if (audio.paused) {
                    audio.play().catch(e => console.error("Play on volume change failed", e));
                }
            } else {
                audio.muted = true;
            }
        }
    }, [volume]);

    // Effects
    useEffect(() => {
        // Brightness effect (overlay)
        const overlay = document.getElementById('brightness-overlay');
        if (overlay) {
            const opacity = 0.5 * (1 - (brightness / 100));
            overlay.style.opacity = opacity.toString();
        }
    }, [brightness]);

    // Audio Initialization
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Attempt to play immediately (muted)
        const attemptPlay = () => {
            audio.play().catch((error) => {
                console.log("Muted autoplay failed (unlikely)", error);
            });
        };
        attemptPlay();
    }, []);

    // Calculate position when hovered or settings open
    // useLayoutEffect ensures position is calculated before paint, preventing flash
    React.useLayoutEffect(() => {
        if (isHovered && trayRef.current) {
            const rect = trayRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.bottom + 5, // spacing
                left: rect.right - 180 // Align right edge (180 is approximate width of popover)
            });
        }
    }, [isHovered]);

    // Handlers
    const handlePowerOff = () => {
        window.open('https://www.linkedin.com/in/maycon-ps/', '_blank');
    };

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            setSettingsOpen(false); // Also collapse settings when closing
        }, 300); // 300ms delay to allow moving to popover
    };

    return (
        <div
            ref={trayRef}
            className="relative flex items-center gap-4 py-2" // Added py-2 to give hit area
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <audio ref={audioRef} src={spaceSound} loop autoPlay muted hidden />

            {/* Icons Row */}
            <div className={`flex gap-2.5 items-center cursor-pointer transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
                {phase === 'connected' || phase === 'hacker_ide' || phase === 'rebooting' || phase === 'glitch' ? (
                    <>
                        <span className="text-[10px] text-red-500 font-bold animate-pulse">UNSECURED</span>
                        <Skull size={14} className="text-red-500" />
                    </>
                ) : (
                    <>
                        <img src={wifiIcon} className="w-3.5 h-3.5 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Wifi" />
                        <img src={currentSoundIcon} className="w-3.5 h-3.5 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Sound" />
                        <img src={batteryIcon} className="w-3.5 h-3.5 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Battery" />
                    </>
                )}
            </div>

            {/* Popover via Portal */}
            {isHovered && createPortal(
                <div
                    className="fixed w-[180px] bg-[#141428cb] border border-[#9664ff4d] rounded-[10px] p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-[9999] text-[#e0e0e0] text-xs font-sans transition-all duration-200 ease-in-out"
                    style={{
                        top: popoverPosition.top,
                        left: popoverPosition.left,
                        opacity: 1, // Controlled by conditional rendering for now, could animate
                        visibility: 'visible',
                        transform: 'translateY(0)'
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex flex-col gap-2.5 mb-2.5">
                        {/* Volume Slider */}
                        <div className="flex items-center gap-2.5 px-2">
                            <img src={headsetIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Headset" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(parseInt(e.target.value))}
                                className="w-full h-[3px] bg-[#444] rounded-[2px] appearance-none cursor-pointer accent-[#64ffda]"
                            />
                        </div>
                        {/* Brightness Slider */}
                        <div className="flex items-center gap-2.5 px-2">
                            <img src={monitorIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Brightness" />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={brightness}
                                onChange={(e) => setBrightness(parseInt(e.target.value))}
                                className="w-full h-[3px] bg-[#444] rounded-[2px] appearance-none cursor-pointer accent-[#64ffda]"
                            />
                        </div>
                    </div>

                    <hr className="border-0 h-[1px] bg-[#333] my-2" />

                    <div className="flex flex-col">
                        <div className="flex justify-between items-center p-1.5 rounded hover:bg-white/10 cursor-pointer text-[#ccc] hover:text-white transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={wifiIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Wifi" />
                                <span>{t('menu.viros')}</span>
                            </div>
                            <span className="text-base text-[#666]">›</span>
                        </div>

                        <div className="flex justify-between items-center p-1.5 rounded hover:bg-white/10 cursor-pointer text-[#ccc] hover:text-white transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={batteryIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Battery" />
                                <span className="font-medium animate-slow-pulse">{t('status.online')}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-0 h-[1px] bg-[#333] my-2" />

                    <div className="flex flex-col">
                        {/* Settings Trigger */}
                        <div onClick={() => setSettingsOpen(!settingsOpen)}>
                            <div className="flex justify-between items-center p-1.5 rounded hover:bg-white/10 cursor-pointer text-[#ccc] hover:text-white transition-colors">
                                <div className="flex items-center gap-2">
                                    <img src={settingsIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Settings" />
                                    <span>{t('menu.settings')}</span>
                                </div>
                                <span className={`text-base text-[#666] transition-transform duration-200 ${settingsOpen ? 'rotate-90' : ''}`}>›</span>
                            </div>
                        </div>

                        {/* Submenu */}
                        <div className={`overflow-hidden transition-all duration-300 ease-out pl-0 ${settingsOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {['en', 'pt', 'es'].map((lang) => (
                                <div
                                    key={lang}
                                    onClick={() => setCurrentLang(lang)}
                                    className={`flex items-center p-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors ${currentLang === lang ? 'text-[#00FFE5]' : 'text-[#ccc]'}`}
                                >
                                    <span className="capitalize">{lang === 'en' ? 'English' : lang === 'pt' ? 'Português' : 'Español'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Power Off */}
                        <div onClick={handlePowerOff} className="flex justify-between items-center p-1.5 rounded hover:bg-white/10 cursor-pointer text-[#ccc] hover:text-white transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={powerOffIcon} className="w-4 h-4 filter invert-[82%] sepia-[12%] saturate-[1478%] hue-rotate-[203deg] brightness-[101%] contrast-[106%]" alt="Power Off" />
                                <span>{t('menu.poweroff')}</span>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
