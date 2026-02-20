import { useGitHubActivity } from '../../../hooks/useGitHubActivity';
import { Activity, Server, Code, Terminal, Layers, Cpu, Globe, ArrowLeft } from 'lucide-react';
import { useWindowManager } from '../../../context/WindowContext';
import { useI18n } from '../../../hooks/useI18nHook';

export const MobileSkills = () => {
    // We can keep the hook if we want the real commit count in the header or somewhere else, 
    // but for now we'll stick to the requested static layout.
    const { totalCommits, dailyActivity, loading } = useGitHubActivity('Maycon-Pereira');
    const { closeWindow } = useWindowManager();
    const { t } = useI18n();

    // Color Palette based on Grafana/Dark theme
    const COLORS = {
        bg: '#111217',
        panel: '#181b1f',
        border: '#22252b',
        text: '#ccccda',
        textMuted: '#8e8e8e',
        green: '#73bf69',
        yellow: '#e0b400',
        blue: '#5794f2',
        orange: '#ff9830',
        red: '#f2495c'
    };

    const StatusTag = ({ status }: { status: 'CORE' | 'STABLE' | 'BETA' }) => {
        let color = COLORS.green;
        if (status === 'CORE') color = COLORS.blue;
        if (status === 'BETA') color = COLORS.yellow;

        return (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}>
                {status}
            </span>
        );
    };

    const StatCard = ({ title, value, subtext, color, icon: Icon }: { title: string, value: string, subtext?: string, color: string, icon?: any }) => (
        <div className="flex flex-col p-3 rounded-lg border h-full justify-between" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: COLORS.textMuted }}>{title}</span>
                {Icon && <Icon size={14} style={{ color }} />}
            </div>
            <div>
                <div className="text-lg font-bold" style={{ color }}>{value}</div>
                {subtext && <div className="text-[10px]" style={{ color: COLORS.textMuted }}>{subtext}</div>}
            </div>
        </div>
    );

    const ListItem = ({ label, status }: { label: string, status: 'CORE' | 'STABLE' | 'BETA' }) => (
        <div className="flex items-center justify-between py-2 border-b last:border-0 border-[#22252b]">
            <span className="text-sm font-medium" style={{ color: COLORS.text }}>{label}</span>
            <StatusTag status={status} />
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>

            {/* Header / Production Overview */}
            <div className="p-4 border-b border-[#22252b] bg-[#141619]">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                        <button onClick={() => closeWindow('skills')} className="text-[#ccccda] hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-[#5794f2]" />
                            {t('skills.title') || 'Production Overview'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-[#22252b] text-[#73bf69]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#73bf69] animate-pulse" />
                        Online
                    </div>
                </div>
                <div className="flex gap-2 text-xs text-[#8e8e8e]">
                    <span>{t('skills.badge_backend') || 'Backend Engineer'}</span>
                    <span>•</span>
                    <span>{t('skills.badge_architect') || 'System Architect'}</span>
                    <span>•</span>
                    <span>{totalCommits} {t('skills.commits') || 'commits'}</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Lifetime Range / Stats Grid */}
                <div>
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider text-[#5794f2]">{t('skills.time_range') || 'Lifetime Range'}</div>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            title={t('skills.dashboard.experience') || "Experience"}
                            value={t('skills.value.years') || "3+ Years"}
                            subtext={t('skills.dashboard.experience_sub') || "Software Engineer"}
                            color={COLORS.green}
                            icon={Terminal}
                        />
                        <StatCard
                            title={t('skills.dashboard.core_stack') || "Core Stack"}
                            value="Java 8+"
                            subtext={t('skills.dashboard.core_stack_sub') || "LTS Version"}
                            color={COLORS.blue}
                            icon={Code}
                        />
                        <StatCard
                            title={t('skills.dashboard.framework') || "Framework"}
                            value="Spring 3.2+"
                            subtext={t('skills.dashboard.framework_sub') || "Boot / Cloud"}
                            color={COLORS.orange}
                            icon={Layers}
                        />
                        <StatCard
                            title={t('skills.dashboard.platform') || "Platform Status"}
                            value="99.9%"
                            subtext={`${t('skills.dashboard.platform_sub') || "Uptime"} (+2.4%)`}
                            color={COLORS.green}
                            icon={Server}
                        />
                    </div>
                </div>

                {/* Backend Ecosystem */}
                <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
                    <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: COLORS.border, backgroundColor: '#1e2126' }}>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#e0b400]">{t('skills.backend_panel') || 'Backend Ecosystem'}</span>
                        <Cpu size={14} className="text-[#e0b400]" />
                    </div>
                    <div className="px-4 py-1">
                        <ListItem label="Java Core / JVM" status="CORE" />
                        <ListItem label="Spring Boot" status="CORE" />
                        <ListItem label="Microservices" status="STABLE" />
                        <ListItem label="PostgreSQL / SQL" status="STABLE" />
                        <ListItem label="REST APIs" status="STABLE" />
                        <ListItem label={t('skills.stack.kafka_event') || "Kafka / Event Driven"} status="BETA" />
                        <ListItem label={t('skills.stack.cloud_infra') || "Cloud Infrastructure"} status="BETA" />
                    </div>
                </div>

                {/* Frontend & Tools */}
                <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
                    <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: COLORS.border, backgroundColor: '#1e2126' }}>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#f2495c]">{t('skills.frontend_panel') || 'Frontend & Tools'}</span>
                        <Globe size={14} className="text-[#f2495c]" />
                    </div>
                    <div className="px-4 py-1">
                        <ListItem label="React / Next.js" status="STABLE" />
                        <ListItem label="TypeScript" status="STABLE" />
                    </div>
                    <div className="px-4 py-3 border-t border-[#22252b]">
                        <span className="text-[10px] uppercase text-[#8e8e8e] mb-2 block">{t('skills.toolkit') || 'Toolkit'}</span>
                        <div className="flex flex-wrap gap-2">
                            {['Git', 'Linux', 'Docker', 'Redis', 'Maven', 'CI/CD'].map(tech => (
                                <span key={tech} className="text-[10px] px-2 py-1 rounded bg-[#2a2d35] border border-[#333] text-[#ccc]">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lifetime Commit Activity */}
                <div className="rounded-lg border overflow-hidden p-3 flex flex-col items-center justify-center text-center space-y-2 h-40" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
                    <div className="w-full flex justify-between items-center px-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8e8e8e]">{t('skills.activity_panel') || 'Lifetime Commit Activity'}</span>
                        <span className="text-[10px] text-[#e0b400]">{totalCommits} {t('skills.commits') || 'commits'}</span>
                    </div>

                    <div className="w-full h-full relative">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Activity size={24} className="animate-spin text-[#5794f2]" />
                            </div>
                        ) : (
                            <ActivityChart color={COLORS.yellow} data={dailyActivity} loading={loading} />
                        )}
                    </div>
                </div>

                <div className="h-4"></div> {/* Bottom Spacer */}
            </div>
        </div>
    );
};

// --- Sub-components ---

const ActivityChart = ({ color, data, loading }: { color: string, data: any[], loading: boolean }) => {
    if (loading || !data || data.length === 0) {
        return null;
    }

    // Example data normalization for SVG (ViewBox 0 0 400 100)
    // Mobile view might be smaller, but viewBox scales.
    const maxVal = Math.max(...data.map(d => d.count), 5);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 400;
        const y = 100 - (d.count / maxVal) * 80; // 80% height usage
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `M0,100 ${points} L400,100 Z`;
    const strokePath = `M${points.replace(/ /g, ' L')}`;

    return (
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="mobileChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={fillPath}
                fill="url(#mobileChartGradient)"
                className="transition-all duration-500 ease-in-out"
            />
            <path
                d={strokePath}
                fill="none"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-500 ease-in-out"
            />
        </svg>
    );
};

