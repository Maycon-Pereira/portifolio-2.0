import { useI18n } from '../../hooks/useI18nHook';

export const MobileDateWidget = () => {
    const { currentLang } = useI18n();
    const date = new Date();

    // Format based on language
    const langCode = currentLang === 'pt' ? 'pt-BR' : currentLang === 'es' ? 'es-ES' : 'en-US';

    const day = date.getDate();
    const month = date.toLocaleString(langCode, { month: 'short' });
    const weekday = date.toLocaleString(langCode, { weekday: 'short' });

    let formattedDate = `${weekday}, ${month} ${day}`;
    if (currentLang === 'pt' || currentLang === 'es') {
        formattedDate = `${weekday}, ${day} de ${month}`;
    }

    // Mock weather
    const weather = "22°";

    return (
        <div className="flex flex-col items-center justify-center mt-12 mb-8 text-white/90 drop-shadow-md">
            <div className="text-xl font-medium tracking-wide flex items-center gap-2">
                <span className="capitalize">{formattedDate}</span>
                <span className="opacity-60">|</span>
                <span className="flex items-center gap-1">
                    ☁️ {weather}
                </span>
            </div>
        </div>
    );
};
