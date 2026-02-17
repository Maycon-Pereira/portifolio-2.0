import intellijIcon from '../../img/svg/intellij.svg';
import grafanaIcon from '../../img/svg/Grafana.svg';
import sublimeIcon from '../../img/svg/sublime.svg';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18nHook';
import { useWindowManager } from '../../context/WindowContext';
import { AboutContent } from '../Content/AboutContent';
import { SkillsContent } from '../Content/SkillsContent';
import { ProjectsContent } from '../Content/ProjectsContent';
import { Terminal } from '../Terminal/Terminal';

interface DockProps {
    currentWorkspace: number;
    onNavigate: (index: number) => void;
}

export const Dock = ({ currentWorkspace, onNavigate }: DockProps) => {
    const { t } = useI18n();
    const { windows, openWindow, toggleWindow, closeAllWindows } = useWindowManager();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const apps = [
        { id: 0, label: t('nav.home'), icon: '🏠', color: '#64ffda', windowId: null },
        {
            id: 1,
            label: t('nav.about'),
            icon: <img src={intellijIcon} alt="About" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />,
            color: '#ff5f57',
            windowId: 'about',
            component: <AboutContent windowId="about" />
        },
        { id: 2, label: t('nav.skills'), icon: <img src={grafanaIcon} alt="Skills" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />, color: '#febc2e', windowId: 'skills', component: <SkillsContent /> },
        { id: 3, label: t('nav.projects'), icon: '📂', color: '#28c840', windowId: 'projects', component: <ProjectsContent windowId="projects" /> },
        { id: 99, label: 'Terminal', icon: '💻', color: '#9664ff', windowId: 'terminal', component: <Terminal /> },
    ];

    // Dynamic apps: open editor windows that aren't in the fixed list
    const fixedWindowIds = new Set(apps.map(a => a.windowId).filter(Boolean));
    const dynamicApps = windows
        .filter(w => w.isOpen && !fixedWindowIds.has(w.id) && w.id.startsWith('editor-'))
        .map(w => ({
            id: 1000 + parseInt(w.id.replace(/\D/g, '') || '0'),
            label: w.title as string,
            icon: <img src={sublimeIcon} alt="Sublime" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />,
            color: '#e6db74',
            windowId: w.id,
            component: w.component,
            isDynamic: true
        }));

    const handleAppClick = (app: any, e: React.MouseEvent<HTMLDivElement>) => {
        // ... (rest of handler remains same, just need to avoid type errors with 'any' or proper type)
        // Since I'm focusing on the icon change, I'll keep the logic as is but need to be careful with the mapping below.
        if (app.id === 0) {
            closeAllWindows();
            onNavigate(0);
            return;
        }

        if (app.windowId && app.component) {
            const existing = windows.find(w => w.id === app.windowId);
            if (existing) {
                toggleWindow(app.windowId, currentWorkspace);
            } else {
                // Capture origin rect for animation
                const rect = e.currentTarget.getBoundingClientRect();
                const originRect = {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };

                let options: any = { originRect }; // Include originRect in default options

                if (app.windowId === 'terminal') {
                    const width = window.innerWidth * 0.25;
                    const height = window.innerHeight * 0.85;
                    const x = window.innerWidth * 0.75;
                    const y = (window.innerHeight - height) / 2;
                    options = { ...options, width, height, x, y };
                }

                // If app.icon is a ReactNode (image), we need to extract the src if possible, or pass the imported path if we have access.
                // But here app.icon for About is <img src={intellijIcon}...>.
                // I should pass intellijIcon directly if the app is 'about'.
                // Simplest way: Check the app ID or handle specific logic.

                const iconToPass = app.id === 1 ? intellijIcon : app.id === 2 ? grafanaIcon : (typeof app.icon === 'string' ? app.icon : undefined);

                openWindow(app.windowId, app.label, app.component, currentWorkspace, iconToPass, options);
            }
        }
    };

    return (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-[80] flex flex-col items-center gap-2 px-2 py-3 bg-[#14142899] backdrop-blur-[12px] border-y border-r border-[#9664ff33] rounded-r-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
            {apps.map((app, index) => {
                const isHovered = hoveredIndex === index;

                // Active if: 
                // 1. It's Home and we are on Workspace 0
                // 2. OR it's a Window and it is OPEN
                const isOpen = app.windowId ? windows.some(w => w.id === app.windowId && w.isOpen && !w.isMinimized) : (currentWorkspace === 0 && app.id === 0);

                return (
                    <div
                        key={index}
                        className="relative group flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ease-out"
                        style={{
                            transform: isHovered ? 'scale(1.1) translateX(5px)' : 'scale(1)',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={(e) => handleAppClick(app, e)}
                    >
                        {/* Tooltip (Right side) */}
                        <div
                            className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-0.5 bg-[#0f0c1e] text-[#d8dee9] text-[10px] rounded opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-[#9664ff33] z-[90] ${isHovered ? 'opacity-100 delay-100' : ''}`}
                        >
                            {app.label}
                        </div>

                        {/* Icon Container */}
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-[#ffffff10] border border-[#ffffff10] transition-colors duration-300 ${isOpen ? 'bg-[#ffffff20] border-[#9664ff66]' : 'hover:bg-[#ffffff25]'}`}
                        >
                            <span className="text-xl flex items-center justify-center filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                {app.icon}
                            </span>
                        </div>

                        {/* Active Indicator (Left side dot) */}
                        <div className={`absolute -left-2 w-1 h-1 rounded-full bg-[#9664ff] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                    </div>
                );
            })}

            {/* Social Links Separator */}
            <div className="w-6 h-[1px] bg-[#ffffff15] my-1" />

            {/* GitHub */}
            <div
                className="relative group flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ease-out"
                style={{
                    transform: hoveredIndex === 1000 ? 'scale(1.1) translateX(5px)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredIndex(1000)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => window.open('https://github.com/Maycon-Pereira', '_blank')}
            >
                <div
                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-0.5 bg-[#0f0c1e] text-[#d8dee9] text-[10px] rounded opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-[#9664ff33] z-[90] ${hoveredIndex === 1000 ? 'opacity-100 delay-100' : ''}`}
                >
                    GitHub
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ffffff10] border border-[#ffffff10] transition-colors duration-300 hover:bg-[#ffffff25]">
                    <i className="bi bi-github text-white text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"></i>
                </div>
            </div>

            {/* LinkedIn */}
            <div
                className="relative group flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ease-out"
                style={{
                    transform: hoveredIndex === 1001 ? 'scale(1.1) translateX(5px)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredIndex(1001)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => window.open('https://www.linkedin.com/in/maycon-ps/', '_blank')}
            >
                <div
                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-0.5 bg-[#0f0c1e] text-[#d8dee9] text-[10px] rounded opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-[#9664ff33] z-[90] ${hoveredIndex === 1001 ? 'opacity-100 delay-100' : ''}`}
                >
                    LinkedIn
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ffffff10] border border-[#ffffff10] transition-colors duration-300 hover:bg-[#ffffff25]">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-md">
                        <i className="bi bi-linkedin text-[#0A66C2] text-lg"></i>
                    </span>
                </div>
            </div>

            {/* Dynamic apps separator + icons */}
            {dynamicApps.length > 0 && (
                <>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="w-6 h-[1px] bg-[#ffffff15] my-1"
                    />
                    {dynamicApps.map((app, idx) => {
                        const dIndex = apps.length + idx;
                        const isHovered = hoveredIndex === dIndex;
                        const isOpen = windows.some(w => w.id === app.windowId && w.isOpen && !w.isMinimized);

                        return (
                            <motion.div
                                key={app.windowId}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 15,
                                    mass: 0.8,
                                }}
                                className="relative group flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ease-out"
                                style={{
                                    transform: isHovered ? 'scale(1.1) translateX(5px)' : 'scale(1)',
                                }}
                                onMouseEnter={() => setHoveredIndex(dIndex)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    if (app.windowId) {
                                        toggleWindow(app.windowId, currentWorkspace);
                                    }
                                }}
                            >
                                {/* Tooltip */}
                                <div
                                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-0.5 bg-[#0f0c1e] text-[#d8dee9] text-[10px] rounded opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-[#9664ff33] z-[90] ${isHovered ? 'opacity-100 delay-100' : ''}`}
                                >
                                    {app.label}
                                </div>

                                {/* Icon */}
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl bg-[#ffffff10] border border-[#ffffff10] transition-colors duration-300 ${isOpen ? 'bg-[#ffffff20] border-[#e6db7466]' : 'hover:bg-[#ffffff25]'}`}
                                >
                                    <span className="text-xl flex items-center justify-center filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                        {app.icon}
                                    </span>
                                </div>

                                {/* Active Indicator */}
                                <div className={`absolute -left-2 w-1 h-1 rounded-full bg-[#e6db74] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                            </motion.div>
                        );
                    })}
                </>
            )}
        </div>
    );
};
