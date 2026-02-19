
import React from 'react';
import { Wifi, BatteryFull } from 'lucide-react';

interface MobileStatusBarProps {
    onOpenControlPanel: () => void;
}

export const MobileStatusBar = ({ onOpenControlPanel }: MobileStatusBarProps) => {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="h-8 w-full flex justify-between items-center px-4 text-white text-sm font-medium pt-2"
            onClick={onOpenControlPanel}
        >
            {/* Time (Left) */}
            <span className="font-semibold tracking-wide text-xs">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {/* Icons (Right) */}
            <div className="flex items-center gap-2 opacity-90">
                <span className="text-xs">Bluetooth</span> {/* Mock */}
                <Wifi size={16} />
                <BatteryFull size={16} />
            </div>
        </div>
    );
};
