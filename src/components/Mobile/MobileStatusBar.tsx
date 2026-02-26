
import React from 'react';
import { Wifi, BatteryFull, Skull } from 'lucide-react';
import { useHacker } from '../../context/HackerContext';

interface MobileStatusBarProps {
    onOpenControlPanel: () => void;
}

export const MobileStatusBar = ({ onOpenControlPanel }: MobileStatusBarProps) => {
    const [time, setTime] = React.useState(new Date());
    const { phase } = useHacker();

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isHacked = phase === 'connected' || phase === 'hacker_ide' || phase === 'rebooting' || phase === 'glitch';

    return (
        <div
            className={`h-8 w-full flex justify-between items-end px-5 pb-2 pt-4 text-sm font-medium cursor-pointer ${isHacked ? 'text-red-500 font-mono animate-pulse' : 'text-white'}`}
            onClick={onOpenControlPanel}
        >
            {/* Time (Left) */}
            <span className="font-semibold tracking-wide text-xs">
                {isHacked ? 'ERR:' + Math.floor(Math.random() * 99) : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {/* Icons (Right) */}
            <div className="flex items-center gap-2 opacity-90">
                {!isHacked && <span className="text-xs">Bluetooth</span>}
                {isHacked ? (
                    <>
                        <span className="text-xs text-red-500 font-bold animate-pulse">UNSECURED</span>
                        <Skull size={16} className="text-red-500" />
                    </>
                ) : (
                    <>
                        <Wifi size={16} />
                        <BatteryFull size={16} />
                    </>
                )}
            </div>
        </div>
    );
};
