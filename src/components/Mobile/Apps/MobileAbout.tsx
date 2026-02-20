
import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Search, MoreVertical, Pen, ArrowDownUp, ChevronLeft, Share2, Star } from 'lucide-react';
import { useWindowManager } from '../../../context/WindowContext';

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
    timestamp: number;
}

export const MobileAbout = () => {
    const { closeWindow, registerBackHandler, unregisterBackHandler } = useWindowManager();
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    // Load notes from localStorage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('mobile_notes_v3');
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse notes", e);
                initializeDefaultNotes();
            }
        } else {
            initializeDefaultNotes();
        }
    }, []);

    // Save notes whenever they change
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('mobile_notes_v3', JSON.stringify(notes));
        }
    }, [notes]);

    const initializeDefaultNotes = () => {
        const defaults: Note[] = [
            {
                id: '1',
                title: 'Text.txt',
                content: '...',
                date: '20:49',
                timestamp: Date.now() - 10000
            },
            {
                id: 'user-manual',
                title: 'User Manual',
                content: `# 🚀 Portfolio System v2.0 - User Manual

Navigate intuitively by clicking on the icons or, if you prefer a technical experience, use the integrated terminal.

## 🌟 Quick Start
1.  **Explore via UI**: Click on the Dock icons (left side).
2.  **Explore via Terminal**: Type commands to navigate and interact.

## 📟 Terminal Commands
The terminal is fully functional! Try these:
- \`help\` : List all available commands.
- \`ls\` : List directories and files.
- \`cd <dir>\` : Change directory (e.g., \`cd projects\`).
- \`cat <file>\` : Read a file (e.g., \`cat readme.md\`).
- \`whoami\` : Check current user.
- \`date\` : Show system date/time.
- \`neofetch\` : Display system specs.
- \`clear\` : Clear the screen.

## 📂 Applications
- **About Me (Atom Editor)**: My bio, experience, and education code.
- **Skills (Grafana)**: Real-time dashboard of my technical stack.
- **Projects (File Explorer)**: Browse my work. Use \`cat <project>\` in terminal for details!

## 💡 Pro Tips
- Try dragging windows around!
- Maximize/Minimize windows using the traffic lights.
- Type \`sudo rm -rf /\` for a surprise (at your own risk!).

*Built with React, TypeScript, and Love.*`,
                date: 'Feb 19',
                timestamp: Date.now()
            },
            {
                id: 'crazy-ideas',
                title: 'Crazy Ideas',
                content: `- Telepathic UI: Scroll using EEG brainwaves.\n- Retro OS Mode: Full Windows 95 skin.\n- Dream Catcher: Record sleep audio -> AI generated dream visuals.\n- Quantum Todo: Tasks exist in superposition until observed.`,
                date: 'Jan 15',
                timestamp: Date.now() - 1000000
            }
        ];
        setNotes(defaults);
    };

    const handleOpenNote = (note: Note) => {
        setCurrentNote(note);
        setView('editor');
    };

    const handleCreateNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: '',
            content: '',
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };
        setCurrentNote(newNote);
        setView('editor');
    };

    const handleSaveNote = () => {
        if (!currentNote) return;

        // If empty title and content, maybe discard? keeping simple for now.
        if (!currentNote.title.trim() && !currentNote.content.trim()) {
            setView('list');
            return;
        }

        const noteToSave = {
            ...currentNote,
            title: currentNote.title.trim() || 'No Title',
            timestamp: Date.now(),
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setNotes(prev => {
            const exists = prev.find(n => n.id === noteToSave.id);
            if (exists) {
                return prev.map(n => n.id === noteToSave.id ? noteToSave : n);
            } else {
                return [noteToSave, ...prev];
            }
        });

        setView('list');
        setCurrentNote(null);
    };

    const handleUpdateCurrentNote = (field: 'title' | 'content', value: string) => {
        if (!currentNote) return;
        setCurrentNote({ ...currentNote, [field]: value });
    };

    // Handle System Back Button
    useEffect(() => {
        const handleBack = () => {
            if (view === 'editor') {
                handleSaveNote(); // Save and go back to list
                return true; // Consume the event
            }
            return false; // Let default behavior happen (minimize/close)
        };

        registerBackHandler('about', handleBack);

        return () => {
            unregisterBackHandler('about');
        };
    }, [view, currentNote]);

    // --- Components ---

    const NoteCard = ({ note }: { note: Note }) => (
        <div
            onClick={() => handleOpenNote(note)}
            className="p-4 rounded-3xl flex flex-col justify-between h-44 bg-[#252525] active:opacity-80 transition-opacity overflow-hidden relative cursor-pointer"
        >
            <div className="flex-1 overflow-hidden pointer-events-none">
                <h3 className="text-white text-md font-bold mb-2 line-clamp-1">{note.title}</h3>
                <p className="text-[#999] text-xs leading-relaxed whitespace-pre-line line-clamp-5">
                    {note.content}
                </p>
            </div>
            <div className="text-[#777] text-[10px] mt-3 pointer-events-none">
                {note.date}
            </div>
        </div>
    );

    // --- Views ---

    if (view === 'editor' && currentNote) {
        return (
            <div className="w-full h-full bg-[#050505] text-white flex flex-col font-sans">
                {/* Editor Header */}
                <div className="h-14 flex items-center justify-between px-2 border-b border-[#222]">
                    <button onClick={handleSaveNote} className="p-2 text-white hover:bg-[#222] rounded-full transition-colors flex items-center gap-2">
                        <ChevronLeft size={24} />
                        <span className="text-sm">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-white hover:bg-[#222] rounded-full"><Share2 size={20} /></button>
                        <button className="p-2 text-white hover:bg-[#222] rounded-full"><Star size={20} /></button>
                        <button className="p-2 text-white hover:bg-[#222] rounded-full"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Editor Inputs */}
                <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Title"
                        value={currentNote.title}
                        onChange={(e) => handleUpdateCurrentNote('title', e.target.value)}
                        className="bg-transparent text-2xl font-bold placeholder-[#555] outline-none mb-4 w-full"
                    />
                    <textarea
                        placeholder="Start typing..."
                        value={currentNote.content}
                        onChange={(e) => handleUpdateCurrentNote('content', e.target.value)}
                        className="bg-transparent flex-1 text-sm text-[#ddd] leading-relaxed outline-none resize-none placeholder-[#333]"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white flex flex-col relative overflow-hidden font-sans">
            {/* Header Area */}
            <div className="px-4 py-4 pb-2">
                <div className="flex justify-between items-start mb-6">
                    {/* Back / Menu */}
                    <button onClick={() => closeWindow('about')} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>

                    {/* Top Actions */}
                    <div className="flex gap-4 items-center">
                        <FileText size={22} className="text-white/80" />
                        <Search size={22} className="text-white/80" />
                        <MoreVertical size={22} className="text-white/80" />
                    </div>
                </div>

                <h1 className="text-4xl font-normal mb-1">All notes</h1>
                <p className="text-[#777] text-sm">{notes.length} notes</p>
            </div>

            {/* Sort Bar */}
            <div className="px-5 py-2 flex justify-end items-center gap-1 text-[#777] text-xs mb-2">
                <span>Date modified</span>
                <ArrowDownUp size={12} />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={handleCreateNote}
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#7F3F34] rounded-full flex items-center justify-center shadow-lg hover:bg-[#8F4F44] transition-colors active:scale-90 z-10"
            >
                <Pen size={24} className="text-[#FFBeb0]" />
            </button>
        </div>
    );
};
