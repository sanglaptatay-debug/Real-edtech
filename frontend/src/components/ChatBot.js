'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const WELCOME_MESSAGE = {
    role: 'assistant',
    content: "👋 Hi! I'm your Bengal Education Ventures assistant. Ask me anything about our courses in AI, Drone Technology, 3D Printing, Biotechnology and more!",
};

// ── Markdown-lite renderer (bold, code, newlines) ─────────────────────────────
function MessageText({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                        <code key={i} className="bg-black/10 dark:bg-white/10 px-1 rounded text-xs font-mono">
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return part.split('\n').map((line, j, arr) => (
                    <span key={`${i}-${j}`}>
                        {line}
                        {j < arr.length - 1 && <br />}
                    </span>
                ));
            })}
        </span>
    );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="flex items-end gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AI
            </div>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main ChatBot component ────────────────────────────────────────────────────
export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [unread, setUnread] = useState(0);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when opening, clear unread count
    useEffect(() => {
        if (isOpen) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMsg = { role: 'user', content: text };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const controller = new AbortController();
            abortRef.current = controller;

            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages
                        .filter(m => m.role !== 'system')
                        .map(m => ({ role: m.role, content: m.content })),
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Error ${res.status}`);
            }

            const data = await res.json();
            const assistantMsg = { role: 'assistant', content: data.reply };

            setMessages(prev => [...prev, assistantMsg]);

            // Show unread badge if chat is closed
            if (!isOpen) setUnread(prev => prev + 1);

        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message || 'Could not reach the chat service. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setError('');
    };

    return (
        <>
            {/* ── Floating Button ── */}
            <button
                onClick={() => setIsOpen(o => !o)}
                aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
                className={`
                    fixed bottom-6 right-6 z-50
                    w-14 h-14 rounded-full shadow-2xl
                    bg-gradient-to-br from-blue-600 to-purple-700
                    hover:from-blue-500 hover:to-purple-600
                    text-white flex items-center justify-center
                    transition-all duration-300 hover:scale-110 active:scale-95
                    focus:outline-none focus:ring-4 focus:ring-blue-400/50
                `}
            >
                {/* Unread badge */}
                {unread > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center text-white animate-pulse">
                        {unread}
                    </span>
                )}

                {/* Icon toggle */}
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90 scale-90' : 'rotate-0'}`}>
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </div>
            </button>

            {/* ── Chat Window ── */}
            <div
                className={`
                    fixed bottom-24 right-6 z-50
                    w-[min(380px,calc(100vw-1.5rem))]
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-700
                    rounded-2xl shadow-2xl
                    flex flex-col overflow-hidden
                    transition-all duration-300 origin-bottom-right
                    ${isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                    }
                `}
                style={{ height: '520px' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                        AI
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-semibold text-sm leading-tight">Student Guide</p>
                        <p className="text-blue-100 text-xs">Bengal Education Ventures</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Clear button */}
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        {/* Online dot */}
                        <div className="flex items-center gap-1 ml-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-200 text-xs">Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-end gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    AI
                                </div>
                            )}

                            {/* Bubble */}
                            <div
                                className={`
                                    max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-br-sm'
                                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                                    }
                                `}
                            >
                                <MessageText text={msg.content} />
                            </div>
                        </div>
                    ))}

                    {isLoading && <TypingIndicator />}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs rounded-xl px-3 py-2 mt-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about our courses…"
                            rows={1}
                            disabled={isLoading}
                            className="
                                flex-1 resize-none rounded-xl px-3 py-2.5 text-sm
                                bg-white dark:bg-gray-700
                                border border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-white
                                placeholder-gray-400 dark:placeholder-gray-500
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                disabled:opacity-50
                                max-h-28 overflow-y-auto
                            "
                            style={{ lineHeight: '1.4' }}
                            onInput={e => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="
                                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                bg-gradient-to-br from-blue-600 to-purple-700
                                hover:from-blue-500 hover:to-purple-600
                                text-white shadow-md
                                disabled:opacity-40 disabled:cursor-not-allowed
                                transition-all active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                            aria-label="Send message"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-gray-400 dark:text-gray-600 text-[10px] mt-1.5">
                        Powered by Llama 3 · Press Enter to send
                    </p>
                </div>
            </div>
        </>
    );
}
