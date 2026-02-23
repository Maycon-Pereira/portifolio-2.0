import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18nHook';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGitHubRepos } from '../../utils/github';
import { AboutContent } from './AboutContent';
import { SkillsContent } from './SkillsContent';
import { Terminal } from '../Terminal/Terminal';
import { SublimeEditor } from './SublimeEditor';

// --- Types ---
interface FileNode {
    id: string;
    name: string;
    type: 'folder' | 'file';
    isExternal?: boolean;
    valuableLink?: string;
    fileType?: 'java' | 'jar' | 'txt' | 'img';
    size?: string;
    date?: string;
    children?: FileNode[];
    projectData?: {
        description: string;
        link: string;
        tech: string[];
        fullDate: string;
    };
    desktopAction?: string;
    isEditable?: boolean;
    icon?: string; // Custom SVG icon path
}

// --- Mock Data ---
const fileSystem: FileNode[] = [
    {
        id: 'root',
        name: 'Home',
        type: 'folder',
        children: [

            {
                id: 'desktop',
                name: 'Desktop',
                type: 'folder',
                children: [
                    {
                        id: 'app-about',
                        name: 'About Me',
                        type: 'file',
                        fileType: 'img',
                        desktopAction: 'about'
                    },
                    {
                        id: 'app-skills',
                        name: 'Skills',
                        type: 'file',
                        fileType: 'img',
                        desktopAction: 'skills'
                    },
                    {
                        id: 'app-terminal',
                        name: 'Terminal',
                        type: 'file',
                        fileType: 'txt',
                        desktopAction: 'terminal'
                    },
                ]
            },
            {
                id: 'documents',
                name: 'Documents',
                type: 'folder',
                children: [
                    {
                        id: 'easter-egg',
                        name: 'Easter Egg',
                        type: 'folder',
                        children: []
                    },
                    {
                        id: 'readme',
                        name: 'readme.md',
                        type: 'file',
                        fileType: 'txt',
                        size: '2 KB',
                        isEditable: true,
                        icon: 'readme'
                    },
                    {
                        id: 'text',
                        name: 'Text.txt',
                        type: 'file',
                        fileType: 'txt',
                        size: '??? KB',
                        isEditable: true
                    }
                ]
            },
            {
                id: 'downloads',
                name: 'Downloads',
                type: 'folder',
                children: [
                    {
                        id: 'dl-intellij',
                        name: 'IntelliJ IDEA 2026.1.deb',
                        type: 'file',
                        fileType: 'jar',
                        size: '892.4 MB',
                        date: '2025-12-10',
                        icon: 'intellij'
                    },
                    {
                        id: 'dl-grafana',
                        name: 'Grafana-v11.4.tar.gz',
                        type: 'file',
                        fileType: 'jar',
                        size: '245.7 MB',
                        date: '2025-11-22',
                        icon: 'grafana'
                    },
                    {
                        id: 'dl-github',
                        name: 'GitHub Desktop.AppImage',
                        type: 'file',
                        fileType: 'jar',
                        size: '118.3 MB',
                        date: '2026-01-05',
                        icon: 'github'
                    },
                    {
                        id: 'dl-linkedin',
                        name: 'LinkedIn-Recruiter.deb',
                        type: 'file',
                        fileType: 'jar',
                        size: '67.2 MB',
                        date: '2026-01-18',
                        icon: 'linkedin'
                    },
                    {
                        id: 'dl-sublime',
                        name: 'Sublime Text 4-Build4180.deb',
                        type: 'file',
                        fileType: 'jar',
                        size: '21.8 MB',
                        date: '2026-02-01',
                        icon: 'sublime'
                    },
                    {
                        id: 'dl-unknown',
                        name: '???.exe',
                        type: 'file',
                        fileType: 'jar',
                        size: '??? KB',
                        date: '???',
                        icon: 'unknown'
                    }
                ]
            }
        ]
    }
];

