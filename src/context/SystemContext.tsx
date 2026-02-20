
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Terminal Types
export interface TerminalLine {
    type: 'command' | 'output';
    content: string | React.ReactNode;
    user?: string;
    host?: string;
}

interface SystemContextType {
    // Terminal State
    terminalHistory: TerminalLine[];
    terminalCommandHistory: string[];
    terminalHistoryIndex: number;
    terminalInput: string;
    setTerminalInput: (val: string) => void;
    addToTerminalHistory: (lines: (string | React.ReactNode)[], type?: 'command' | 'output', user?: string, host?: string) => void;
    addToCommandHistory: (cmd: string) => void;
    setTerminalHistoryIndex: (index: number) => void;
    clearTerminalHistory: () => void;

    // System Integration
    brightness: number;
    setBrightness: (val: number) => void;
    volume: number;
    setVolume: (val: number) => void;
    wifiEnabled: boolean;
    setWifiEnabled: (enabled: boolean) => void;
    airplaneMode: boolean;
    setAirplaneMode: (enabled: boolean) => void;
    isShaking: boolean;
    setIsShaking: (shaking: boolean) => void;

    // Language (proxied or state?) - We use useI18n hook, but let's keep it here if we need global toggle
    // For now we rely on useI18nHook for language, maybe we can sync it later if needed.
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider = ({ children }: { children: ReactNode }) => {
    // --- Terminal State ---
    const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
    const [terminalCommandHistory, setTerminalCommandHistory] = useState<string[]>([]);
    const [terminalHistoryIndex, setTerminalHistoryIndex] = useState(-1);
    const [terminalInput, setTerminalInput] = useState('');

    const addToTerminalHistory = useCallback((lines: (string | React.ReactNode)[], type: 'command' | 'output' = 'output', user?: string, host?: string) => {
        const newLines: TerminalLine[] = lines.map(line => ({
            type,
            content: line,
            user,
            host
        }));
        setTerminalHistory(prev => [...prev, ...newLines]);
    }, []);

    const addToCommandHistory = useCallback((cmd: string) => {
        setTerminalCommandHistory(prev => [...prev, cmd]);
    }, []);

    const clearTerminalHistory = useCallback(() => {
        setTerminalHistory([]);
    }, []);

    // --- System State ---
    const [brightness, setBrightness] = useState(100);
    const [volume, setVolume] = useState(80);
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [airplaneMode, setAirplaneMode] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    return (
        <SystemContext.Provider value={{
            terminalHistory,
            terminalCommandHistory,
            terminalHistoryIndex,
            terminalInput,
            setTerminalInput,
            addToTerminalHistory,
            addToCommandHistory,
            setTerminalHistoryIndex,
            clearTerminalHistory,
            brightness,
            setBrightness,
            volume,
            setVolume,
            wifiEnabled,
            setWifiEnabled,
            airplaneMode,
            setAirplaneMode,
            isShaking,
            setIsShaking
        }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) throw new Error('useSystem must be used within a SystemProvider');
    return context;
};
