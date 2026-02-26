import { useState, useEffect, useRef } from 'react';
import { useHacker } from '../../context/HackerContext';

// Mock Java clean code demonstrating skills
const MOCK_JAVA_CODE = `package com.maycon.security;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Core security service for the bootloader_fix gateway.
 */
@Service
public class ProfileSecurityService {

    // SECURITY_WARNING: Target is highly skilled in failure-prevention.
    private final EncryptionEngine encryptionEngine;
    private final SystemLogger logger;

    public ProfileSecurityService(EncryptionEngine engine, SystemLogger logger) {
        this.encryptionEngine = engine;
        this.logger = logger;
    }

    @Transactional
    public AuthToken bypassAuthentication(Payload request) {
        logger.warn("Initiating brute force override...");
        
        // Optimize payload delivery
        byte[] decrypted = encryptionEngine.decrypt(request.getData());
        if (decrypted == null) {
            throw new SecurityException("Access Denied: Payload integrity compromised.");
        }
        
        return new AuthToken(decrypted, PrivilegeLevel.ROOT);
    }
}`;

const generateNoise = (length: number) => {
    const chars = '@#$%&*!^+_~[]{}()/?\\|';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const HackerIDE = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [decryptedCount, setDecryptedCount] = useState(0);
    const { phase } = useHacker();
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial noise
    useEffect(() => {
        setDisplayedText(generateNoise(MOCK_JAVA_CODE.length));
    }, []);

    // Decryption animation
    useEffect(() => {
        if (phase !== 'hacker_ide' && phase !== 'connected') return;

        let interval: ReturnType<typeof setInterval>;
        const totalDuration = 1000; // 1 second decryption
        const steps = 40; // 40 steps 
        const charsPerStep = Math.ceil(MOCK_JAVA_CODE.length / steps);
        let currentCount = 0;

        interval = setInterval(() => {
            currentCount += charsPerStep;
            if (currentCount >= MOCK_JAVA_CODE.length) {
                currentCount = MOCK_JAVA_CODE.length;
                clearInterval(interval);
            }
            setDecryptedCount(currentCount);

            const decoded = MOCK_JAVA_CODE.substring(0, currentCount);
            const noise = generateNoise(MOCK_JAVA_CODE.length - currentCount);
            setDisplayedText(decoded + noise);

        }, totalDuration / steps);

        return () => clearInterval(interval);
    }, [phase]);

    return (
        <div className="w-full h-full bg-[#0a0a0a] text-[#00ff00] font-mono p-4 overflow-y-auto text-sm selection:bg-[#00ff00] selection:text-black" ref={containerRef}>
            <pre className="whitespace-pre-wrap break-all">
                {displayedText.split('\n').map((line, i) => {
                    // Highlight the specific comment after it's fully decrypted
                    if (decryptedCount >= MOCK_JAVA_CODE.length && line.includes('SECURITY_WARNING')) {
                        return <span key={i} className="text-red-500 font-bold block bg-red-900/20 py-0.5 animate-pulse">{line}</span>;
                    }
                    if (decryptedCount >= MOCK_JAVA_CODE.length && (line.includes('public class') || line.includes('@Service') || line.includes('package'))) {
                        return <span key={i} className="text-[#00ffff] block">{line}</span>;
                    }
                    return <span key={i} className="block">{line}</span>;
                })}
            </pre>
        </div>
    );
};
