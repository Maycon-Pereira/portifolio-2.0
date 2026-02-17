import { useState, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowContext';
import { useI18n } from '../../hooks/useI18nHook';
import githubIcon from '../../img/svg/github.svg';
import linkedinIcon from '../../img/svg/linkedin.svg';

interface File {
    name: string;
    content: React.ReactNode;
    type: 'java' | 'class';
}

export const AboutContent = ({ windowId }: { windowId?: string }) => {
    const { setWindowTitle } = useWindowManager();
    const { t } = useI18n();
    const [activeFile, setActiveFile] = useState<string>('Profile.java');

    useEffect(() => {
        if (windowId && setWindowTitle) {
            setWindowTitle(windowId, "IntelliJ IDEA 2026.1");
        }
    }, [windowId, setWindowTitle]);

    const files: File[] = [
        // ... (files content remains same)
        {
            name: 'Profile.java',
            type: 'java',
            content: (
                <div className="font-mono text-sm leading-6">
                    <span className="text-[#cc7832]">package</span> <span className="text-[#a9b7c6]">com.maycon.portfolio;</span><br /><br />
                    <span className="text-[#cc7832]">public class</span> <span className="text-[#a9b7c6] font-bold">MayconPereira</span> <span className="text-[#a9b7c6]">{'{'}</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">private final</span> <span className="text-[#a9b7c6]">String role = </span><span className="text-[#6a8759]">"{t('about.role')}"</span><span className="text-[#a9b7c6]">;</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">private final</span> <span className="text-[#a9b7c6]">String stack = </span><span className="text-[#6a8759]">"{t('about.stack')}"</span><span className="text-[#a9b7c6]">;</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic">/**</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc1')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc2')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> *</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc3')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc4')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc5')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> *</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc6')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc7')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc8')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> * {t('about.doc9')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#629755] italic"> */</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">public</span> <span className="text-[#a9b7c6]">String</span> <span className="text-[#ffc66d]">about</span><span className="text-[#a9b7c6]">() {'{'}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">return</span> <span className="text-[#6a8759]">"{t('about.about_return')}"</span><span className="text-[#a9b7c6]">;</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a9b7c6]">{'}'}</span><br />
                    <span className="text-[#a9b7c6]">{'}'}</span>
                </div>
            )
        },
        {
            name: 'Experience.java',
            type: 'java',
            content: (
                <div className="font-mono text-sm leading-6">
                    <span className="text-[#cc7832]">package</span> <span className="text-[#a9b7c6]">com.maycon.portfolio;</span><br /><br />
                    <span className="text-[#629755] italic">/**</span><br />
                    <span className="text-[#629755] italic"> * @author Maycon Pereira</span><br />
                    <span className="text-[#629755] italic"> * @role {t('about.exp_author_role')}</span><br />
                    <span className="text-[#629755] italic"> */</span><br />
                    <span className="text-[#cc7832]">public class</span> <span className="text-[#a9b7c6] font-bold">CareerHistory</span> <span className="text-[#a9b7c6]">{'{'}</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// --- {t('about.exp_current_header')} ---</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_current_company')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">public</span> <span className="text-[#a9b7c6]">void</span> <span className="text-[#ffc66d]">multiledgersExperience</span><span className="text-[#a9b7c6]">() {'{'}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">String</span><span className="text-[#a9b7c6]">[] stack = {'{'}</span><span className="text-[#6a8759]">"Java"</span><span className="text-[#a9b7c6]">, </span><span className="text-[#6a8759]">"Spring Boot"</span><span className="text-[#a9b7c6]">, </span><span className="text-[#6a8759]">"Cypress"</span><span className="text-[#a9b7c6]">, </span><span className="text-[#6a8759]">"Azure DevOps"</span><span className="text-[#a9b7c6]">, </span><span className="text-[#6a8759]">"Git"</span><span className="text-[#a9b7c6]">{'}'}</span><span className="text-[#a9b7c6]">;</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_current1')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_current2')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_current3')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a9b7c6]">{'}'}</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// --- {t('about.exp_prev1_header')} ---</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev1_company')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">public</span> <span className="text-[#a9b7c6]">void</span> <span className="text-[#ffc66d]">freelancerProject</span><span className="text-[#a9b7c6]">() {'{'}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev1_1')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev1_2')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev1_3')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a9b7c6]">{'}'}</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// --- {t('about.exp_prev2_header')} ---</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev2_company')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">public</span> <span className="text-[#a9b7c6]">void</span> <span className="text-[#ffc66d]">fiebBlueWorksProject</span><span className="text-[#a9b7c6]">() {'{'}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev2_1')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev2_2')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev2_3')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_prev2_4')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a9b7c6]">{'}'}</span><br /><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// --- {t('about.exp_edu_header')} ---</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#cc7832]">public</span> <span className="text-[#a9b7c6]">void</span> <span className="text-[#ffc66d]">education</span><span className="text-[#a9b7c6]">() {'{'}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_edu1')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#808080]">// {t('about.exp_edu2')}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a9b7c6]">{'}'}</span><br />
                    <span className="text-[#a9b7c6]">{'}'}</span>
                </div>
            )
        }
    ];

    const activeContent = files.find(f => f.name === activeFile)?.content;

    return (
        <div className="w-full h-full flex flex-col bg-[#2b2b2b] text-[#a9b7c6] font-sans overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-[#3c3f41] flex flex-col border-r border-[#000000]">
                    <div className="px-3 py-1 text-xs text-[#a9b7c6] font-bold bg-[#313335]">Project</div>
                    <div className="flex-1 overflow-y-auto py-2">
                        <div className="px-2 text-sm">
                            <div className="flex items-center gap-1 text-[#a9b7c6] mb-1">
                                <span className="opacity-60">▼</span> 📁 portfolio
                            </div>
                            <div className="pl-4">
                                <div className="flex items-center gap-1 text-[#a9b7c6] mb-1">
                                    <span className="opacity-60">▼</span> 📁 src
                                </div>
                                <div className="pl-4">
                                    <div className="flex items-center gap-1 text-[#a9b7c6] mb-1">
                                        <span className="opacity-60">▼</span> 📁 main
                                    </div>
                                    <div className="pl-4">
                                        <div className="flex items-center gap-1 text-[#a9b7c6] mb-1">
                                            <span className="opacity-60">▼</span> 📁 java
                                        </div>
                                        <div className="pl-4">
                                            <div className="flex items-center gap-1 text-[#a9b7c6] mb-1">
                                                <span className="opacity-60">▼</span> 📁 com.maycon.portfolio
                                            </div>
                                            <div className="pl-4 flex flex-col gap-1">
                                                {files.map(f => (
                                                    <div
                                                        key={f.name}
                                                        className={`flex items-center gap-2 cursor-pointer px-2 py-0.5 ${activeFile === f.name ? 'bg-[#2d4265]' : 'hover:bg-[#2d2f30]'}`}
                                                        onClick={() => setActiveFile(f.name)}
                                                    >
                                                        <span className="text-[#a9b7c6] opacity-80">c</span>
                                                        <span className={activeFile === f.name ? 'text-[#a9b7c6]' : 'text-[#a9b7c6]'}>{f.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col bg-[#2b2b2b]">
                    {/* Tabs */}
                    <div className="h-9 flex bg-[#3c3f41] overflow-x-auto no-scrollbar">
                        {files.map(f => (
                            <div
                                key={f.name}
                                className={`
                                    flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] border-r border-[#000000] cursor-pointer text-sm
                                    ${activeFile === f.name ? 'bg-[#2b2b2b] text-[#a9b7c6]' : 'bg-[#3c3f41] text-[#787878]'}
                                `}
                                onClick={() => setActiveFile(f.name)}
                            >
                                <span className="text-[#a9b7c6] opacity-80">c</span>
                                <span className="truncate flex-1">{f.name}</span>
                                <span className="opacity-0 hover:opacity-100 text-xs">✕</span>
                            </div>
                        ))}
                    </div>

                    {/* Breadcrumbs */}
                    <div className="h-6 bg-[#3c3f41] flex items-center px-4 text-xs text-[#a9b7c6] opacity-70 gap-1 border-b border-[#323232]">
                        <span>portfolio</span> <span>›</span>
                        <span>src</span> <span>›</span>
                        <span>main</span> <span>›</span>
                        <span>java</span> <span>›</span>
                        <span>com</span> <span>›</span>
                        <span>maycon</span> <span>›</span>
                        <span>portfolio</span> <span>›</span>
                        <span>{activeFile}</span>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 p-4 overflow-auto bg-[#2b2b2b]">
                        <div className="flex">
                            {/* Line Numbers */}
                            <div className="flex flex-col text-right pr-4 text-[#606366] font-mono text-sm leading-6 select-none border-r border-[#323232] mr-4">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <span key={i}>{i + 1}</span>
                                ))}
                            </div>
                            {/* Code */}
                            <div className="flex-1">
                                {activeContent}
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="h-6 bg-[#3c3f41] border-t border-[#323232] flex items-center px-3 justify-between text-xs text-[#a9b7c6] opacity-80">
                        <div className="flex gap-4">
                            <a href="https://github.com/Maycon-Pereira" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                <img src={githubIcon} alt="GitHub" className="w-3.5 h-3.5 object-contain opacity-70" /> GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/maycon-ps/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                <img src={linkedinIcon} alt="LinkedIn" className="w-3.5 h-3.5 object-contain opacity-70" /> LinkedIn
                            </a>
                        </div>
                        <div className="flex gap-4">
                            <span>UTF-8</span>
                            <span>Top Level</span>
                            <span>master</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
