import { useState, useEffect } from 'react';
import { useGitHubActivity, CommitData } from '../../hooks/useGitHubActivity';

// --- Colors (Grafana Palette) ---
const COLORS = {
    bg: '#111217',
    panel: '#181b1f',
    border: '#22252b', // Slightly lighter border
    text: '#ccccda',
    textMuted: '#8e8e8e',
    green: '#73bf69',
    yellow: '#e0b400',
    red: '#f2495c',
    blue: '#5794f2',
    orange: '#ff9830',
    purple: '#b877d9'
};

export const SkillsContent = () => {
    // Real GitHub Data (Will fallback to simulated 5-year history)
    const { dailyActivity, totalCommits, loading } = useGitHubActivity('Maycon-Pereira');

    return (
        <div className="w-full h-full bg-[#111217] p-2 overflow-hidden flex flex-col font-sans select-none text-[#ccccda]">
            {/* --- Dashboard Header --- */}
            <div className="flex justify-between items-center px-2 mb-3 h-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-medium text-white">Production Overview</h1>
                    <div className="flex gap-2">
                        <Badge text="Senior Backend" color={COLORS.orange} />
                        <Badge text="System Architect" color={COLORS.blue} />
                    </div>
                </div>

                {/* Time Picker Visual */}
                <div className="flex items-center gap-1 bg-[#22252b] rounded-sm px-2 py-1 text-sm border border-[#333]">
                    <span className="text-white">Lifetime Range</span>
                    <svg className="w-3 h-3 ml-1 fill-gray-400" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
            </div>

            {/* --- Grid Layout --- */}
            <div className="flex-1 grid grid-cols-4 grid-rows-[auto_1fr_1fr] gap-2 overflow-y-auto pb-4 px-1 custom-scrollbar">

                {/* Row 1: Stat Panels */}
                <StatPanel title="Experience" value="5+ Years" subtext="Senior Level" color={COLORS.blue} />
                <StatPanel title="Core Stack" value="Java 17+" subtext="LTS Version" color={COLORS.orange} />
                <StatPanel title="Framework" value="Spring 3.2+" subtext="Boot / Cloud" color={COLORS.green} />
                <StatPanel title="Platform status" value="99.9%" subtext="Uptime" color={COLORS.green} trend={true} />

                {/* Row 2: Skill Bars (Span 2) */}
                {/* Row 2: Skill Bars (Span 2) */}
                <Panel title="Backend Ecosystem" className="col-span-2 row-span-2 h-full flex flex-col min-h-0">
                    <div className="flex-1 flex flex-col gap-3 px-4 pt-4 overflow-y-auto custom-scrollbar">
                        {/* CORE: FOUNDATION */}
                        <div className="flex flex-col gap-1">
                            <SkillBar name="Java Core / JVM" status="CORE" className="mt-1" color={COLORS.orange} />
                            <SkillBar name="Spring Boot" status="CORE" className="mt-1" color={COLORS.orange} />


                            {/* STABLE: MASTERED TOOLS */}
                            <SkillBar name="Microservices" status="STABLE" className="mt-1" color={COLORS.green} />
                            <SkillBar name="PostgreSQL / SQL" status="STABLE" className="mt-1" color={COLORS.green} />
                            <SkillBar name="REST APIs" status="STABLE" className="mt-1" color={COLORS.green} />


                            {/* BETA: LEARNING / NEWER */}
                            <SkillBar name="Kafka / Event Driven" status="BETA" className="mt-1" color={COLORS.blue} />
                            <SkillBar name="Cloud Infrastructure" status="BETA" className="mt-1" color={COLORS.blue} />
                        </div>
                    </div>
                </Panel>

                {/* Row 2: Frontend & Tools (Span 2) */}
                <Panel title="Frontend & Tools" className="col-span-2 row-span-1">
                    <div className="grid grid-cols-2 gap-4 h-full px-4 p-2 items-center">
                        <div className="flex flex-col gap-3">
                            <SkillBar name="React / Next.js" status="STABLE" color={COLORS.green} />
                            <SkillBar name="TypeScript" status="STABLE" color={COLORS.green} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs text-[#8e8e8e] uppercase">Toolkit</h4>
                            <div className="flex flex-wrap gap-2">
                                <Tag name="Git" />
                                <Tag name="Linux" />
                                <Tag name="Docker" />
                                <Tag name="Redis" />
                                <Tag name="Maven" />
                                <Tag name="CI/CD" />
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Row 3: Activity Graph (Span 2) */}
                <Panel title="Lifetime Commit Activity - [ Working On It ]" className="col-span-2 row-span-1 h-auto">
                    <a
                        href="https://github.com/Maycon-Pereira"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full block relative cursor-pointer group/graph"
                    >
                        <div className="w-full h-full p-2 relative flex flex-col">
                            <div className="flex-1 w-full relative">
                                <ActivityChart color={COLORS.yellow} data={dailyActivity} loading={loading} />
                            </div>
                            <div className="absolute top-2 right-4 text-xs font-mono text-[#8e8e8e] group-hover/graph:text-white transition-colors">
                                {loading ? 'Scanning...' : `${totalCommits.toLocaleString()} commits`}
                                <span className="ml-2 inline-flex items-center opacity-50 group-hover/graph:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </a>
                </Panel>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2c3235;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3c4245;
                }
            `}</style>
        </div>
    );
};

// --- Sub-components ---

const Panel = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#181b1f] border border-[#22252b] rounded-sm flex flex-col ${className}`}>
        {/* Panel Header */}
        <div className="h-8 flex items-center px-3 border-b border-[#22252b] cursor-pointer hover:bg-[#22252b] transition-colors group">
            <span className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide flex items-center gap-2 w-full">
                {title}
                <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 text-[#8e8e8e]" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
            </span>
        </div>
        {/* Panel Content */}
        <div className="flex-1 w-full min-h-0 relative">
            {children}
        </div>
    </div>
);

