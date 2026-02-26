import { useState, useEffect, useRef } from 'react';
import { useHacker } from '../../context/HackerContext';
import hackerAudio from '../../img/videoAudioHacker.mp3';

export const HackerOverlay = () => {
    const { phase, clearRestored } = useHacker();
    const [imageIndex, setImageIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Number of images in hackerConnectedImages folder
    // The user mentioned there is a sequence of images there.
    const totalImages = 80; // from the previous list_dir, we saw it has 80 files

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (phase === 'connecting') {
            if (audioRef.current) {
                audioRef.current.volume = 0.35;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }
            // Rapidly cycle through images (e.g. 50ms per frame)
            interval = setInterval(() => {
                setImageIndex(prev => (prev + 1) % totalImages);
            }, 50);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

        return () => clearInterval(interval);
    }, [phase]);

    if (phase === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden">
            <audio ref={audioRef} src={hackerAudio} />
            {/* Connecting Phase: Image Sequence */}
            {phase === 'connecting' && (
                <div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                    style={{ transition: 'opacity 0.2s' }}
                >
                    <img
                        src={`/img/hackerConnectedImages/hackerConnectedVideo_${imageIndex.toString().padStart(3, '0')}.jpg`}
                        alt="connecting..."
                        className="w-full h-full object-cover mix-blend-screen opacity-90 filter contrast-150"
                    />
                </div>
            )}

            {/* Connected Phase: CRT TEXT */}
            {phase === 'connected' && (
                <div className="absolute inset-0 bg-red-900/20 pointer-events-none mix-blend-color-burn">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h1 className="text-red-500 font-mono text-6xl md:text-9xl font-bold uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse" style={{ fontFamily: '"Courier New", Courier, monospace', textShadow: '2px 0 0 red, -2px 0 0 blue' }}>
                            CONNECTED!
                        </h1>
                    </div>
                </div>
            )}

            {/* Rebooting Phase: BIOS Boot */}
            {phase === 'rebooting' && (
                <div className="absolute inset-0 bg-black text-[#00ff00] font-mono p-4 sm:p-8 text-sm sm:text-lg z-[999999] pointer-events-auto flex flex-col items-start justify-start">
                    <style>{`
                        @keyframes bios1 { 0% { opacity: 0; } 10% { opacity: 1; } 100% { opacity: 1; } }
                        @keyframes bios2 { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 1; } }
                        @keyframes bios3 { 0% { opacity: 0; } 60% { opacity: 1; } 100% { opacity: 1; } }
                        @keyframes bios4 { 0% { opacity: 0; } 90% { opacity: 1; } 100% { opacity: 1; } }
                        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                    `}</style>
                    <div className="whitespace-pre-line tracking-wide w-full max-w-2xl">
                        <span style={{ animation: 'bios1 5s forwards', opacity: 0 }}>Initializing Maycon-OS Kernel...</span><br />
                        <span style={{ animation: 'bios2 5s forwards', opacity: 0 }}>Loading Spring Boot Context... <span className="text-white">OK.</span></span><br />
                        <span style={{ animation: 'bios3 5s forwards', opacity: 0 }}>Restoring Astronaut_Wallpaper.sh... <span className="text-white">OK.</span></span><br /><br />
                        <span style={{ animation: 'bios4 5s forwards', opacity: 0 }}>Rebooting system... <span style={{ animation: 'blink 1s infinite' }}>_</span></span>
                    </div>
                </div>
            )}

            {/* Restored Phase: Notification */}
            {phase === 'restored' && (
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-[#00ff00] text-[#00ff00] px-6 py-4 rounded font-mono shadow-[0_0_15px_rgba(0,255,0,0.2)] z-[999999] flex flex-col items-center gap-2" onClick={clearRestored}>
                    <span className="font-bold">System Restored.</span>
                    <span>Anomaly Cleared.</span>
                </div>
            )}
        </div>
    );
};
