import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Translations = Record<string, any>;

const translations: Translations = {
    en: {
        nav: { home: "/home", about: "/about", skills: "/skills", projects: "/projects", contact: "/contact" },
        menu: { viros: "Viros 2.0", settings: "Settings", poweroff: "Power Off / Log Out", back: "Back" },
        status: { online: "Status (Online)" },
        hero: {
            name: 'MAYCON',
            subtitle: 'Software Engineer',
            specialty: 'Backend / Java Specialist',
        },
        terminal: {
            user_label: "👤 user",
            hostname_label: "🏠 hostname",
            shell_label: "🐚 shell",
            theme_label: "🎨 theme",
            theme_value: "Space Dark",
            welcome: 'Welcome to Maycon Terminal v1.0',
            help_hint: 'Type "help" to see available commands.',
            not_found: 'command not found:',
            help_type: 'Type "help" for commands.',
            help_title: '📋 Available commands:',
            help_help: '  help        - Show this help',
            help_about: '  about       - Who am I?',
            help_skills: '  skills      - My tech stack',
            help_projects: '  projects    - My projects',
            help_contact: '  contact     - How to reach me',
            help_clear: '  clear       - Clear terminal',
            help_neofetch: '  neofetch    - System info',
            help_whoami: '  whoami      - Current user',
            help_date: '  date        - Current date & time',
            help_ls: '  ls          - List directory',
            about_title: '👨‍💻 Maycon — Full Stack Developer',
            about_1: '   Passionate about clean code, automation,',
            about_2: '   and building amazing user experiences.',
            about_3: '   Currently exploring the edge of web tech.',
            skills_title: '🛠 Tech Stack:',
            projects_title: '🚀 Projects:',
            projects_1: '  • Portfolio — This website!',
            projects_2: '  • E-commerce Platform  — Full-stack store',
            projects_3: '  • Landing Page Engine  — Automated LP generator',
            projects_4: '  • Cypress Test Suite   — E2E automation',
            contact_title: '📬 Contact:',
        },
        about: {
            role: 'Backend Software Engineer',
            stack: 'Java | Spring Boot | APIs REST | SQL | Docker | AWS',
            doc1: 'Backend engineer specialized in Java and Spring Boot.',
            doc2: 'Focused on building scalable, secure and well-structured APIs.',
            doc3: 'Strong mindset for clean architecture, testing and code quality.',
            doc4: 'Background in QA Automation, bringing reliability and',
            doc5: 'failure-prevention thinking into system design.',
            doc6: 'Currently deepening knowledge in:',
            doc7: '- Microservices architecture',
            doc8: '- Cloud and distributed systems',
            doc9: '- Performance and observability',
            about_return: 'I build clean, scalable and reliable backend systems.',
            exp_author_role: 'Software Engineer | Backend / Java Specialist',
            exp_current_header: 'CURRENTLY: SOFTWARE ENGINEER & QA',
            exp_current_company: 'Multiledgers | Jun 2025 – Present',
            exp_current1: 'Active role in development and validation of REST APIs',
            exp_current2: 'Execution and maintenance of automated tests integrated with CI/CD',
            exp_current3: 'Focus on performance, security and application usability',
            exp_prev1_header: 'PREVIOUS: WEB DEVELOPER (FREELANCE)',
            exp_prev1_company: 'Elegancy Móveis | Dec 2024 – Feb 2025',
            exp_prev1_1: 'Full e-commerce platform development (WordPress/WooCommerce)',
            exp_prev1_2: 'UX and technical SEO optimization, resulting in 700% sales growth',
            exp_prev1_3: 'Implementation of custom solutions with JavaScript and CSS',
            exp_prev2_header: 'PREVIOUS: SOFTWARE ENGINEER / FULLSTACK',
            exp_prev2_company: 'FIEB (BlueWorks) | Feb 2021 – Dec 2023',
            exp_prev2_1: 'Complete back-end development in Java + Spring Boot',
            exp_prev2_2: 'Implementation of unit tests (JUnit), integration and REST APIs (Postman)',
            exp_prev2_3: 'SQL Server and PostgreSQL database modeling',
            exp_prev2_4: 'Working in agile teams using Scrum and Kanban',
            exp_edu_header: 'ACADEMIC EDUCATION',
            exp_edu1: 'Systems Analysis and Development - São Judas (In Progress)',
            exp_edu2: 'IT Technician - FIEB (Completed)',
        },
        editor: {
            placeholder: '// Start writing here...',
        },
        skills: {
            title: 'Production Overview',
            badge_backend: 'Senior Backend',
            badge_architect: 'System Architect',
            time_range: 'Lifetime Range',
            experience: 'Experience',
            experience_value: '5+ Years',
            experience_sub: 'Senior Level',
            core_stack: 'Core Stack',
            core_stack_sub: 'LTS Version',
            framework: 'Framework',
            framework_sub: 'Boot / Cloud',
            platform: 'Platform status',
            platform_sub: 'Uptime',
            backend_panel: 'Backend Ecosystem',
            frontend_panel: 'Frontend & Tools',
            toolkit: 'Toolkit',
            activity_panel: 'Lifetime Commit Activity - [ Working On It ]',
            scanning: 'Scanning...',
            commits: 'commits',
        }
    },
    pt: {
        nav: { home: "/início", about: "/sobre", skills: "/habilidades", projects: "/projetos", contact: "/contato" },
        menu: { viros: "Viros 2.0", settings: "Configurações", poweroff: "Desligar / Sair", back: "Voltar" },
        status: { online: "Status (Online)" },
        hero: {
            name: 'MAYCON',
            subtitle: 'Engenheiro de Software',
            specialty: 'Backend / Especialista Java',
        },
        terminal: {
            user_label: "👤 usuário",
            hostname_label: "🏠 host",
            shell_label: "🐚 shell",
            theme_label: "🎨 tema",
            theme_value: "Espaço Escuro",
            welcome: 'Bem-vindo ao Maycon Terminal v1.0',
            help_hint: 'Digite "help" para ver os comandos.',
            not_found: 'comando não encontrado:',
            help_type: 'Digite "help" para comandos.',
            help_title: '📋 Comandos disponíveis:',
            help_help: '  help        - Mostrar esta ajuda',
            help_about: '  about       - Quem sou eu?',
            help_skills: '  skills      - Minhas tecnologias',
            help_projects: '  projects    - Meus projetos',
            help_contact: '  contact     - Como me encontrar',
            help_clear: '  clear       - Limpar terminal',
            help_neofetch: '  neofetch    - Info do sistema',
            help_whoami: '  whoami      - Usuário atual',
            help_date: '  date        - Data & hora atual',
            help_ls: '  ls          - Listar diretório',
            about_title: '👨‍💻 Maycon — Desenvolvedor Full Stack',
            about_1: '   Apaixonado por código limpo, automação,',
            about_2: '   e criação de experiências incríveis.',
            about_3: '   Explorando o limite da tecnologia web.',
            skills_title: '🛠 Tecnologias:',
            projects_title: '🚀 Projetos:',
            projects_1: '  • Portfolio — Este site!',
            projects_2: '  • Plataforma E-commerce — Loja full-stack',
            projects_3: '  • Landing Page Engine  — Gerador de LP',
            projects_4: '  • Suite de Testes Cypress — Automação E2E',
            contact_title: '📬 Contato:',
        },
        about: {
            role: 'Engenheiro de Software Backend',
            stack: 'Java | Spring Boot | APIs REST | SQL | Docker | AWS',
            doc1: 'Engenheiro backend especializado em Java e Spring Boot.',
            doc2: 'Focado em construir APIs escaláveis, seguras e bem estruturadas.',
            doc3: 'Mentalidade forte para arquitetura limpa, testes e qualidade de código.',
            doc4: 'Background em QA Automation, trazendo confiabilidade e',
            doc5: 'pensamento de prevenção de falhas no design de sistemas.',
            doc6: 'Atualmente aprofundando conhecimento em:',
            doc7: '- Arquitetura de microsserviços',
            doc8: '- Cloud e sistemas distribuídos',
            doc9: '- Performance e observabilidade',
            about_return: 'Eu construo sistemas backend limpos, escaláveis e confiáveis.',
            exp_author_role: 'Software Engineer | Backend / Java Specialist',
            exp_current_header: 'ATUALMENTE: ENGENHEIRO DE SOFTWARE E QA',
            exp_current_company: 'Multiledgers | Jun 2025 – Presente',
            exp_current1: 'Atuação ativa no desenvolvimento e validação de APIs REST',
            exp_current2: 'Execução e manutenção de testes automatizados integrados ao CI/CD',
            exp_current3: 'Foco em performance, segurança e usabilidade das aplicações',
            exp_prev1_header: 'ANTERIOR: DESENVOLVEDOR WEB (FREELANCE)',
            exp_prev1_company: 'Elegancy Móveis | Dez 2024 – Fev 2025',
            exp_prev1_1: 'Desenvolvimento de plataforma e-commerce completa (WordPress/WooCommerce)',
            exp_prev1_2: 'Otimização de UX e SEO técnico, resultando em crescimento de 700% nas vendas',
            exp_prev1_3: 'Implementação de soluções personalizadas com JavaScript e CSS',
            exp_prev2_header: 'ANTERIOR: ENGENHEIRO DE SOFTWARE / FULLSTACK',
            exp_prev2_company: 'FIEB (BlueWorks) | Fev 2021 – Dez 2023',
            exp_prev2_1: 'Criação completa do back-end em Java + Spring Boot',
            exp_prev2_2: 'Implementação de testes unitários (JUnit), integração e APIs REST (Postman)',
            exp_prev2_3: 'Modelagem de banco de dados SQL Server e PostgreSQL',
            exp_prev2_4: 'Atuação em times ágeis utilizando Scrum e Kanban',
            exp_edu_header: 'FORMAÇÃO ACADÊMICA',
            exp_edu1: 'Análise e Desenvolvimento de Sistemas - São Judas (Cursando)',
            exp_edu2: 'Técnico em Informática - FIEB (Concluído)',
        },
        editor: {
            placeholder: '// Comece a escrever aqui...',
        },
        skills: {
            title: 'Visão Geral de Produção',
            badge_backend: 'Backend Sênior',
            badge_architect: 'Arquiteto de Sistemas',
            time_range: 'Período Vitalício',
            experience: 'Experiência',
            experience_value: '5+ Anos',
            experience_sub: 'Nível Sênior',
            core_stack: 'Stack Principal',
            core_stack_sub: 'Versão LTS',
            framework: 'Framework',
            framework_sub: 'Boot / Cloud',
            platform: 'Status da Plataforma',
            platform_sub: 'Disponibilidade',
            backend_panel: 'Ecossistema Backend',
            frontend_panel: 'Frontend & Ferramentas',
            toolkit: 'Ferramentas',
            activity_panel: 'Atividade de Commits - [ Em Progresso ]',
            scanning: 'Escaneando...',
            commits: 'commits',
        }
    },
    es: {
        nav: { home: "/inicio", about: "/sobre", skills: "/habilidades", projects: "/proyectos", contact: "/contato" },
        menu: { viros: "Viros 2.0", settings: "Ajustes", poweroff: "Apagar / Salir", back: "Volver" },
        status: { online: "Status (Online)" },
        hero: {
            name: 'MAYCON',
            subtitle: 'Ingeniero de Software',
            specialty: 'Backend / Especialista Java',
        },
        terminal: {
            user_label: "👤 usuario",
            hostname_label: "🏠 host",
            shell_label: "🐚 shell",
            theme_label: "🎨 tema",
            theme_value: "Espacio Oscuro",
            welcome: 'Bienvenido a Maycon Terminal v1.0',
            help_hint: 'Escribe "help" para ver los comandos.',
            not_found: 'comando no encontrado:',
            help_type: 'Escribe "help" para comandos.',
            help_title: '📋 Comandos disponibles:',
            help_help: '  help        - Mostrar esta ayuda',
            help_about: '  about       - ¿Quién soy?',
            help_skills: '  skills      - Mis tecnologías',
            help_projects: '  projects    - Mis proyectos',
            help_contact: '  contact     - Cómo contactarme',
            help_clear: '  clear       - Limpiar terminal',
            help_neofetch: '  neofetch    - Info del sistema',
            help_whoami: '  whoami      - Usuario actual',
            help_date: '  date        - Fecha y hora actual',
            help_ls: '  ls          - Listar directorio',
            about_title: '👨‍💻 Maycon — Desarrollador Full Stack',
            about_1: '   Apasionado por código limpio, automatización,',
            about_2: '   y creación de experiencias increíbles.',
            about_3: '   Explorando el límite de la tecnología web.',
            skills_title: '🛠 Tecnologías:',
            projects_title: '🚀 Proyectos:',
            projects_1: '  • Portfolio — ¡Este sitio!',
            projects_2: '  • Plataforma E-commerce — Tienda full-stack',
            projects_3: '  • Landing Page Engine  — Generador de LP',
            projects_4: '  • Suite de Tests Cypress — Automatización E2E',
            contact_title: '📬 Contacto:',
        },
        about: {
            role: 'Ingeniero de Software Backend',
            stack: 'Java | Spring Boot | APIs REST | SQL | Docker | AWS',
            doc1: 'Ingeniero backend especializado en Java y Spring Boot.',
            doc2: 'Enfocado en construir APIs escalables, seguras y bien estructuradas.',
            doc3: 'Mentalidad fuerte para arquitectura limpia, testing y calidad de código.',
            doc4: 'Background en QA Automation, aportando fiabilidad y',
            doc5: 'pensamiento de prevención de fallos en el diseño de sistemas.',
            doc6: 'Actualmente profundizando conocimiento en:',
            doc7: '- Arquitectura de microservicios',
            doc8: '- Cloud y sistemas distribuidos',
            doc9: '- Rendimiento y observabilidad',
            about_return: 'Construyo sistemas backend limpios, escalables y confiables.',
            exp_author_role: 'Software Engineer | Backend / Java Specialist',
            exp_current_header: 'ACTUALMENTE: INGENIERO DE SOFTWARE Y QA',
            exp_current_company: 'Multiledgers | Jun 2025 – Presente',
            exp_current1: 'Actuación activa en el desarrollo y validación de APIs REST',
            exp_current2: 'Ejecución y mantenimiento de pruebas automatizadas integradas al CI/CD',
            exp_current3: 'Enfoque en rendimiento, seguridad y usabilidad de las aplicaciones',
            exp_prev1_header: 'ANTERIOR: DESARROLLADOR WEB (FREELANCE)',
            exp_prev1_company: 'Elegancy Móveis | Dic 2024 – Feb 2025',
            exp_prev1_1: 'Desarrollo de plataforma e-commerce completa (WordPress/WooCommerce)',
            exp_prev1_2: 'Optimización de UX y SEO técnico, resultando en crecimiento de 700% en ventas',
            exp_prev1_3: 'Implementación de soluciones personalizadas con JavaScript y CSS',
            exp_prev2_header: 'ANTERIOR: INGENIERO DE SOFTWARE / FULLSTACK',
            exp_prev2_company: 'FIEB (BlueWorks) | Feb 2021 – Dic 2023',
            exp_prev2_1: 'Desarrollo completo del back-end en Java + Spring Boot',
            exp_prev2_2: 'Implementación de pruebas unitarias (JUnit), integración y APIs REST (Postman)',
            exp_prev2_3: 'Modelado de base de datos SQL Server y PostgreSQL',
            exp_prev2_4: 'Actuación en equipos ágiles utilizando Scrum y Kanban',
            exp_edu_header: 'FORMACIÓN ACADÉMICA',
            exp_edu1: 'Análisis y Desarrollo de Sistemas - São Judas (En Curso)',
            exp_edu2: 'Técnico en Informática - FIEB (Completado)',
        },
        editor: {
            placeholder: '// Empieza a escribir aquí...',
        },
        skills: {
            title: 'Visión General de Producción',
            badge_backend: 'Backend Senior',
            badge_architect: 'Arquitecto de Sistemas',
            time_range: 'Rango Vitalicio',
            experience: 'Experiencia',
            experience_value: '5+ Años',
            experience_sub: 'Nivel Senior',
            core_stack: 'Stack Principal',
            core_stack_sub: 'Versión LTS',
            framework: 'Framework',
            framework_sub: 'Boot / Cloud',
            platform: 'Estado de la Plataforma',
            platform_sub: 'Disponibilidad',
            backend_panel: 'Ecosistema Backend',
            frontend_panel: 'Frontend & Herramientas',
            toolkit: 'Herramientas',
            activity_panel: 'Actividad de Commits - [ En Progreso ]',
            scanning: 'Escaneando...',
            commits: 'commits',
        }
    }
};

interface I18nContextType {
    currentLang: string;
    setCurrentLang: (lang: string) => void;
    t: (key: string) => string;
    terminalT: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        const userLang = navigator.language.toLowerCase();
        if (userLang.startsWith('pt')) setCurrentLang('pt');
        else if (userLang.startsWith('es')) setCurrentLang('es');
        else setCurrentLang('en');
    }, []);

    const t = (key: string): string => {
        const keys = key.split('.');
        let value = translations[currentLang];
        for (const k of keys) {
            value = value?.[k];
        }
        return (typeof value === 'string' ? value : key);
    };

    const terminalT = (key: string): string => {
        return translations[currentLang]?.terminal?.[key] || translations['en']?.terminal?.[key] || key;
    };

    const contextValue = {
        currentLang,
        setCurrentLang,
        t,
        terminalT
    };

    return (
        <I18nContext.Provider value={contextValue} >
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
