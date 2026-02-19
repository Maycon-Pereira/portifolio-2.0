import { X, Sun, Volume2, Wifi, Plane } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

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

    return (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-black/90 backdrop-blur-xl rounded-b-3xl border-b border-white/10 p-6 z-40 transition-transform animate-in slide-in-from-top duration-300">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Centro de Controle</h2>
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
                    <span className="text-xs font-medium">Avião</span>
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
        </div>
    );
};
