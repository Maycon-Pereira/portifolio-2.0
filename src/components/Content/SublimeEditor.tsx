import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../hooks/useI18nHook';

interface SublimeEditorProps {
    fileId: string;
    fileName: string;
}

export const SublimeEditor = ({ fileId, fileName }: SublimeEditorProps) => {
    const { t } = useI18n();
    const [content, setContent] = useState<string>('');
    const [saved, setSaved] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(`editor_${fileId}`);
        if (stored) setContent(stored);
    }, [fileId]);

    // Sync scroll between textarea and line numbers
    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);
        setSaved(false);
        // Auto-save with small debounce feel
        localStorage.setItem(`editor_${fileId}`, val);
        setSaved(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            localStorage.setItem(`editor_${fileId}`, content);
            setSaved(true);
        }
        // Tab support
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newContent = content.substring(0, start) + '    ' + content.substring(end);
                setContent(newContent);
                localStorage.setItem(`editor_${fileId}`, newContent);
                // Restore cursor position
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 4;
                }, 0);
            }
        }
    };

    const lines = content.split('\n');
    const cursorLine = content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length;
    const cursorCol = (content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').pop()?.length || 0) + 1;

    return (
        <div
            className="w-full h-full flex flex-col bg-[#272822] overflow-hidden select-none"
            style={{ fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace" }}
        >
            {/* Editor Menu Bar */}
            <div className="h-7 bg-[#3c3c3c] flex items-center px-3 text-[11px] text-[#cccccc] gap-4 border-b border-[#252525] shrink-0">
                <span className="hover:text-white cursor-default">File</span>
                <span className="hover:text-white cursor-default">Edit</span>
                <span className="hover:text-white cursor-default">Selection</span>
                <span className="hover:text-white cursor-default">Find</span>
                <span className="hover:text-white cursor-default">View</span>
                <span className="hover:text-white cursor-default">Goto</span>
                <span className="hover:text-white cursor-default">Tools</span>
                <span className="hover:text-white cursor-default">Preferences</span>
                <span className="hover:text-white cursor-default">Help</span>
            </div>

            {/* Tabs */}
            <div className="h-8 bg-[#252526] flex items-end border-b border-[#1a1a1a] shrink-0">
                <div className="flex items-center gap-1 px-4 h-[30px] bg-[#272822] border-t-2 border-t-[#a6e22e] text-xs text-[#cccccc] rounded-t-sm">
                    <span className={saved ? 'text-[#a6e22e]' : 'text-[#e6db74]'}>●</span>
                    <span>{fileName}</span>
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Line Numbers */}
                <div
                    ref={lineNumbersRef}
                    className="w-14 bg-[#272822] border-r border-[#3e3d32] flex flex-col items-end pt-1 pr-3 text-[12px] text-[#75715e] overflow-hidden leading-[20px] shrink-0"
                    style={{ userSelect: 'none' }}
                >
                    {lines.map((_, i) => (
                        <div key={i} className="h-[20px] flex items-center shrink-0">{i + 1}</div>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    className="flex-1 bg-transparent text-[#f8f8f2] text-[13px] leading-[20px] p-1 pl-3 pt-1 resize-none outline-none border-none overflow-auto"
                    style={{
                        caretColor: '#f8f8f0',
                        tabSize: 4,
                    }}
                    value={content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    onClick={() => {/* trigger re-render for cursor pos */ }}
                    spellCheck={false}
                    autoFocus
                    placeholder={t('editor.placeholder')}
                />

                {/* Minimap */}
                <div className="w-20 bg-[#272822] border-l border-[#3e3d32] overflow-hidden opacity-30 hidden lg:block shrink-0">
                    <div className="p-1 text-[2px] leading-[3px] text-[#f8f8f2] whitespace-pre-wrap break-all pointer-events-none">
                        {content.slice(0, 3000)}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] flex items-center px-4 gap-4 text-[11px] text-white shrink-0" style={{ userSelect: 'none' }}>
                <span>Ln {cursorLine}, Col {cursorCol}</span>
                <span>Spaces: 4</span>
                <span>UTF-8</span>
                <span>Plain Text</span>
                <div className="flex-1" />
                <span className={saved ? 'text-white' : 'text-[#e6db74]'}>
                    {saved ? '✓ Saved' : '● Unsaved'}
                </span>
            </div>
        </div>
    );
};
