import { Terminal, Mail } from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';
import { MobileTerminal } from './Apps/MobileTerminal';
import { MobileProjects } from './Apps/MobileProjects';
import { MobileSkills } from './Apps/MobileSkills';
import { MobileAbout } from './Apps/MobileAbout';

// Import App Icons
import archivesIcon from './img/archives.svg';
import notesIcon from './img/notes.svg';
import settingsIcon from './img/settingsmobile.svg';
import githubIcon from './img/githubmobile.svg';
import linkedinIcon from './img/linkedinmobile.svg';

// Define App Type
interface MobileApp {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    component?: React.ReactNode;
    externalUrl?: string;
}

// All Apps Definition
const useMobileApps = () => {
    const { openWindow, windows, focusWindow } = useWindowManager();

    const homeApps: MobileApp[] = [
        {
            id: 'projects',
            label: 'Projetos',
            icon: <img src={archivesIcon} alt="Projects" className="w-full h-full" />,
            color: 'bg-[#4285F4]',
            component: <MobileProjects />
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: <img src={notesIcon} alt="Skills" className="w-full h-full" />,
            color: 'bg-[#EA4335]',
            component: <MobileSkills />
        },
        {
            id: 'about',
            label: 'Sobre',
            icon: <img src={settingsIcon} alt="Settings" className="w-full h-full" />,
            color: 'bg-[#7f8c8d]',
            component: <MobileAbout />
        },
    ];

    const dockApps: MobileApp[] = [
        // Phone/Contact (mapped to About or specific contact modal potentially)
        { id: 'contact', label: 'Contato', icon: <Mail size={24} />, color: 'bg-[#3DDC84]', component: <MobileAbout /> },

        // Messages (mapped to Terminal for "chat" feel or just terminal)
        { id: 'terminal', label: 'Terminal', icon: <Terminal size={24} />, color: 'bg-[#333]', component: <MobileTerminal /> },

        // Browser -> GitHub
        {
            id: 'github',
            label: 'GitHub',
            icon: <img src={githubIcon} alt="GitHub" className="w-full h-full" />,
            color: 'bg-white',
            externalUrl: 'https://github.com/Maycon-Pereira'
        },

        // Camera -> LinkedIn
        {
            id: 'linkedin',
            label: 'LinkedIn',
            icon: <img src={linkedinIcon} alt="LinkedIn" className="w-full h-full" />,
            color: 'bg-white',
            externalUrl: 'https://www.linkedin.com/in/maycon-ps/'
        }
    ];

    const handleAppClick = (app: MobileApp) => {
        if (app.externalUrl) {
            window.open(app.externalUrl, '_blank');
            return;
        }

        if (app.component) {
            const existing = windows.find(w => w.id === app.id);
            if (existing) {
                focusWindow(app.id);
            } else {
                openWindow(app.id, app.label, app.component, 0, undefined);
            }
        }
    };

    return { homeApps, dockApps, handleAppClick };
};

export const MobileHomeApps = () => {
    const { homeApps, handleAppClick } = useMobileApps();
    return (
        <div className="grid grid-cols-4 gap-y-6 gap-x-4 px-2">
            {homeApps.map(app => (
                <div
                    key={app.id}
                    className="flex flex-col items-center gap-1"
                    onClick={() => handleAppClick(app)}
                >
                    <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform ${app.color}`}>
                        {app.icon}
                    </div>
                    <span className="text-[11px] text-white font-normal drop-shadow-md tracking-tight">{app.label}</span>
                </div>
            ))}
        </div>
    );
};

export const MobileDockApps = () => {
    const { dockApps, handleAppClick } = useMobileApps();
    return (
        <div className="flex justify-around items-center w-full px-2">
            {dockApps.map(app => (
                <div
                    key={app.id}
                    className="flex flex-col items-center justify-center w-14 h-14 active:scale-90 transition-transform"
                    onClick={() => handleAppClick(app)}
                >
                    <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform ${app.color}`}>
                        {app.icon}
                    </div>
                    {/* No labels in dock usually */}
                </div>
            ))}
        </div>
    );
};