// --- Helpers ---
const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

import { useWindowManager } from '../../context/WindowContext';
import intellijIcon from '../../img/svg/intellij.svg';
import grafanaIcon from '../../img/svg/Grafana.svg';

import thunarFolderIcon from '../../img/thunarfolder.png';
import githubIcon from '../../img/svg/github.svg';
import linkedinIcon from '../../img/svg/linkedin.svg';
import sublimeIcon from '../../img/svg/sublime.svg';

export const ProjectsFileExplorer = ({ windowId }: { windowId?: string }) => {
    const { t } = useI18n();
    const { setWindowTitle, openWindow, windows, toggleWindow } = useWindowManager();
    const [fileNodes, setFileNodes] = useState<FileNode[]>(fileSystem);
    const [currentPath, setCurrentPath] = useState<string[]>(['root', 'github-projects']);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalFile, setModalFile] = useState<FileNode | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const [rawRepos, setRawRepos] = useState<any[]>([]);

    // Fetch GitHub Repos once
    useEffect(() => {
        const loadGithub = async () => {
            const repos = await fetchGitHubRepos('Maycon-Pereira');
            const allowedRepos = [
                'UserDept',
                'VollMed-Api',
                'Hotel',
                'BlueWorks-Back-End',
                'Rest-Product-Api',
                'ms-pedido-processamento',
                'E-Commerce-API',
                'CidadaoNow',
                'UserTask',
                'Organo'
            ];
            setRawRepos(repos.filter(repo => allowedRepos.includes(repo.name)));
        };
        loadGithub();
    }, []);

    // Update GitHub nodes whenever language (t) or rawRepos change
    useEffect(() => {
        if (rawRepos.length === 0) return;

        const githubNodes: FileNode[] = rawRepos.map(repo => ({
            id: `github-${repo.id}`,
            name: repo.name,
            type: 'folder',
            isExternal: true,
            valuableLink: repo.html_url,
            size: `${repo.size} KB`,
            date: new Date(repo.updated_at).toLocaleDateString(),
            children: [],
            projectData: {
                description: t(`repo_descriptions.${repo.name}`) || repo.description || t('projects_tab.desc_fallback'),
                link: repo.html_url,
                tech: [repo.language || "Create"],
                fullDate: new Date(repo.updated_at).toLocaleString()
            }
        }));

        const githubFolder: FileNode = {
            id: 'github-projects',
            name: 'GitHub',
            type: 'folder',
            children: githubNodes,
            date: new Date().toLocaleDateString()
        };

        setFileNodes(prev => {
            const newNodes = [...prev];
            const root = newNodes.find(n => n.id === 'root');
            if (root && root.children) {
                const existingIndex = root.children.findIndex(c => c.id === 'github-projects');
                if (existingIndex !== -1) {
                    root.children[existingIndex] = githubFolder;
                } else {
                    root.children.push(githubFolder);
                }
            }
            return newNodes;
        });
    }, [rawRepos, t]);

    // Get current directory node
    const currentFolderId = currentPath[currentPath.length - 1];
    const currentFolderNode = findNodeById(fileNodes, currentFolderId);

    // Breadcrumbs logic
    const navigateUp = () => {
        if (currentPath.length > 1) {
            setCurrentPath(prev => prev.slice(0, -1));
        }
    };

    const navigateTo = (folderId: string) => {
        setCurrentPath(prev => [...prev, folderId]);
    };

    const handleFileClick = (file: FileNode) => {
        if (selectedId === file.id) {
            // Already selected
        }
        setSelectedId(file.id);

        // Interactivity: If it's a github project, trigger 'cat' in terminal
        // github nodes start with 'github-' id prefix
        if (file.id.startsWith('github-')) {
            window.dispatchEvent(new CustomEvent('terminal-command', {
                detail: { command: `cat ${file.name}` }
            }));
        }
    };

    const handleFileDoubleClick = (file: FileNode) => {
        // Desktop app shortcut
        if (file.desktopAction) {
            const appMap: Record<string, { label: string; component: React.ReactNode; icon?: string }> = {
                'about': { label: t('projects_tab.about_me'), component: <AboutContent windowId="about" />, icon: intellijIcon },
                'skills': { label: 'Grafana', component: <SkillsContent />, icon: grafanaIcon },
                'terminal': { label: 'Terminal', component: <Terminal /> },
            };
            const app = appMap[file.desktopAction];
            if (app) {
                const existing = windows.find(w => w.id === file.desktopAction);
                if (existing) {
                    toggleWindow(file.desktopAction, existing.workspaceId);
                } else {
                    openWindow(file.desktopAction, app.label, app.component, 0, app.icon);
                }
            }
            return;
        }
        // Editable file — open as Sublime Text window
        if (file.isEditable) {
            const editorWindowId = `editor-${file.id}`;
            const existing = windows.find(w => w.id === editorWindowId);

            // Get content based on file id
            let fileContent = '';
            if (file.id === 'readme') {
                fileContent = t('terminal.readme_content');
            } else if (file.id === 'text') {
                fileContent = t('terminal.text_txt_content');
            }

            if (existing) {
                toggleWindow(editorWindowId, existing.workspaceId);
            } else {
                openWindow(
                    editorWindowId,
                    file.name,
                    <SublimeEditor fileId={file.id} fileName={file.name} initialContent={fileContent} />,
                    0,
                    sublimeIcon
                );
            }
            return;
        }
        if (file.isExternal && file.valuableLink) {
            window.open(file.valuableLink, '_blank');
            return;
        }
        if (file.type === 'folder') {
            navigateTo(file.id);
        } else {
            // Open File Detail
            if (file.projectData) {
                setModalFile(file);
            }
        }
    };

    // Update Window Title with Breadcrumbs
    React.useEffect(() => {
        if (!windowId || !setWindowTitle) return;

        const breadcrumbs = (
            <div className="flex items-center gap-2 w-full h-full" onMouseDown={e => e.stopPropagation()}>
                <button
                    onClick={navigateUp}
                    disabled={currentPath.length <= 1}
                    className="p-1 rounded hover:bg-[#ffffff20] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs"
                    title="Up"
                >
                    📂
                </button>
                <div className="flex-1 flex overflow-x-auto no-scrollbar items-center gap-1 text-xs font-mono">
                    <span className="text-[#ffffff60] whitespace-nowrap">/</span>
                    {currentPath.map((id, index) => {
                        const node = findNodeById(fileNodes, id);
                        const isLast = index === currentPath.length - 1;
                        return (
                            <React.Fragment key={id}>
                                <button
                                    onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                                    className={`
                                        px-1.5 py-0.5 rounded transition-colors whitespace-nowrap
                                        ${isLast ? 'text-white font-bold bg-[#ffffff10]' : 'text-[#ffffff80] hover:bg-[#ffffff10] hover:text-white'}
                                    `}
                                >
                                    {id === 'root' ? t('projects_tab.sidebar_home') :
                                        id === 'desktop' ? t('projects_tab.sidebar_desktop') :
                                            id === 'documents' ? t('projects_tab.sidebar_docs') :
                                                id === 'downloads' ? t('projects_tab.sidebar_downloads') :
                                                    id === 'github-projects' ? t('projects_tab.sidebar_projects') :
                                                        node?.name}
                                </button>
                                {index < currentPath.length - 1 && <span className="text-[#ffffff40]">/</span>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        );

        setWindowTitle(windowId, breadcrumbs);
    }, [currentPath, windowId, setWindowTitle]);

    // Icons
    const getIcon = (node: FileNode) => {
        // Custom icon from Downloads
        if (node.icon) {
            const iconMap: Record<string, string | React.ReactNode> = {
                intellij: intellijIcon,
                grafana: grafanaIcon,
                github: <i className="bi bi-github text-white"></i>,
                linkedin: <span className="w-5 h-5 flex items-center justify-center bg-white rounded-sm"><i className="bi bi-linkedin text-[#0A66C2] text-xs"></i></span>,
                sublime: sublimeIcon,
            };
            if (node.icon === 'unknown') return <span className="text-3xl">❓</span>;
            const src = iconMap[node.icon];
            if (!src) return <span className="text-3xl">📄</span>;
            if (typeof src === 'string') return <img src={src} alt={node.name} className="w-10 h-10 object-contain" />;
            return <span className="text-4xl flex items-center justify-center">{src}</span>;
        }
        if (node.desktopAction === 'about') return <img src={intellijIcon} alt="About" className="w-10 h-10 object-contain" />;
        if (node.desktopAction === 'skills') return <img src={grafanaIcon} alt="Skills" className="w-10 h-10 object-contain" />;
        if (node.desktopAction === 'terminal') return '💻';
        if (node.type === 'folder') {
            return <img src={thunarFolderIcon} alt="folder" className="w-12 h-12 object-contain" />;
        }
        if (node.fileType === 'java') return '☕';
        if (node.fileType === 'jar') return '📦';
        if (node.fileType === 'txt') return '📄';
        return '📄';
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#1e1e32] text-[#d0d0ff] font-sans selection:bg-[#9664ff40]">
            {/* Toolbar removed - moved to Title Bar */}

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 bg-[#252538] border-r border-[#ffffff10] flex flex-col py-4 gap-1">
                    <SidebarItem icon="🏠" label={t('projects_tab.sidebar_home')} active={currentFolderId === 'root'} onClick={() => setCurrentPath(['root'])} />
                    <SidebarItem icon="🖥️" label={t('projects_tab.sidebar_desktop')} active={currentPath.includes('desktop')} onClick={() => setCurrentPath(['root', 'desktop'])} />
                    <SidebarItem icon="📂" label={t('projects_tab.sidebar_docs')} active={currentPath.includes('documents')} onClick={() => setCurrentPath(['root', 'documents'])} />
                    <SidebarItem icon="⬇️" label={t('projects_tab.sidebar_downloads')} active={currentPath.includes('downloads')} onClick={() => setCurrentPath(['root', 'downloads'])} />
                    <div className="h-4" />
                    <div className="px-4 text-xs font-bold text-[#ffffff40] uppercase mb-1">{t('projects_tab.sidebar_projects')}</div>

                    <SidebarItem
                        icon={<img src={githubIcon} alt="GitHub" className="w-5 h-5 object-contain invert opacity-80" />}
                        label="GitHub"
                        active={currentPath.includes('github-projects')}
                        onClick={() => {
                            setCurrentPath(['root', 'github-projects']);
                        }}
                    />
                    <SidebarItem
                        icon={<img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5 object-contain invert opacity-80" />}
                        label="LinkedIn"
                        onClick={() => {
                            window.open('https://www.linkedin.com/in/maycon-ps/', '_blank');
                        }}
                    />
                </div>

                {/* Main View */}
                <div className="flex-1 p-4 overflow-y-auto" onClick={() => setSelectedId(null)}>
                    {currentFolderId === 'downloads' ? (
                        /* List View for Downloads */
                        <div className="flex flex-col gap-0.5">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#ffffff40] font-bold border-b border-[#ffffff10] mb-1">
                                <span className="w-8"></span>
                                <span className="flex-1">{t('projects_tab.table_name')}</span>
                                <span className="w-24 text-right">{t('projects_tab.table_size')}</span>
                                <span className="w-24 text-right">{t('projects_tab.table_date')}</span>
                            </div>
                            {currentFolderNode?.children?.map(child => (
                                <div
                                    key={child.id}
                                    onClick={(e) => { e.stopPropagation(); handleFileClick(child); }}
                                    onDoubleClick={(e) => { e.stopPropagation(); handleFileDoubleClick(child); }}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer group
                                        ${selectedId === child.id
                                            ? 'bg-[#9664ff30] border border-[#9664ff60]'
                                            : 'bg-transparent border border-transparent hover:bg-[#ffffff08]'}
                                    `}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                        <div className="w-7 h-7 flex items-center justify-center">
                                            {child.icon === 'unknown'
                                                ? <span className="text-xl">❓</span>
                                                : child.icon === 'github'
                                                    ? <i className="bi bi-github text-white text-xl"></i>
                                                    : child.icon === 'linkedin'
                                                        ? <span className="w-4 h-4 flex items-center justify-center bg-white rounded-sm"><i className="bi bi-linkedin text-[#0A66C2] text-xl"></i></span>
                                                        : child.icon
                                                            ? <img src={{ intellij: intellijIcon, grafana: grafanaIcon, github: githubIcon, linkedin: linkedinIcon, sublime: sublimeIcon }[child.icon] || ''} alt={child.name} className="w-7 h-7 object-contain" />
                                                            : <span className="text-xl">📄</span>
                                            }
                                        </div>
                                    </div>
                                    <span className="flex-1 text-sm font-medium truncate group-hover:text-white transition-colors">
                                        {child.id === 'desktop' ? t('projects_tab.sidebar_desktop') :
                                            child.id === 'documents' ? t('projects_tab.sidebar_docs') :
                                                child.id === 'downloads' ? t('projects_tab.sidebar_downloads') :
                                                    child.id === 'app-about' ? t('projects_tab.about_me') :
                                                        child.id === 'app-skills' ? t('projects_tab.skills') :
                                                            child.id === 'app-terminal' ? t('projects_tab.terminal') :
                                                                child.name}
                                    </span>
                                    <span className="w-24 text-right text-xs text-[#ffffff50]">
                                        {child.size || '—'}
                                    </span>
                                    <span className="w-24 text-right text-xs text-[#ffffff50]">
                                        {child.date || '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Grid View for other folders */
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {currentFolderNode?.children?.map(child => (
                                <div
                                    key={child.id}
                                    onClick={(e) => { e.stopPropagation(); handleFileClick(child); }}
                                    onDoubleClick={(e) => { e.stopPropagation(); handleFileDoubleClick(child); }}
                                    onMouseEnter={(e) => {
                                        if (child.projectData?.description) {
                                            setTooltip({ x: e.clientX, y: e.clientY, content: child.projectData.description });
                                        }
                                    }}
                                    onMouseMove={(e) => {
                                        if (tooltip) {
                                            setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                                        }
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                    className={`
                                        flex flex-col items-center gap-2 p-2 rounded border transition-all cursor-pointer group
                                        ${selectedId === child.id
                                            ? 'bg-[#9664ff40] border-[#9664ff80]'
                                            : 'bg-transparent border-transparent hover:bg-[#ffffff05]'}
                                    `}
                                >
                                    <div className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                                        {getIcon(child)}
                                    </div>
                                    <div className="flex flex-col items-center text-center w-full">
                                        <span className="text-sm font-medium leading-tight line-clamp-2 w-full break-words">
                                            {child.id === 'desktop' ? t('projects_tab.sidebar_desktop') :
                                                child.id === 'documents' ? t('projects_tab.sidebar_docs') :
                                                    child.id === 'downloads' ? t('projects_tab.sidebar_downloads') :
                                                        child.id === 'app-about' ? t('projects_tab.about_me') :
                                                            child.id === 'app-skills' ? t('projects_tab.skills') :
                                                                child.id === 'app-terminal' ? t('projects_tab.terminal') :
                                                                    child.name}
                                        </span>
                                        <span className="text-[10px] text-[#ffffff60] mt-1">
                                            {child.size}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!currentFolderNode?.children || currentFolderNode.children.length === 0) && (
                                <div className="col-span-full flex flex-col items-center justify-center text-[#ffffff30] h-64">
                                    <span className="text-4xl mb-2">📂</span>
                                    <span>{t('projects_tab.empty_folder')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#2d2d44] border-t border-[#ffffff10] flex items-center px-4 text-xs text-[#ffffff60] gap-4">
                <span>{currentFolderNode?.children?.length || 0} {t('projects_tab.status_items')}</span>
                <span>{t('projects_tab.status_space')}: 42 GB</span>
                <div className="flex-1" />
                <a href="https://github.com/Maycon-Pereira" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                    <img src={githubIcon} alt="GitHub" className="w-3.5 h-3.5 object-contain opacity-70" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/maycon-ps/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                    <img src={linkedinIcon} alt="LinkedIn" className="w-3.5 h-3.5 object-contain opacity-70" /> LinkedIn
                </a>
            </div>

            {/* File Detail Modal */}
            <AnimatePresence>
                {modalFile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-8"
                        onClick={() => setModalFile(null)}
                    >
                        <div
                            className="bg-[#1e1e32] border border-[#9664ff4d] rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-full overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-[#ffffff10] rounded-xl flex items-center justify-center text-6xl shadow-inner shrink-0">
                                    {getIcon(modalFile)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-bold text-white">{modalFile.name}</h2>
                                        <button
                                            onClick={() => setModalFile(null)}
                                            className="w-8 h-8 rounded-full bg-[#ffffff10] hover:bg-[#ffffff20] flex items-center justify-center transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#ffffff80] mb-6">
                                        <div>{t('projects_tab.modal_type')}: <span className="text-[#d0d0ff]">{t('projects_tab.type_fallback')}</span></div>
                                        <div>{t('projects_tab.modal_size')}: <span className="text-[#d0d0ff]">{modalFile.size}</span></div>
                                        <div>{t('projects_tab.modal_modified')}: <span className="text-[#d0d0ff]">{modalFile.projectData?.fullDate || modalFile.date}</span></div>
                                        <div>{t('projects_tab.modal_location')}: <span className="text-[#d0d0ff]">~/Projects/backend-projects</span></div>
                                    </div>

                                    {modalFile.projectData && (
                                        <>
                                            <div className="mb-4">
                                                <h3 className="text-sm font-bold text-[#64ffda] uppercase mb-1">{t('projects_tab.modal_desc')}</h3>
                                                <p className="text-[#d0d0ff] leading-relaxed">
                                                    {modalFile.projectData.description}
                                                </p>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-[#febc2e] uppercase mb-2">{t('projects_tab.modal_stack')}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {modalFile.projectData.tech.map(t => (
                                                        <span key={t} className="px-2 py-1 bg-[#ffffff10] rounded text-xs border border-[#ffffff05]">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <button className="px-6 py-2 bg-[#9664ff] hover:bg-[#854bf0] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#9664ff40]">
                                                {t('projects_tab.modal_vscode')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover Tooltip - use Portal to escape window transform context */}
            {tooltip && ReactDOM.createPortal(
                <div
                    className="fixed z-[9999] max-w-xs bg-black/90 text-white text-xs p-2 rounded border border-white/20 shadow-xl pointer-events-none backdrop-blur-sm"
                    style={{
                        top: tooltip.y + 16,
                        left: tooltip.x + 16,
                    }}
                >
                    {tooltip.content}
                </div>,
                document.body
            )}
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-1.5 cursor-pointer transition-colors
            ${active ? 'bg-[#9664ff40] text-white border-r-2 border-[#9664ff]' : 'text-[#ffffff80] hover:bg-[#ffffff05] hover:text-white border-r-2 border-transparent'}
        `}
    >
        <span className="text-lg opacity-80 flex items-center justify-center">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </div>
);
