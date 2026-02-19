export const MobileDateWidget = () => {
    // Hardcoded for now to match image, or use real date?
    // Image says: "sáb., 20 de jul. | 22°"
    // Let's use real date but format it similarly.
    const date = new Date();
    // Simplified date formatting to avoid Intl issues
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const weekday = date.toLocaleString('default', { weekday: 'short' });

    // Manual capitalization compatible with all environments where CSS capitalize might fail or if Intl is missing
    const formattedDate = `${weekday}, ${day} de ${month}`;

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
