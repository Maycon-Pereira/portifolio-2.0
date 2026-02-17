import { useRef, useEffect } from 'react';
import { useTerminal } from '../../hooks/useTerminal';

import { useI18n } from '../../hooks/useI18nHook';
import { useWindowManager } from '../../context/WindowContext';
import { AboutContent } from '../Content/AboutContent';
import { SkillsContent } from '../Content/SkillsContent';
import { ProjectsContent } from '../Content/ProjectsContent';
import spacemanFace from '../../img/spacemanJellyfishFace.png';

export const Terminal = () => {
    const { history, input, setInput, handleCommand, isShaking, navigateHistory } = useTerminal();
    const { terminalT } = useI18n();
    const outputEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { windows, openWindow, closeWindow, toggleWindow } = useWindowManager();

    // Auto-scroll to bottom
    useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click
    const handleBodyClick = () => {
        inputRef.current?.focus();
    };

    const windowCommands: Record<string, { id: string, component: React.ReactNode, title: string, icon: string }> = {
        'about': { id: 'about', title: 'About Me', icon: '👤', component: <AboutContent /> },
        'skills': { id: 'skills', title: 'Technical Skills', icon: '🛠️', component: <SkillsContent /> },
        'projects': { id: 'projects', title: 'Projects', icon: '🚀', component: <ProjectsContent /> }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const [action, target] = cmd.split(' ');

            if (action === 'open' && windowCommands[target]) {
                const win = windowCommands[target];
                openWindow(win.id, win.title, win.component, 0, win.icon);
                handleCommand(input, [`Opening ${win.title}...`]);
            } else if (action === 'close' && windowCommands[target]) {
                const win = windowCommands[target];
                closeWindow(win.id);
                handleCommand(input, [`Closing ${win.title}...`]);
            } else if (action === 'toggle' && windowCommands[target]) {
                const win = windowCommands[target];
                toggleWindow(win.id, 0);
                handleCommand(input, [`Toggling ${win.title}...`]);
            } else if (action === 'list') {
                const openApps = windows.filter(w => w.isOpen).map(w => w.id).join(', ');
                handleCommand(input, [`Open windows: ${openApps || 'None'}`]);
            } else {
                handleCommand(input);
            }
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateHistory('down');
        }
    };

    const terminalWindow = windows.find(w => w.id === 'terminal');
    const isMaximized = terminalWindow?.isMaximized;

    return (
        <div className="w-full h-full bg-[#0f0c1ed9] font-mono flex flex-col overflow-hidden relative">
            <div className={`w-full h-full flex flex-col ${isShaking ? 'animate-shake' : ''}`}>
                {/* Terminal Body */}
                <div
                    className="p-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-[#9664ff4d] scrollbar-track-transparent relative workspace-scrollable"
                    onClick={handleBodyClick}
                >
                    {/* CRT Overlay */}
                    <div className="absolute inset-0 z-20 crt-overlay opacity-50 pointer-events-none mix-blend-overlay"></div>

                    {/* Image and Info - Hidden when maximized */}
                    {!isMaximized && (
                        <>
                            {/* Image */}
                            <div className="w-full overflow-hidden border-b border-[#9664ff26] bg-[#0f0c1e]">
                                <img src={spacemanFace} alt="Spaceman" className="w-full h-auto block object-cover max-h-[200px] animate-glitch transition-all duration-300" />
                            </div>

                            {/* Info */}
                            <div className="p-[14px_16px] border-b border-[#9664ff1a]">
                                <div className="flex items-center gap-3 py-[2px] text-[0.68rem] leading-[1.6]">
                                    <span className="text-[#b48ead] min-w-[110px] font-semibold whitespace-nowrap">{terminalT('user_label')}</span>
                                    <span className="text-[#d8dee9] opacity-90">visitor</span>
                                </div>
                                <div className="flex items-center gap-3 py-[2px] text-[0.68rem] leading-[1.6]">
                                    <span className="text-[#b48ead] min-w-[110px] font-semibold whitespace-nowrap">{terminalT('hostname_label')}</span>
                                    <span className="text-[#d8dee9] opacity-90">Maycon</span>
                                </div>
                                <div className="flex items-center gap-3 py-[2px] text-[0.68rem] leading-[1.6]">
                                    <span className="text-[#b48ead] min-w-[110px] font-semibold whitespace-nowrap">{terminalT('shell_label')}</span>
                                    <span className="text-[#d8dee9] opacity-90">portifolio-sh</span>
                                </div>
                                <div className="flex items-center gap-3 py-[2px] text-[0.68rem] leading-[1.6]">
                                    <span className="text-[#b48ead] min-w-[110px] font-semibold whitespace-nowrap">{terminalT('theme_label')}</span>
                                    <span className="text-[#d8dee9] opacity-90">{terminalT('theme_value')}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Output */}
                    <div className="px-[16px] pt-[8px] text-[0.68rem] text-[#d8dee9]">
                        {history.map((line, idx) => (
                            <div key={idx} className="my-[2px] leading-[1.5] break-words">
                                {line.type === 'command' ? (
                                    <span>
                                        <span className="text-[#a3be8c] font-bold">{line.user}</span>@<span className="text-[#81a1c1] font-bold">{line.host}</span>:~$ <span className="text-[#e5e9f0]">{line.content}</span>
                                    </span>
                                ) : (
                                    <span className="text-[#88c0d0] pl-[4px]">{line.content}</span>
                                )}
                            </div>
                        ))}
                        <div ref={outputEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center px-[16px] pb-[12px] pt-[8px] text-[0.68rem]">
                        <span className="whitespace-nowrap shrink-0 text-[#d8dee9]">
                            <span className="text-[#a3be8c] font-bold">visitor</span>@<span className="text-[#81a1c1] font-bold">maycon</span>:~$
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="bg-transparent border-none outline-none text-[#e5e9f0] font-mono text-[0.68rem] flex-1 p-0 ml-[4px] update-caret"
                            autoComplete="off"
                            spellCheck={false}
                            autoFocus
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};