const StatPanel = ({ title, value, subtext, color, trend }: { title: string, value: string, subtext: string, color: string, trend?: boolean }) => (
    <Panel title={title} className="h-32">
        <div className="flex flex-col justify-center h-full px-4">
            <div className="text-3xl font-medium tracking-tight" style={{ color: color }}>
                {value}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[#8e8e8e]">
                {subtext}
                {trend && <span className="text-[#73bf69] flex items-center text-xs ml-1"><svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14l5-5 5 5z" /></svg> +2.4%</span>}
            </div>
        </div>
    </Panel>
);

const SkillBar = ({ name, status, color, className = '' }: { name: string, status: string, color: string, className?: string }) => (
    <div className={`w-full ${className}`}>
        <div className="flex justify-between mb-1 text-xs">
            <span className="text-[#ccccda] font-medium">{name}</span>
            <span className="font-bold opacity-80" style={{ color: color }}>[{status}]</span>
        </div>
        <div className="w-full h-1.5 bg-[#252830] rounded-sm overflow-hidden relative group">
            {/* Status Indicator Bar */}
            <div className="h-full rounded-sm relative" style={{
                width: status === 'CORE' ? '100%' : status === 'STABLE' ? '75%' : '50%',
                backgroundColor: color,
                opacity: 0.8
            }}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
        </div>
    </div>
);

const Badge = ({ text, color }: { text: string, color: string }) => (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
        {text}
    </span>
);

const Tag = ({ name }: { name: string }) => (
    <span className="bg-[#2a2d35] text-[#ccccda] px-2 py-1 rounded text-xs border border-[#333] hover:border-[#8e8e8e] transition-colors cursor-default">
        {name}
    </span>
);

const ActivityChart = ({ color, data, loading }: { color: string, data: CommitData[], loading: boolean }) => {
    if (loading || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full animate-pulse bg-[#22252b] opacity-20 rounded"></div>
            </div>
        );
    }

    // Normalize Data for SVG (ViewBox 0 0 400 100)
    const maxVal = Math.max(...data.map(d => d.count), 5); // Minimum max of 5 to avoid flat charts on low activity
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 400;
        const y = 100 - (d.count / maxVal) * 80; // Leave 20px padding at bottom, 100px total height
        return `${x},${y}`;
    }).join(' ');

    // Create fill path (closed loop)
    const fillPath = `M0,100 ${points} L400,100 Z`;

    // Create stroke path (open line)
    const strokePath = `M${points.replace(/ /g, ' L')}`;

    return (
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                fill="url(#chartGradient)"
                d={fillPath}
                className="transition-all duration-500 ease-in-out"
            />
            <path
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                d={strokePath}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-500 ease-in-out"
            />
        </svg>
    );
};
