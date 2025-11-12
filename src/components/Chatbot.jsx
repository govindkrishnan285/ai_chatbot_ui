'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are a helpful medical assistant. 
When the user describes symptoms, identify the relevant specialists and recommend suitable doctors.
Do not provide diagnoses or treatment — only doctor recommendations.`
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi there! 👋 I'm your health assistant. Tell me your symptoms, and I’ll help you find the right doctor near you."
};

// --- Avatar Component ---
const Avatar = ({ role }) => {
  const color = role === 'assistant' ? 'bg-indigo-500' : 'bg-blue-500';
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${color}`}>
      {role === 'assistant' ? 'AI' : 'You'}
    </div>
  );
};

// --- Doctor Card Layout ---
const DoctorRecommendations = ({ content }) => {
  const sections = content.split('**Specialist:**').slice(1);
  if (!sections.length) return null;

  return (
    <div className="w-full space-y-4">
      <p className="text-gray-700 dark:text-gray-300 font-medium">
        🩺 Here are some doctor recommendations based on your symptoms:
      </p>

      {sections.map((section, index) => {
        const [specialist, ...lines] = section.trim().split('\n').filter(Boolean);
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Specialist: {specialist.trim()}
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {lines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Message Renderer ---
const Message = ({ role, content }) => {
  const isUser = role === 'user';
  const isDoctorResponse = content.includes('**Specialist:**');

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Avatar role="assistant" />}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-2xl max-w-xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none shadow'
        }`}
      >
        {isDoctorResponse ? (
          <DoctorRecommendations content={content} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        )}
      </motion.div>

      {isUser && <Avatar role="user" />}
    </div>
  );
};

// --- Typing Indicator ---
const TypingIndicator = () => (
  <div className="flex items-center space-x-2">
    <Avatar role="assistant" />
    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
      <div className="flex space-x-1">
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  </div>
);

// --- MAIN CHATBOT COMPONENT ---
export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/medquery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [SYSTEM_PROMPT, ...updatedMessages] })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const aiResponse = { role: 'assistant', content: data.answer };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error contacting API:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
      {/* --- Header --- */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-t-3xl shadow">
        <h2 className="text-2xl font-semibold">💬 Medical Assistant Chat</h2>
        <p className="text-sm opacity-80">Informational only — not a substitute for professional care.</p>
      </div>

      {/* --- Chat Content --- */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <Message key={i} role={msg.role} content={msg.content} />
          ))}
          {isLoading && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input --- */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-800 border-t flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-11 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition disabled:bg-gray-400"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
