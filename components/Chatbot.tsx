
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { MessageSquare, X, Send, Loader2, Sparkles, Minimize2, ExternalLink, Headset, Circle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Chat, GenerateContentResponse } from "@google/genai";
import { useLanguage } from "../LanguageContext";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

export const Chatbot: React.FC = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Support Status State: Active (Online)
  const [isSupportOnline, setIsSupportOnline] = useState(true);

  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset greeting when language or status changes
    setMessages([{ 
        id: '0', 
        role: 'model', 
        text: isSupportOnline ? t.chatbot.greeting : t.chatbot.offlineGreeting 
    }]);
  }, [lang, isSupportOnline, t]);

  useEffect(() => {
    // If Offline, initialize AI chat
    if (isOpen && !chatSessionRef.current && !isSupportOnline) {
      chatSessionRef.current = createChatSession();
    }
  }, [isOpen, isSupportOnline]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);

    // Logic: If Support is Online, Human Agent handles it. 
    if (isSupportOnline) {
        // Simulate human agent interaction
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: t.chatbot.agentResponse
            }]);
            setLoading(false);
            
            // Simulate follow up
            setTimeout(() => {
                 setMessages(prev => [...prev, { 
                    id: (Date.now() + 2).toString(), 
                    role: 'model', 
                    text: t.chatbot.agentFollowUp
                }]);
            }, 2000);
        }, 1000);
        return;
    }

    // AI Logic (Offline Mode)
    if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
    }

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks.map((chunk: any) => {
          if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
          return null;
      }).filter(Boolean);

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text || "I apologize, but I couldn't generate a response at this time.",
        sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Kết nối bị gián đoạn. Vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  // Allow toggling for demo purposes by clicking the status icon
  const toggleStatus = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newStatus = !isSupportOnline;
      setIsSupportOnline(newStatus);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: newStatus ? t.chatbot.statusOnline : t.chatbot.statusOffline
      }]);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[900] bg-[#00a2bd] hover:bg-[#008fa7] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] font-bold uppercase py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isSupportOnline ? t.chatbot.chatWithAgent : t.chatbot.askAi}
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-[900] bg-white dark:bg-[#101010] shadow-2xl border border-black/5 dark:border-white/10 transition-all duration-300 overflow-hidden flex flex-col ${
      isMinimized 
        ? 'bottom-6 right-6 w-72 h-20 rounded-t-lg rounded-b-none' 
        : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] h-full md:h-[600px] rounded-none md:rounded-xl'
    }`}>
      {/* Header */}
      <div 
        className="bg-[#00a2bd] p-4 flex justify-between items-start cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white">
                <Headset className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-xs">{t.chatbot.customerCare}</span>
            </div>
            
            {/* Status Indicator - Clickable to toggle for demo */}
            <div 
                className="flex items-center gap-2 ml-7 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors"
                onClick={toggleStatus}
                title="Click to toggle status (Demo)"
            >
                <div className={`w-2 h-2 rounded-full ${isSupportOnline ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-[10px] text-white/90 font-medium uppercase tracking-wider">
                    {isSupportOnline ? t.chatbot.online : t.chatbot.offline}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-white"><Minimize2 className="w-4 h-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
            {/* System Status Message */}
            {!isSupportOnline && (
                <div className="flex justify-center">
                    <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[10px] px-3 py-1 rounded-full border border-yellow-500/20 font-bold uppercase tracking-wide">
                        {t.chatbot.autoReply}
                    </div>
                </div>
            )}
            
            {isSupportOnline && (
                <div className="flex justify-center">
                    <div className="bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] px-3 py-1 rounded-full border border-green-500/20 font-bold uppercase tracking-wide flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        {t.chatbot.agentOnline}
                    </div>
                </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 self-end mb-1 ${isSupportOnline ? 'bg-[#00a2bd] text-white' : 'bg-purple-500 text-white'}`}>
                        {isSupportOnline ? <Headset className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    </div>
                )}
                <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#00a2bd] text-white rounded-br-none' 
                    : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-bl-none shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">{t.chatbot.sources}:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((s, i) => (
                          <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] text-[#00a2bd] hover:underline bg-[#00a2bd]/5 px-1.5 py-0.5 rounded">
                            <ExternalLink className="w-2 h-2" />
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center">
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${isSupportOnline ? 'bg-[#00a2bd] text-white' : 'bg-purple-500 text-white'}`}>
                    {isSupportOnline ? <Headset className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                </div>
                <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-200 dark:border-white/5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#101010] border-t border-black/5 dark:border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatbot.inputPlaceholder}
              className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-transparent focus:border-[#00a2bd] rounded px-3 py-2 text-sm focus:outline-none transition-all dark:text-white"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#00a2bd] text-white p-2 rounded hover:bg-[#008fa7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
