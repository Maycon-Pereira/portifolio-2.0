
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useWindowManager } from '../../../context/WindowContext';
import { useI18n } from '../../../hooks/useI18nHook';

export const MobileIntelliJ = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'experience'>('profile');
    const { closeWindow } = useWindowManager();
    const { t } = useI18n();

    const handleBack = () => {
        closeWindow('intellij');
    };

    // Syntax Highlighting Components
    const Keyword = ({ children }: { children: React.ReactNode }) => <span className="text-[#CC7832]">{children}</span>;
    const StringVal = ({ children }: { children: React.ReactNode }) => <span className="text-[#6A8759]">{children}</span>;
    const Comment = ({ children }: { children: React.ReactNode }) => <span className="text-[#808080]">{children}</span>;
    const Type = ({ children }: { children: React.ReactNode }) => <span className="text-[#A9B7C6]">{children}</span>;
    const Method = ({ children }: { children: React.ReactNode }) => <span className="text-[#FFC66D]">{children}</span>;
    const Variable = ({ children }: { children: React.ReactNode }) => <span className="text-[#A9B7C6]">{children}</span>;

    const Tab = ({ label, isActive, onClick, blink }: { label: string, isActive: boolean, onClick: () => void, blink?: boolean }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center shrink-0 ${isActive ? 'border-[#4A88C7] text-[#A9B7C6] bg-[#2B2B2B]' : 'border-transparent text-[#606366] hover:bg-[#2B2B2B]'}`}
        >
            <span className="mr-2 text-[#CC7832]">J</span>
            <span className={blink ? "animate-pulse" : ""} style={blink ? { animationDuration: '3s' } : undefined}>
                {label}
            </span>
            {isActive && <span className="ml-2 text-[10px] opacity-60">✕</span>}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[#2B2B2B] text-[#A9B7C6] font-mono text-xs sm:text-sm">
            {/* Header / Tabs */}
            <div className="flex items-center bg-[#3C3F41] border-b border-[#1E1E1E]">
                <button
                    onClick={handleBack}
                    className="p-2 text-[#A9B7C6] hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex overflow-x-auto scrollbar-hide">
                    <Tab label="Profile.java" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <Tab
                        label="CareerHistory.java"
                        isActive={activeTab === 'experience'}
                        onClick={() => setActiveTab('experience')}
                        blink={true}
                    />
                </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {activeTab === 'profile' ? (
                    <div className="space-y-1">
                        <div><Keyword>package</Keyword> com.maycon.portfolio;</div>
                        <br />
                        <div><Keyword>public class</Keyword> <Type>MayconPereira</Type> {'{'}</div>
                        <br />
                        <div className="pl-4">
                            <Keyword>private final</Keyword> <Type>String</Type> <Variable>role</Variable> = <StringVal>"Backend Software Engineer"</StringVal>;
                        </div>
                        <div className="pl-4">
                            <Keyword>private final</Keyword> <Type>String</Type> <Variable>stack</Variable> = <StringVal>"Java | Spring Boot | APIs REST | SQL | Docker | AWS"</StringVal>;
                        </div>
                        <br />
                        <div className="pl-4">
                            <Comment>{'/**'}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc1') || "Backend engineer specialized in Java and Spring Boot."}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc2') || "Focused on building scalable, secure and well-structured APIs."}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;*</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc3') || "Strong mindset for clean architecture, testing and code quality."}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc4') || "Background in QA Automation, bringing reliability and"}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc5') || "failure-prevention thinking into system design."}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;*</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc6') || "Currently deepening knowledge in:"}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc7') || "- Microservices architecture"}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc8') || "- Cloud and distributed systems"}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;* {t('about.doc9') || "- Performance and observability"}</Comment>
                        </div>
                        <div className="pl-4">
                            <Comment>&nbsp;*/</Comment>
                        </div>
                        <div className="pl-4">
                            <Keyword>public</Keyword> <Type>String</Type> <Method>about</Method>() {'{'}
                        </div>
                        <div className="pl-8">
                            <Keyword>return</Keyword> <StringVal>"{t('about.about_return') || "I build clean, scalable and reliable backend systems."}"</StringVal>;
                        </div>
                        <div className="pl-4">{'}'}</div>
                        <div>{'}'}</div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div><Keyword>package</Keyword> com.maycon.portfolio;</div>
                        <br />
                        <div className="text-[#808080]">
                            <div>/**</div>
                            <div>&nbsp;* @author Maycon Pereira</div>
                            <div>&nbsp;* @role {t('about.exp_author_role') || "Software Engineer | Backend / Java Specialist"}</div>
                            <div>&nbsp;*/</div>
                        </div>
                        <div><Keyword>public class</Keyword> <Type>CareerHistory</Type> {'{'}</div>
                        <br />

                        {/* Multiledgers */}
                        <div className="pl-4 text-[#808080]">// --- {t('about.exp_current_header') || "CURRENTLY: SOFTWARE ENGINEER & QA"} ---</div>
                        <div className="pl-4 text-[#808080]">// {t('about.exp_current_company') || "Multiledgers | Jun 2025 – Present"}</div>
                        <div className="pl-4">
                            <Keyword>public</Keyword> <Type>void</Type> <Method>multiledgersExperience</Method>() {'{'}
                        </div>
                        <div className="pl-8">
                            <Type>String</Type>[] <Variable>stack</Variable> = {'{'}<StringVal>"Java"</StringVal>, <StringVal>"Spring Boot"</StringVal>, <StringVal>"Cypress"</StringVal>, <StringVal>"Azure DevOps"</StringVal>, <StringVal>"Git"</StringVal>{'};'}
                        </div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_current1') || "Active role in development and validation of REST APIs"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_current2') || "Execution and maintenance of automated tests integrated with CI/CD"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_current3') || "Focus on performance, security and application usability"}</div>
                        <div className="pl-4">{'}'}</div>
                        <br />

                        {/* Elegancy */}
                        <div className="pl-4 text-[#808080]">// --- {t('about.exp_prev1_header') || "PREVIOUS: WEB DEVELOPER (FREELANCE)"} ---</div>
                        <div className="pl-4 text-[#808080]">// {t('about.exp_prev1_company') || "Elegancy Móveis | Dec 2024 – Feb 2025"}</div>
                        <div className="pl-4">
                            <Keyword>public</Keyword> <Type>void</Type> <Method>freelancerProject</Method>() {'{'}
                        </div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev1_1') || "Full e-commerce platform development (WordPress/WooCommerce)"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev1_2') || "UX and technical SEO optimization, resulting in 700% sales growth"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev1_3') || "Implementation of custom solutions with JavaScript and CSS"}</div>
                        <div className="pl-4">{'}'}</div>
                        <br />

                        {/* FIEB */}
                        <div className="pl-4 text-[#808080]">// --- {t('about.exp_prev2_header') || "PREVIOUS: SOFTWARE ENGINEER / FULLSTACK"} ---</div>
                        <div className="pl-4 text-[#808080]">// {t('about.exp_prev2_company') || "FIEB (BlueWorks) | Feb 2021 – Dec 2023"}</div>
                        <div className="pl-4">
                            <Keyword>public</Keyword> <Type>void</Type> <Method>fiebBlueWorksProject</Method>() {'{'}
                        </div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev2_1') || "Complete back-end development in Java + Spring Boot"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev2_2') || "Implementation of unit tests (JUnit), integration and REST APIs (Postman)"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev2_3') || "SQL Server and PostgreSQL database modeling"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_prev2_4') || "Working in agile teams using Scrum and Kanban"}</div>
                        <div className="pl-4">{'}'}</div>
                        <br />

                        {/* Education */}
                        <div className="pl-4 text-[#808080]">// --- {t('about.exp_edu_header') || "ACADEMIC EDUCATION"} ---</div>
                        <div className="pl-4">
                            <Keyword>public</Keyword> <Type>void</Type> <Method>education</Method>() {'{'}
                        </div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_edu1') || "Systems Analysis and Development - São Judas (In Progress)"}</div>
                        <div className="pl-8 text-[#808080]">// {t('about.exp_edu2') || "IT Technician - FIEB (Completed)"}</div>
                        <div className="pl-4">{'}'}</div>
                        <div>{'}'}</div>
                    </div>
                )}
            </div>

            {/* Status Bar simulation */}
            <div className="bg-[#3C3F41] text-[#A9B7C6] text-[10px] px-2 py-0.5 flex justify-between border-t border-[#1E1E1E]">
                <span>{activeTab === 'profile' ? 'Profile.java' : 'CareerHistory.java'}:1:1</span>
                <span>UTF-8</span>
            </div>
        </div>
    );
};
