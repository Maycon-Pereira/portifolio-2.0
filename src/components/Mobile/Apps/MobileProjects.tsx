import { useState, useEffect } from 'react';
import {
    Search, MoreVertical,
    Image as ImageIcon, Music, FileText, Download,
    Smartphone, MemoryStick, Cloud, HardDrive, Trash2, Settings,
    ChevronRight, ArrowLeft, Github, Linkedin
} from 'lucide-react';
import { useI18n } from '../../../hooks/useI18nHook';
import { useWindowManager } from '../../../context/WindowContext';
import javaIcon from '../img/java.svg';

type ViewState = 'home' | 'documents' | 'view-all';

export const MobileProjects = () => {
    const [view, setView] = useState<ViewState>('home');
    const { t, getRepoKeys } = useI18n();
    const { registerBackHandler, unregisterBackHandler, closeWindow } = useWindowManager();
    const projectKeys = getRepoKeys();

    useEffect(() => {
        const handleBack = () => {
            if (view !== 'home') {
                setView('home');
                return true;
            }
            return false;
        };

        registerBackHandler('projects', handleBack);
        return () => unregisterBackHandler('projects');
    }, [view, registerBackHandler, unregisterBackHandler]);

    const allProjects = projectKeys.map(key => ({
        name: key,
        description: t(`repo_descriptions.${key}`),
        date: "GitHub Repo",
        type: "github",
        size: "4 KB",
        url: `https://github.com/Maycon-Pereira/${key}`
    }));

    // Mock documents for the "Documents" view to simulate a full file list
    const documents = [
        { name: "Resume.pdf", description: "Updated CV 2024", date: "Feb 20, 2024", type: "pdf", size: "1.2 MB", url: "#" },
        { name: "Budget_2024.xlsx", description: "Financial planning", date: "Jan 15, 2024", type: "xls", size: "450 KB", url: "#" },
        { name: "Notes.txt", description: "Meeting notes", date: "Today", type: "txt", size: "2 KB", url: "#" },
    ];

    const categories = [
        { id: 'github', label: "Github", icon: <Github size={24} />, color: "bg-white/10 text-white", count: "12", action: () => window.open('https://github.com/Maycon-Pereira', '_blank') },
        { id: 'linkedin', label: "LinkedIn", icon: <Linkedin size={24} />, color: "bg-blue-600/20 text-blue-600", count: "Connect", action: () => window.open('https://www.linkedin.com/in/maycon-ps/', '_blank') }, // Updated LinkedIn URL
        { id: 'documents', label: t('mobile_projects.documents') || "Documents", icon: <FileText size={24} />, color: "bg-blue-500/20 text-blue-500", count: documents.length.toString(), action: () => setView('documents') },
        { id: 'images', label: t('mobile_projects.images') || "Images", icon: <ImageIcon size={24} />, color: "bg-orange-500/20 text-orange-500", count: "1,204", action: () => { } },
        { id: 'downloads', label: t('mobile_projects.downloads') || "Downloads", icon: <Download size={24} />, color: "bg-green-500/20 text-green-500", count: "42", action: () => { } }, // Moved Downloads here
        { id: 'audio', label: t('mobile_projects.audio') || "Audio", icon: <Music size={24} />, color: "bg-yellow-500/20 text-yellow-500", count: "320", action: () => { } },
    ];

    const storage = [
        { label: t('mobile_projects.internal_storage') || "Internal storage", icon: <Smartphone size={24} />, used: "154.5 GB", total: "256 GB", percent: 60, color: "text-blue-400" },
        { label: t('mobile_projects.sd_card') || "SD card", icon: <MemoryStick size={24} />, used: "1.2 GB", total: "7.9 GB", percent: 15, color: "text-purple-400" },
    ];

    const cloud = [
        { label: "OneDrive", icon: <Cloud size={24} />, status: t('mobile_projects.not_signed_in') || "Not signed in", color: "text-blue-500" },
        { label: "Google Drive", icon: <HardDrive size={24} />, status: `2.08 TB ${t('mobile_projects.free') || "free"}`, color: "text-green-500" },
        { label: t('mobile_projects.network_storage') || "Network storage", icon: <ServerIcon size={24} />, status: "", color: "text-gray-400" },
    ];

    // --- Views ---

    if (view === 'documents') {
        return (
            <DetailView
                title={t('mobile_projects.documents') || "Documents"}
                items={documents}
                onBack={() => setView('home')}
                type="list"
            />
        );
    }

    if (view === 'view-all') {
        return (
            <DetailView
                title={t('mobile_projects.recent_files') || "Recent files"}
                items={allProjects}
                onBack={() => setView('home')}
                type="detailed" // Taller rows with description
            />
        );
    }

    // --- Home View ---

    return (
        <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="pt-5 pb-4 px-6 flex items-center justify-between bg-black sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => closeWindow('projects')} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white/80">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-medium tracking-tight">{t('mobile_projects.my_files') || "My Files"}</h1>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Search size={24} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <MoreVertical size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
                {/* Recent Files */}
                <div className="mt-2 mb-8">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-medium">{t('mobile_projects.recent_files') || "Recent files"}</h2>
                        <button
                            className="text-sm text-blue-400 hover:text-blue-300"
                            onClick={() => setView('view-all')}
                        >
                            {t('mobile_projects.view_all') || "View all"}
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
                        {allProjects.map((file, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-32 flex flex-col gap-2 cursor-pointer active:opacity-80 transition-opacity"
                                onClick={() => window.open(file.url, '_blank')}
                            >
                                <div className="w-32 h-32 bg-[#1e1e1e] rounded-2xl flex items-center justify-center relative overflow-hidden group border border-white/5">
                                    {file.type === 'git' ? (
                                        <img src={javaIcon} alt="Java" className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <FileText size={40} className="text-white/20 group-hover:text-white/40 transition-colors" />
                                    )}
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-mono uppercase text-white/70">
                                        {file.type}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="px-6 mb-8">
                    <h2 className="text-lg font-medium mb-4">{t('mobile_projects.categories') || "Categories"}</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {categories.map((cat, i) => (
                            <div
                                key={i}
                                onClick={cat.action}
                                className="bg-[#1e1e1e] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 active:bg-[#2d2d2d] transition-colors cursor-pointer"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-xs text-gray-300 font-medium">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Storage */}
                <div className="px-6 mb-8">
                    <h2 className="text-lg font-medium mb-4">{t('mobile_projects.storage') || "Storage"}</h2>
                    <div className="flex flex-col gap-4">
                        {storage.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="p-2 bg-[#1e1e1e] rounded-full text-white/50 border border-white/5">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <span className="text-xs text-gray-400">
                                            <span className={item.color}>{item.used}</span> / {item.total}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${(item.label === 'Internal storage' || item.label === t('mobile_projects.internal_storage')) ? 'bg-blue-500' : 'bg-purple-500'}`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cloud & Network */}
                <div className="px-6 mb-8">
                    <div className="flex flex-col gap-6">
                        {cloud.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="text-white/80">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.label}</p>
                                    {item.status && <p className="text-xs text-gray-500">{item.status}</p>}
                                </div>
                                <ChevronRight size={20} className="text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Utilities */}
                <div className="px-6 mb-8">
                    <h2 className="text-lg font-medium mb-4">{t('mobile_projects.utilities') || "Utilities"}</h2>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="text-white/80"><Trash2 size={24} /></div>
                            <span className="flex-1 text-sm font-medium">{t('mobile_projects.trash') || "Trash"}</span>
                            <ChevronRight size={20} className="text-gray-600" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-white/80"><Settings size={24} /></div>
                            <span className="flex-1 text-sm font-medium">{t('mobile_projects.manage_storage') || "Manage storage"}</span>
                            <ChevronRight size={20} className="text-gray-600" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Sub-components ---

interface DetailViewProps {
    title: string;
    items: any[];
    onBack: () => void;
    type: 'list' | 'detailed';
}

const DetailView = ({ title, items, onBack, type }: DetailViewProps) => {
    return (
        <div className="flex flex-col h-full bg-black text-white font-sans animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="pt-12 pb-4 px-4 flex items-center gap-4 bg-black sticky top-0 z-10 border-b border-white/5">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium tracking-tight flex-1">{title}</h1>
                <div className="flex items-center gap-2 text-white/80">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Search size={22} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <MoreVertical size={22} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-8">
                <div className="flex flex-col">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-4 p-4 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer ${type === 'detailed' ? 'py-5' : 'py-3'}`}
                            onClick={() => item.url && item.url !== '#' && window.open(item.url, '_blank')}
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#2d2d2d] flex items-center justify-center shrink-0 text-blue-400">
                                {item.type === 'git' ? <img src={javaIcon} alt="Java" className="w-6 h-6" /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-medium text-white truncate pr-2">{item.name}</h3>
                                    <span className="text-[10px] text-gray-500 shrink-0">{item.date}</span>
                                </div>

                                {type === 'detailed' && item.description && (
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <span className="uppercase">{item.type}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper for Network Icon since it's not standard in basic lucide import sometimes or specific name 
const ServerIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
);
