import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from './useI18nHook';

interface TerminalLine {
    type: 'command' | 'output';
    content: string | React.ReactNode;
    user?: string;
    host?: string;
}

export const useTerminal = () => {
    const { terminalT } = useI18n();
    const [history, setHistory] = useState<TerminalLine[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [input, setInput] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const initialized = useRef(false);

    const addToHistory = useCallback((lines: (string | React.ReactNode)[], type: 'command' | 'output' = 'output', user?: string, host?: string) => {
        const newLines: TerminalLine[] = lines.map(line => ({
            type,
            content: line,
            user,
            host
        }));
        setHistory(prev => [...prev, ...newLines]);
    }, []);

    // Initial welcome message
    useEffect(() => {
        if (!initialized.current) {
            addToHistory([
                terminalT('welcome'),
                terminalT('help_hint'),
                '',
            ]);
            initialized.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commands: Record<string, () => (string | React.ReactNode)[]> = {
        help: () => [
            terminalT('help_title'),
            terminalT('help_help'),
            terminalT('help_about'),
            terminalT('help_skills'),
            terminalT('help_projects'),
            terminalT('help_contact'),
            terminalT('help_clear'),
            terminalT('help_neofetch'),
            terminalT('help_whoami'),
            terminalT('help_date'),
            terminalT('help_ls'),
        ],
        about: () => [
            terminalT('about_title'),
            terminalT('about_1'),
            terminalT('about_2'),
            terminalT('about_3'),
        ],
        skills: () => [
            terminalT('skills_title'),
            '  Frontend  → React, Next.js, TypeScript, Three.js',
            '  Backend   → Node.js, NestJS, Python, Go',
            '  Database  → PostgreSQL, MongoDB, Firebase',
            '  DevOps    → Docker, GCP, CI/CD',
            '  Tools     → Git, Figma, Linux',
        ],
        projects: () => [
            terminalT('projects_title'),
            terminalT('projects_1'),
            terminalT('projects_2'),
            terminalT('projects_3'),
            terminalT('projects_4'),
        ],
        contact: () => [
            terminalT('contact_title'),
            <span key="email">  📧 Email    → <a href="https://mail.google.com/mail/?view=cm&to=pmaycon63@gmail.com" target="_blank" className="underline hover:text-white">pmaycon63@gmail.com</a></span>,
            <span key="linkedin">  💼 LinkedIn → <a href="https://www.linkedin.com/in/maycon-ps/" target="_blank" className="underline hover:text-white">linkedin.com/in/maycon-ps</a></span>,
            <span key="github">  🐙 GitHub   → <a href="https://github.com/Maycon-Pereira" target="_blank" className="underline hover:text-white">github.com/Maycon-Pereira</a></span>,
        ],
        whoami: () => ['visitor'],
        date: () => [new Date().toLocaleString()],
        ls: () => ['about.txt  skills.md  projects/  contact.json  .secrets/'],
        neofetch: () => [
            '  visitor@maycon',
            '  ─────────────────────',
            '  Shell  → portifolio-sh',
            `  Theme  → ${terminalT('theme_value')}`,
        ],
    };

    const handleCommand = (cmd: string, customOutput?: (string | React.ReactNode)[]) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Echo command
        addToHistory([trimmedCmd], 'command', 'visitor', 'maycon');

        if (trimmedCmd === '') {
            // do nothing
        } else {
            setCommandHistory(prev => [...prev, cmd]);
            setHistoryIndex(-1);
        }

        if (customOutput) {
            addToHistory(customOutput);
            return;
        }

        if (trimmedCmd === 'clear') {
            setHistory([]);
        } else if (trimmedCmd === 'sudo rm -rf /') {
            setIsShaking(true);
            addToHistory(['🚫 ACCESS DENIED: Nice try, but I need these files! 😱'], 'output');
            setTimeout(() => setIsShaking(false), 500);
        } else if (commands[trimmedCmd]) {
            addToHistory(commands[trimmedCmd]());
        } else {
            addToHistory([`${terminalT('not_found')} ${trimmedCmd}. ${terminalT('help_type')}`]);
        }
    };

    const navigateHistory = (direction: 'up' | 'down') => {
        if (commandHistory.length === 0) return;

        let newIndex = historyIndex;
        if (direction === 'up') {
            if (historyIndex === -1) {
                newIndex = commandHistory.length - 1;
            } else {
                newIndex = Math.max(0, historyIndex - 1);
            }
        } else if (direction === 'down') {
            if (historyIndex === -1) return;
            newIndex = historyIndex + 1;
        }

        if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInput('');
        } else {
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }
    };

    return {
        history,
        input,
        setInput,
        handleCommand,
        isShaking,
        navigateHistory
    };
};
