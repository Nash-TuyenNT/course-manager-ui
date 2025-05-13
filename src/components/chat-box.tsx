'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { sendMessageToBot } from '@/lib/api';
import TypingIndicator from './ui/typing-indicator';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function ChatBox() {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<Message[]>([{
        id: Date.now(),
        text: "👋 Xin chào! Bạn cần giúp gì?",
        sender: 'bot',
    }]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!isAuthenticated) return null;


    const handleSend = async () => {
        setIsTyping(true);
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        try {
            const data = await sendMessageToBot(newMessage.text);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: 'bot',
                },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    text: 'Lỗi khi gửi tin nhắn. Vui lòng thử lại.',
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsTyping(false)
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-300 flex flex-col">
                    <div onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-center dark:bg-black cursor-pointer">
                        <h1 className="text-xl font-semibold">AI Assistant</h1>
                    </div>

                    <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm text-gray-700">
                        {messages.map((msg) => (
                            <pre
                                key={msg.id}
                                className={`whitespace-pre-wrap break-words text-sm p-4 rounded-md ${msg.sender === 'user' ? 'text-right bg-blue-100 self-end ml-auto' : 'bg-gray-100'
                                    }`}
                            >
                                {msg.text}
                            </pre>
                        ))}
                        {isTyping ? <TypingIndicator /> : null}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-2 border-t">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>
                </div>
            ) : (
                <Button className='cursor-pointer'
                    onClick={() => setIsOpen(true)}
                >
                    💬 Chat
                </Button>
            )}
        </div>
    );
}
