
import React from 'react';
import { useGitHubActivity } from '../../../hooks/useGitHubActivity';
import { useI18n } from '../../../hooks/useI18nHook';

const COLORS = {
    bg: '#111217',
    panel: '#181b1f',
    green: '#73bf69',
    yellow: '#e0b400',
    blue: '#5794f2',
    orange: '#ff9830',
};

export const MobileSkills = () => {
    const { t } = useI18n();
    const { totalCommits, loading } = useGitHubActivity('Maycon-Pereira');

    // Simplified components for mobile
    const SkillItem = ({ name, color, percent }: { name: string, color: string, percent: string }) => (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1 text-[#ccc]">
                <span>{name}</span>
                <span style={{ color }}>{percent}</span>
            </div>
            <div className="h-1 bg-[#333] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: percent, backgroundColor: color }} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#111217] text-[#ccccda] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-white">Skills & Stats</h1>
                <div className="px-2 py-1 rounded bg-[#22252b] border border-[#333] text-xs">
                    {loading ? '...' : `${totalCommits} Commits`}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#181b1f] p-3 rounded border border-[#22252b]">
                    <div className="text-xs text-[#8e8e8e] uppercase">Experience</div>
                    <div className="text-xl font-bold text-blue-400">{t('skills.value.years')}</div>
                </div>
                <div className="bg-[#181b1f] p-3 rounded border border-[#22252b]">
                    <div className="text-xs text-[#8e8e8e] uppercase">Stack</div>
                    <div className="text-xl font-bold text-orange-400">Java/Spring</div>
                </div>
            </div>

            {/* Backend Skills */}
            <div className="bg-[#181b1f] p-4 rounded border border-[#22252b] mb-4">
                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider border-b border-[#333] pb-2">
                    Backend Mastery
                </h2>
                <SkillItem name="Java Core" color={COLORS.orange} percent="95%" />
                <SkillItem name="Spring Boot" color={COLORS.orange} percent="90%" />
                <SkillItem name="Microservices" color={COLORS.green} percent="85%" />
                <SkillItem name="SQL / PostgreSQL" color={COLORS.green} percent="85%" />
                <SkillItem name="Kafka" color={COLORS.blue} percent="70%" />
            </div>

            {/* Frontend Skills */}
            <div className="bg-[#181b1f] p-4 rounded border border-[#22252b] mb-4">
                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider border-b border-[#333] pb-2">
                    Frontend & Tools
                </h2>
                <SkillItem name="React / TS" color={COLORS.blue} percent="75%" />
                <SkillItem name="Docker / CI/CD" color={COLORS.blue} percent="80%" />
                <div className="flex flex-wrap gap-2 mt-4">
                    {['Git', 'Linux', 'AWS', 'Redis'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-[#2a2d35] text-xs rounded border border-[#333]">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
