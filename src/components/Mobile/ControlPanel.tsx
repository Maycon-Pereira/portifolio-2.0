import { X, Sun, Volume2, Wifi, Plane, Globe } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { useI18n } from '../../hooks/useI18nHook';
import { motion } from 'framer-motion';

interface ControlPanelProps {
    onClose: () => void;
}

export const ControlPanel = ({ onClose }: ControlPanelProps) => {
    const {
        brightness, setBrightness,
        volume, setVolume,
        wifiEnabled, setWifiEnabled,
        airplaneMode, setAirplaneMode
    } = useSystem();
    const { t, currentLang, setCurrentLang } = useI18n();

    return (
        <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 top-0 h-[65%] bg-black/90 backdrop-blur-xl rounded-b-3xl border-b border-white/10 p-6 z-40 overflow-y-auto"
        >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">{t('nav.about') === 'About' ? "Control Center" : "Centro de Controle"}</h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
                    <X size={18} />
                </button>
            </div>

            {/* Toggles */}
            <div className="flex gap-4 mb-8">
                <button
                    className={`flex-1 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors ${wifiEnabled ? 'bg-blue-600' : 'bg-white/10'}`}
                    onClick={() => setWifiEnabled(!wifiEnabled)}
                >
                    <Wifi size={24} />
                    <span className="text-xs font-medium">Wi-Fi</span>
                </button>
                <button
                    className={`flex-1 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors ${airplaneMode ? 'bg-orange-500' : 'bg-white/10'}`}
                    onClick={() => setAirplaneMode(!airplaneMode)}
                >
                    <Plane size={24} />
                    <span className="text-xs font-medium">{t('nav.about') === 'About' ? "Airplane" : "Avião"}</span>
                </button>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                        <Sun size={14} />
                        <span>{brightness}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                        <Volume2 size={14} />
                        <span>{volume}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white/5 rounded-2xl p-4 mt-6">
                <div className="flex items-center gap-3 mb-4 text-white/80">
                    <Globe size={16} />
                    <span className="text-sm font-medium">{t('nav.about') === 'About' ? "Language" : "Idioma"}</span>
                </div>
                <div className="flex gap-2">
                    {['en', 'pt', 'es'].map(lang => (
                        <button
                            key={lang}
                            onClick={() => setCurrentLang(lang as any)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-colors ${currentLang === lang ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
