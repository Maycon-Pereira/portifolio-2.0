import React, { useEffect, useRef } from 'react';
import { useI18n } from './useI18nHook';
import { useSystem } from '../context/SystemContext';

// Delete TerminalLine interface as it's now in SystemContext (or import it if needed, but we don't strictly need to export it here if we don't use it in API return explicitly other than implicitly)
// Actually, keep it if exported, but maybe just use the one from context?
// The return type of the hook uses it implicitly.
// Let's import it to be safe if we need it for typing.
import { TerminalLine } from '../context/SystemContext';

export const useTerminal = (options?: { onProjectCat?: () => void, onOpenWindow?: (id: string) => void, onViewReadme?: () => void, onViewText?: () => void }) => {
    const { t, terminalT, getRepoKeys } = useI18n();

    // Use System Context
    const {
        terminalHistory: history,
        terminalCommandHistory: commandHistory,
        terminalHistoryIndex: historyIndex,
        terminalInput: input,
        setTerminalInput: setInput,
        addToTerminalHistory,
        addToCommandHistory,
        setTerminalHistoryIndex: setHistoryIndex,
        clearTerminalHistory
    } = useSystem();

    const [isShaking, setIsShaking] = React.useState(false);
    const initialized = useRef(false);

    const onProjectCat = options?.onProjectCat;
    const onOpenWindow = options?.onOpenWindow;
    const onViewReadme = options?.onViewReadme;
    const onViewText = options?.onViewText;

    // Helper to match old addToHistory signature
    const addToHistory = (lines: (string | React.ReactNode)[], type: 'command' | 'output' = 'output', user?: string, host?: string) => {
        addToTerminalHistory(lines, type, user, host);
    };

    const commands: Record<string, () => (string | React.ReactNode)[]> = {
        help: () => [
            terminalT('help_title'),
            terminalT('help_help'),
            terminalT('help_about'),
            terminalT('help_skills'),
            terminalT('help_projects'),
            terminalT('help_clear'),
            terminalT('help_neofetch'),
            terminalT('help_whoami'),
            terminalT('help_date'),
            terminalT('help_ls'),
        ],
        about: () => [
            `${terminalT('about_title')}\n${terminalT('about_1')}\n${terminalT('about_2')}\n\n${terminalT('about_3')}`
        ],
        skills: () => [
            terminalT('skills_terminal_header'),
            '------------------',
            terminalT('skills_terminal_backend'),
            terminalT('skills_terminal_database'),
            terminalT('skills_terminal_testing'),
            terminalT('skills_terminal_devops'),
            terminalT('skills_terminal_frontend'),
            terminalT('skills_terminal_tools'),
        ],
        'java': () => [
            'openjdk version "17.0.9" 2023-10-17',
            'OpenJDK Runtime Environment (build 17.0.9+9-Ubuntu-122.04)',
            'OpenJDK 64-Bit Server VM (build 17.0.9+9-Ubuntu-122.04, mixed mode, sharing)',
            '',
            terminalT('cmd_java_info')
        ],
        'docker': () => [
            '● docker.service - Docker Application Container Engine',
            '     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)',
            '     Active: active (running) since Wed 2024-02-14 09:00:00 UTC; 3h 15min ago',
            '     Docs: https://docs.docker.com',
            '',
            terminalT('cmd_docker_running')
        ],
        'mvn': () => [
            'Apache Maven 3.9.5 (57804f517352055b4b325a3a0e91d34359d6854d)',
            'Maven home: /usr/share/maven',
            'Java version: 17.0.9, vendor: Private Build, runtime: /usr/lib/jvm/java-17-openjdk-amd64',
            '',
            terminalT('cmd_mvn_info')
        ],
        'psql': () => [
            'psql (PostgreSQL) 15.4 (Ubuntu 15.4-1.pgdg22.04+1)',
            '',
            terminalT('cmd_psql_connected')
        ],
        'cypress': () => [
            'Cypress package version: 13.6.0',
            'Cypress binary version: 13.6.0',
            'Electron version: 114',
            'Bundled Node version: 18.17.1',
            '',
            terminalT('cmd_cypress_pass')
        ],
        projects: () => [
            terminalT('projects_linux_header'),
            '------------------------------',
            'total 1.2MB',
            '',
            terminalT('project_blueworks_line'),
            terminalT('project_ecommerce_line'),
            terminalT('project_vollmed_line'),
            terminalT('project_hotel_line'),
            terminalT('project_usertask_line'),
            terminalT('project_ms_pedido_line'),
            terminalT('project_rest_product_line'),
            terminalT('project_cidadaonow_line'),
            terminalT('project_organo_line'),
            terminalT('project_userdept_line'),
            '',
            terminalT('projects_cat_hint'),
        ],
        whoami: () => ['visitor'],
        date: () => {
            const now = new Date();
            const utcParts = now.toUTCString().split(' ');
            const dayName = utcParts[0].replace(',', '');
            const day = utcParts[1];
            const month = utcParts[2];
            const year = utcParts[3];
            const time = utcParts[4];
            const formattedUTC = `${dayName} ${month} ${day} ${time} UTC ${year}`;

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const offset = -now.getTimezoneOffset() / 60;
            const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`;

            return [
                formattedUTC,
                `[TIMEZONE]: ${offsetStr} (${timeZone})`,
                `[EPOCH]: ${Math.floor(now.getTime() / 1000)}`
            ];
        },
        ls: () => [
            <div key="ls-output" className="flex flex-wrap gap-4">
                <span className="text-[#81a1c1] font-bold">about/</span>
                <span className="text-[#81a1c1] font-bold">skills/</span>
                <span className="text-[#81a1c1] font-bold">projects/</span>
                <span className="text-[#81a1c1] font-bold">github/</span>
                <span className="text-[#81a1c1] font-bold">linkedin/</span>
                <span className="text-[#e5e9f0]">readme.md</span>
                <span className="text-[#e5e9f0]">Text.txt</span>
            </div>
        ],
        neofetch: () => [
            <span key="nf-header" className="text-[#81a1c1]">{`${''.padEnd(29)}Match: Maycon Pereira`}</span>,
            <span key="nf-role" className="text-[#81a1c1]">{`${''.padEnd(29)}Role: Software Engineer`}</span>,
            <span key="nf-stack" className="text-[#81a1c1]">{`${''.padEnd(29)}Stack: Backend / Java Specialist`}</span>,
            `         ,MMM8&&&.           ───────────────────────────────────────`,
            `    _...MMMMM88&&&&..._      OS: ${terminalT('neofetch_os')}`,
            ` .::'''MMMMM88&&&&&&'''::.   Kernel: ${terminalT('neofetch_kernel')}`,
            `::     MMMMM88&&&&&&     ::  Uptime: ${terminalT('neofetch_uptime')}`,
            `'::....MMMMM88&&&&&&....::'  Packages: ${terminalT('neofetch_packages')}`,
            `   \`''''MMMMM88&&&&''''\`     Shell: ${terminalT('neofetch_shell')}`,
            `         'MMM8&&&'           Theme: ${terminalT('neofetch_theme')}`,
            `${''.padEnd(29)}CPU: ${terminalT('neofetch_cpu')}`,
            `${''.padEnd(29)}Memory: ${terminalT('neofetch_memory')}`,
        ],
    };

    const handleCommand = (cmd: string, customOutput?: (string | React.ReactNode)[]) => {
        const trimmedCmd = cmd.trim(); // Keep case for arguments, but lower command
        const lowerCmd = trimmedCmd.toLowerCase();

        // Echo command
        if (!customOutput) {
            addToHistory([trimmedCmd], 'command', 'visitor', 'maycon');
        } else {
            // For clicking list items that run commands without typing
            addToHistory([trimmedCmd], 'command', 'visitor', 'maycon');
        }


        if (lowerCmd === '') {
            // do nothing
        } else {
            addToCommandHistory(cmd);
            setHistoryIndex(-1);
        }

        if (customOutput) {
            addToHistory(customOutput);
            return;
        }

        if (lowerCmd === 'clear') {
            clearTerminalHistory();
        } else if (lowerCmd === 'sudo rm -rf /') {
            setIsShaking(true);
            addToHistory([terminalT('cmd_sudo_denied')], 'output');
            setTimeout(() => setIsShaking(false), 500);
        } else if (lowerCmd.startsWith('cd ')) {
            const target = lowerCmd.substring(3).trim();
            if (target === '..' || target === '.') {
                // Do nothing or simulate moving up
            } else if (['projects', 'about', 'skills'].includes(target)) {
                if (onOpenWindow) onOpenWindow(target);
                addToHistory([`Navigating to ${target}...`]);
            } else if (target === 'github') {
                window.open('https://github.com/Maycon-Pereira', '_blank');
                addToHistory(['Opening GitHub...']);
            } else if (target === 'linkedin') {
                window.open('https://linkedin.com/in/maycon-pereira', '_blank');
                addToHistory(['Opening LinkedIn...']);
            } else {
                addToHistory([`cd: ${target}: No such file or directory`], 'output');
            }
        }
        else if (lowerCmd.startsWith('cat ')) {
            const inputName = lowerCmd.substring(4).trim();

            if (inputName === 'readme.md' || inputName === 'readme') {
                addToHistory([terminalT('readme_opening')], 'output');
                if (onViewReadme) onViewReadme();
                return;
            }

            if (inputName === 'text.txt' || inputName === 'text') {
                if (onViewText) {
                    addToHistory([terminalT('text_opening')], 'output');
                    onViewText();
                } else {
                    addToHistory([terminalT('text_txt_content')], 'output');
                }
                return;
            }

            const repoKeys = getRepoKeys();
            const actualKey = repoKeys.find(k => k.toLowerCase() === inputName);

            if (actualKey) {
                const repoData = t(`repo_descriptions.${actualKey}`);
                const githubLink = `https://github.com/Maycon-Pereira/${actualKey}`;
                addToHistory([
                    `📄 File: ${actualKey}`,
                    '-----------------------',
                    repoData,
                    '',
                    <span key="repo-link">
                        🔗 [GitHub] <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-[#88c0d0] hover:underline cursor-pointer">{githubLink}</a>
                    </span>
                ]);
                if (onProjectCat) onProjectCat();
            } else {
                addToHistory([`cat: ${inputName}: No such file or directory`], 'output');
            }
        } else if (commands[lowerCmd]) {
            addToHistory(commands[lowerCmd]());
        } else {
            addToHistory([`${terminalT('not_found')} ${trimmedCmd}. ${terminalT('help_type')}`]);
        }
    };

    // Initial welcome message (Check if empty to avoid repeating on re-mount if switched)
    useEffect(() => {
        if (!initialized.current && history.length === 0) {
            addToHistory([
                terminalT('welcome'),
                terminalT('help_hint'),
                '',
            ]);
            initialized.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount, but check history length


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
