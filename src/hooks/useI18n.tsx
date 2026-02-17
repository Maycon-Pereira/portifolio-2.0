import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Translations = Record<string, any>;

const translations: Translations = {
    en: {
        nav: { about: "/about", skills: "/skills", projects: "/projects", contact: "/contact" },
        menu: { viros: "Viros 2.0", settings: "Settings", poweroff: "Power Off / Log Out", back: "Back" },
        status: { online: "Status (Online)" },
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
        }
    },
    pt: {
        nav: { about: "/sobre", skills: "/habilidades", projects: "/projetos", contact: "/contato" },
        menu: { viros: "Viros 2.0", settings: "Configurações", poweroff: "Desligar / Sair", back: "Voltar" },
        status: { online: "Status (Online)" },
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
        }
    },
    es: {
        nav: { about: "/sobre", skills: "/habilidades", projects: "/proyectos", contact: "/contato" },
        menu: { viros: "Viros 2.0", settings: "Ajustes", poweroff: "Apagar / Salir", back: "Volver" },
        status: { online: "Status (Online)" },
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
