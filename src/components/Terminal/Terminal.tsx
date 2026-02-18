import { useRef, useEffect, useCallback } from 'react';
import { useTerminal } from '../../hooks/useTerminal';

import { useI18n } from '../../hooks/useI18nHook';
import { useWindowManager } from '../../context/WindowContext';
import { AboutContent } from '../Content/AboutContent';
import { SkillsContent } from '../Content/SkillsContent';
import { ProjectsContent } from '../Content/ProjectsContent';
import { SublimeEditor } from '../Content/SublimeEditor';
import sublimeIcon from '../../img/svg/sublime.svg';
import spacemanFace from '../../img/spacemanJellyfishFace.png';
import { Typewriter } from './Typewriter';

export const Terminal = () => {
    const { windows, openWindow, closeWindow, toggleWindow, updateWindow } = useWindowManager();
    const { terminalT } = useI18n();

    const windowCommands: Record<string, { id: string, component: React.ReactNode, title: string, icon: string }> = {
        'about': { id: 'about', title: terminalT('window_title.about'), icon: '👤', component: <AboutContent /> },
        'skills': { id: 'skills', title: terminalT('window_title.skills'), icon: '🛠️', component: <SkillsContent /> },
        'projects': { id: 'projects', title: terminalT('window_title.projects'), icon: '🚀', component: <ProjectsContent /> }
    };

    const { history, input, setInput, handleCommand, isShaking, navigateHistory } = useTerminal({
        onProjectCat: () => {
            const win = windowCommands['projects'];
            openWindow(win.id, win.title, win.component, 0, win.icon);
        },
        onOpenWindow: (id) => {
            if (windowCommands[id]) {
                const win = windowCommands[id];
                openWindow(win.id, win.title, win.component, 0, win.icon);
            }
        },
        onViewReadme: () => {
            // Open a custom window for Readme
            // We'll treat it like a unique file opening
            // Use 'editor-readme' to match Dock's dynamic filter and FileExplorer
            openWindow('editor-readme', 'readme.md - Sublime Text', <div className="w-full h-full"><SublimeEditor fileId="readme_v2" fileName="readme.md" initialContent={terminalT('readme_content')} /></div>, 0, sublimeIcon);
        },
        onViewText: () => {
            // Open text.txt window
            openWindow('editor-text', 'Text.txt - Sublime Text', <div className="w-full h-full"><SublimeEditor fileId="text" fileName="Text.txt" initialContent={terminalT('text_txt_content')} /></div>, 0, sublimeIcon);
        }
    });

    const outputEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    const baseWidthRef = useRef<number | null>(null);
    const isExpandedRef = useRef(false);

    // Auto-scroll to bottom whenever content changes (MutationObserver to catch typing effect)
    useEffect(() => {
        const body = terminalBodyRef.current;
        if (!body) return;

        const observer = new MutationObserver(() => {
            body.scrollTop = body.scrollHeight;
        });

        observer.observe(body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => observer.disconnect();
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
    }, [input]);

    // Focus input on click
    const handleBodyClick = () => {
        inputRef.current?.focus();
    };

    // Listen for external commands (e.g., from Skills dashboard)
    useEffect(() => {
        const handleTerminalCommand = (e: any) => {
            if (e.detail && e.detail.command) {
                handleCommand(e.detail.command);
            }
        };

        window.addEventListener('terminal-command', handleTerminalCommand);
        return () => window.removeEventListener('terminal-command', handleTerminalCommand);
    }, [handleCommand]);

    // Dynamic width expansion when command is sent (Enter)
    const expandTerminal = useCallback(() => {
        const terminalWin = windows.find(w => w.id === 'terminal');
        if (!terminalWin || terminalWin.isMaximized) return;

        const screenWidth = window.innerWidth;
        const targetWidth = screenWidth * 0.5;

        if (!isExpandedRef.current) {
            const currentWidth = terminalWin.width || (screenWidth * 0.75);
            const currentX = terminalWin.x || 0;
            const rightEdge = currentX + currentWidth;

            baseWidthRef.current = currentWidth;
            const newX = rightEdge - targetWidth;

            updateWindow('terminal', {
                width: targetWidth,
                x: Math.max(0, newX)
            });
            isExpandedRef.current = true;
        }
    }, [windows, updateWindow]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            expandTerminal();
            const cmd = input.trim().toLowerCase();
            const [action, target] = cmd.split(' ');

            if (action === 'open' && windowCommands[target]) {
                const win = windowCommands[target];
                openWindow(win.id, win.title, win.component, 0, win.icon);
                handleCommand(input, [`${terminalT('feedback.opening')} ${win.title}...`]);
            } else if (action === 'close' && windowCommands[target]) {
                const win = windowCommands[target];
                closeWindow(win.id);
                handleCommand(input, [`${terminalT('feedback.closing')} ${win.title}...`]);
            } else if (action === 'toggle' && windowCommands[target]) {
                const win = windowCommands[target];
                toggleWindow(win.id, 0);
                handleCommand(input, [`${terminalT('feedback.toggling')} ${win.title}...`]);
            } else if (action === 'list') {
                const openApps = windows.filter(w => w.isOpen).map(w => w.id).join(', ');
                handleCommand(input, [`${terminalT('feedback.list')} ${openApps || 'None'}`]);
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
                    ref={terminalBodyRef}
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

                    <div className="px-[16px] pt-[8px] text-[0.68rem] text-[#d8dee9]">
                        {history.map((line: any, idx: number) => (
                            <div key={idx} className="my-[2px] leading-[1.5] break-words">
                                {line.type === 'command' ? (
                                    <div className="break-words relative">
                                        <div className="opacity-85 absolute left-0 top-0 pointer-events-none whitespace-nowrap">
                                            <span className="text-[#a3be8c] font-bold">{line.user}</span>@<span className="text-[#81a1c1] font-bold">{line.host}</span>:~$
                                        </div>
                                        <div className="text-[#e5e9f0]" style={{ textIndent: '17.5ch' }}>{line.content}</div>
                                    </div>
                                ) : (
                                    <div className="text-[#88c0d0] break-words whitespace-pre-wrap">
                                        {typeof line.content === 'string' ? (
                                            <Typewriter text={line.content} delay={10} />
                                        ) : (
                                            line.content
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={outputEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-[16px] pb-[12px] pt-[4px] text-[0.68rem] leading-[1.6] relative">
                        <div className="pointer-events-none opacity-85 absolute left-[16px] top-[4px] z-10 whitespace-nowrap">
                            <span className="text-[#a3be8c] font-bold">visitor</span>@<span className="text-[#81a1c1] font-bold">maycon</span>:~$
                        </div>
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="bg-transparent border-none outline-none text-[#e5e9f0] font-mono text-[0.68rem] w-full p-0 resize-none overflow-hidden update-caret leading-[1.6] align-top block"
                            style={{ textIndent: '17.5ch' }}
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
