import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface FileNode {
    id: string;
    name: string;
    type: 'folder' | 'file';
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
}

// --- Mock Data ---
const fileSystem: FileNode[] = [
    {
        id: 'root',
        name: 'Home',
        type: 'folder',
        children: [
            {
                id: 'backend-projects',
                name: 'backend-projects',
                type: 'folder',
                size: '4 items',
                date: 'Oct 24, 2025',
                children: [
                    {
                        id: 'portfolio-terminal',
                        name: 'PortfolioTerminal.java',
                        type: 'file',
                        fileType: 'java',
                        size: '12 KB',
                        date: 'Feb 16, 2026',
                        projectData: {
                            description: "A developer portfolio mimicking a Linux terminal environment with interactive commands and file system navigation.",
                            tech: ["React", "TypeScript", "Tailwind"],
                            link: "#",
                            fullDate: "Feb 16, 2026 14:30"
                        }
                    },
                    {
                        id: 'ecommerce-api',
                        name: 'EcommerceAPI.jar',
                        type: 'file',
                        fileType: 'jar',
                        size: '45 MB',
                        date: 'Jan 10, 2026',
                        projectData: {
                            description: "Scalable backend service for online store management, featuring product catalog, cart, and secure checkout.",
                            tech: ["Java", "Spring Boot", "PostgreSQL"],
                            link: "#",
                            fullDate: "Jan 10, 2026 09:15"
                        }
                    },
                    {
                        id: 'automation-suite',
                        name: 'AutomationSuite.py',
                        type: 'file',
                        fileType: 'txt', // Python script represented as txt/code
                        size: '8 KB',
                        date: 'Dec 05, 2025',
                        projectData: {
                            description: "Collection of Python scripts and cron jobs to automate daily developer workflows and server maintenance.",
                            tech: ["Python", "Bash", "Docker"],
                            link: "#",
                            fullDate: "Dec 05, 2025 18:45"
                        }
                    },
                    {
                        id: 'readme',
                        name: 'README.md',
                        type: 'file',
                        fileType: 'txt',
                        size: '2 KB',
                        date: 'Oct 24, 2025'
                    }
                ]
            },
            {
                id: 'documents',
                name: 'Documents',
                type: 'folder',
                children: [] // Empty
            },
            {
                id: 'downloads',
                name: 'Downloads',
                type: 'folder',
                children: []
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

import thunarFolderIcon from '../../img/thunarfolder.png';

export const ProjectsFileExplorer = ({ windowId }: { windowId?: string }) => {
    const { setWindowTitle } = useWindowManager();
    const [currentPath, setCurrentPath] = useState<string[]>(['root']);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalFile, setModalFile] = useState<FileNode | null>(null);

    // Get current directory node
    const currentFolderId = currentPath[currentPath.length - 1];
    const currentFolderNode = findNodeById(fileSystem, currentFolderId);

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
            // Double click logic handled separately
        }
        setSelectedId(file.id);
    };

    const handleFileDoubleClick = (file: FileNode) => {
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
                    ⬆️
                </button>
                <div className="flex-1 flex overflow-x-auto no-scrollbar items-center gap-1 text-xs font-mono">
                    <span className="text-[#ffffff60] whitespace-nowrap">/</span>
                    {currentPath.map((id, index) => {
                        const node = findNodeById(fileSystem, id);
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
                                    {node?.name}
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
                    <SidebarItem icon="🏠" label="Home" active={currentFolderId === 'root'} onClick={() => setCurrentPath(['root'])} />
                    <SidebarItem icon="🖥️" label="Desktop" />
                    <SidebarItem icon="📂" label="Documents" />
                    <SidebarItem icon="⬇️" label="Downloads" />
                    <div className="h-4" />
                    <div className="px-4 text-xs font-bold text-[#ffffff40] uppercase mb-1">Projects</div>
                    <SidebarItem
                        icon="🚀"
                        label="Backend"
                        active={currentPath.includes('backend-projects')}
                        onClick={() => {
                            // Find path to backend-projects
                            setCurrentPath(['root', 'backend-projects']);
                        }}
                    />
                </div>

                {/* Main View */}
                <div className="flex-1 p-4 overflow-y-auto" onClick={() => setSelectedId(null)}>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                        {currentFolderNode?.children?.map(child => (
                            <div
                                key={child.id}
                                onClick={(e) => { e.stopPropagation(); handleFileClick(child); }}
                                onDoubleClick={(e) => { e.stopPropagation(); handleFileDoubleClick(child); }}
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
                                        {child.name}
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
                                <span>Folder is Empty</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#2d2d44] border-t border-[#ffffff10] flex items-center px-4 text-xs text-[#ffffff60] gap-4">
                <span>{currentFolderNode?.children?.length || 0} items</span>
                <span>Free space: 42 GB</span>
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
                                        <div>Type: <span className="text-[#d0d0ff]">Java Source File</span></div>
                                        <div>Size: <span className="text-[#d0d0ff]">{modalFile.size}</span></div>
                                        <div>Modified: <span className="text-[#d0d0ff]">{modalFile.projectData?.fullDate || modalFile.date}</span></div>
                                        <div>Location: <span className="text-[#d0d0ff]">~/Projects/backend-projects</span></div>
                                    </div>

                                    {modalFile.projectData && (
                                        <>
                                            <div className="mb-4">
                                                <h3 className="text-sm font-bold text-[#64ffda] uppercase mb-1">Description</h3>
                                                <p className="text-[#d0d0ff] leading-relaxed">
                                                    {modalFile.projectData.description}
                                                </p>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-[#febc2e] uppercase mb-2">Technology Stack</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {modalFile.projectData.tech.map(t => (
                                                        <span key={t} className="px-2 py-1 bg-[#ffffff10] rounded text-xs border border-[#ffffff05]">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <button className="px-6 py-2 bg-[#9664ff] hover:bg-[#854bf0] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#9664ff40]">
                                                Open in VS Code
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-1.5 cursor-pointer transition-colors
            ${active ? 'bg-[#9664ff40] text-white border-r-2 border-[#9664ff]' : 'text-[#ffffff80] hover:bg-[#ffffff05] hover:text-white border-r-2 border-transparent'}
        `}
    >
        <span className="text-lg opacity-80">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </div>
);
