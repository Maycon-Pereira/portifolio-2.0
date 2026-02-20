
import { useRef, useEffect } from 'react';
import { useTerminal } from '../../../hooks/useTerminal';
import { Send, Terminal as TerminalIcon, ArrowLeft } from 'lucide-react';
import { useWindowManager } from '../../../context/WindowContext';
import { MobileProjects } from './MobileProjects';
import { MobileSkills } from './MobileSkills';
import { MobileAbout } from './MobileAbout';
import { MobileIntelliJ } from './MobileIntelliJ';

export const MobileTerminal = () => {
    const { closeWindow, openWindow, focusWindow, windows } = useWindowManager();

    // Helper to open defined apps
    const openApp = (appId: string) => {
        const existing = windows.find(w => w.id === appId);
        if (existing) {
            focusWindow(appId);
            return;
        }

        let component: React.ReactNode = null;
        let label = '';

        switch (appId) {
            case 'projects':
                component = <MobileProjects />;
                label = 'Projetos';
                break;
            case 'skills':
                component = <MobileSkills />;
                label = 'Skills';
                break;
            case 'about':
                component = <MobileAbout />;
                label = 'Sobre'; // Notes
                break;
            case 'intellij':
                component = <MobileIntelliJ />;
                label = 'IntelliJ';
                break;
            default:
                return;
        }

        openWindow(appId, label, component, 0);
    };

    const { history, input, setInput, handleCommand } = useTerminal({
        onOpenWindow: (id) => openApp(id),
        onViewReadme: () => openApp('about'),
        onViewText: () => openApp('about'),
        onProjectCat: () => openApp('projects')
    });
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input);
            setInput('');
        }
    };

    const handleSuggestion = (cmd: string) => {
        setInput(cmd);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-sm">
            {/* Header */}
            <div className="flex items-center gap-3 p-3 bg-[#2d2d2d] border-b border-[#333]">
                <button
                    onClick={() => closeWindow('terminal')}
                    className="p-1 -ml-1 text-[#cccccc] hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <TerminalIcon size={16} className="text-green-500" />
                <span className="font-bold text-white">Terminal (mobile)</span>
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {history.map((line, index) => (
                    <div key={index} className="break-words">
                        {line.type === 'command' ? (
                            <div className="text-[#cccccc]">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400 mx-2">~</span>
                                {line.content}
                            </div>
                        ) : (
                            <div className="text-[#a0a0a0] whitespace-pre-wrap pl-4">
                                {line.content}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions Bar */}
            <div className="flex gap-2 overflow-x-auto p-2 bg-[#252526] border-t border-[#333] no-scrollbar">
                {['ls', 'help', 'about', 'clear', 'neofetch'].map(cmd => (
                    <button
                        key={cmd}
                        onClick={() => handleSuggestion(cmd)}
                        className="px-3 py-1 bg-[#333] rounded-full text-xs text-white hover:bg-[#444] whitespace-nowrap"
                    >
                        {cmd}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={onSubmit} className="p-3 bg-[#2d2d2d] flex gap-2">
                <span className="text-green-500 py-2">➜</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20"
                    placeholder="Type a command..."
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                />
                <button
                    type="submit"
                    className="p-2 bg-green-600 rounded-lg text-white disabled:opacity-50"
                    disabled={!input.trim()}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
