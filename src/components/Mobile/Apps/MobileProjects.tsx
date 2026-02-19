
import { useState } from 'react';
import { useI18n } from '../../../hooks/useI18nHook';
import { Folder, FileText, ChevronRight, ArrowLeft } from 'lucide-react';

export const MobileProjects = () => {
    const { t, getRepoKeys } = useI18n();
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const projects = getRepoKeys().map(key => ({
        id: key,
        name: key, // Or translation if available
        description: t(`repo_descriptions.${key}`),
    }));

    if (selectedProject) {
        return (
            <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
                <div className="flex items-center gap-2 p-4 border-b border-[#333] bg-[#2d2d2d]">
                    <button onClick={() => setSelectedProject(null)} className="p-1 -ml-2">
                        <ArrowLeft size={20} />
                    </button>
                    <FileText size={18} className="text-blue-400" />
                    <span className="font-bold truncate">{selectedProject}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-[#cccccc] whitespace-pre-wrap">
                    {t(`repo_descriptions.${selectedProject}`)}

                    <div className="mt-8 pt-4 border-t border-[#333]">
                        <a
                            href={`https://github.com/Maycon-Pereira/${selectedProject}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-2"
                        >
                            View on GitHub <ChevronRight size={14} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
            <div className="flex items-center gap-2 p-4 border-b border-[#333] bg-[#2d2d2d]">
                <Folder size={18} className="text-yellow-500" />
                <span className="font-bold">Projects</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <div className="grid gap-2">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project.id)}
                            className="bg-[#2d2d2d] p-4 rounded-xl active:bg-[#3d3d3d] transition-colors border border-[#333]"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <span className="font-bold">{project.name}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">
                                {project.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
