import { Clock } from './Clock';
import { SystemTray } from './SystemTray';

type TopBarProps = {
    onNavigate: (index: number) => void;
    currentWorkspace: number;
};

export const TopBar = ({ onNavigate, currentWorkspace }: TopBarProps) => {

    void onNavigate;
    void currentWorkspace;

    return (
        <header className="fixed top-0 left-0 w-full h-8 z-[1000] flex justify-between items-center px-[15px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] text-[#d0d0ff] text-sm bg-[#141428cc] border-b border-[#9664ff4d] backdrop-blur-md transition-all duration-300">
            <div className="flex items-center gap-[15px]">
                <Clock />
            </div>

            <div className="flex items-center gap-[15px]">
                <SystemTray />
            </div>
        </header>
    );
};
