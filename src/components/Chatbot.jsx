// /src/components/Chatbot.js

'use client';

import { useState, useEffect, useRef } from 'react';

// Define the system prompt once, outside of the component
const SYSTEM_PROMPT = {
  role: 'system',
  content: 'You are a helpful medical assistant. You provide concise and accurate information based on the user\'s questions. Do not provide medical advice, just information.'
};

// The initial welcome message from the assistant
const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm here to provide information on medical topics. How can I help you today?"
};

// --- Helper Components for a Cleaner UI ---

// Avatar Component
const Avatar = ({ role }) => {
  const avatarClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold";
  if (role === 'assistant') {
    return <div className={`${avatarClasses} bg-indigo-500`}>AI</div>;
  }
  return <div className={`${avatarClasses} bg-blue-500`}>You</div>;
};

// Loading "Typing" Indicator
const TypingIndicator = () => (
    <div className="flex items-center space-x-2">
      <Avatar role="assistant" />
      <div className="bg-gray-200 p-3 rounded-lg">
        <div className="flex items-center justify-center space-x-1">
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
);

// Message Bubble Component
const Message = ({ role, content }) => {
  const isUser = role === 'user';
  return (
      <div className={`flex items-end space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <Avatar role="assistant" />}
        <div
            className={`px-4 py-2 rounded-xl max-w-lg ${
                isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        {isUser && <Avatar role="user" />}
      </div>
  );
};


// --- Main Chatbot Component ---

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to automatically scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handler for clicking on example prompts
  const handlePromptClick = (promptText) => {
    setInput(promptText);
    // Focus the input field to encourage the user to send the message
    document.querySelector('.chat-input')?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/medquery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [SYSTEM_PROMPT, ...updatedMessages]
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.answer };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error("Error contacting the API:", error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800">Medical Assistant Chat</h2>
          <p className="text-sm text-gray-500">This is for informational purposes only.</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} />
          ))}

          {/* Show example prompts only at the beginning of the conversation */}
          {messages.length === 1 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-4">Or try one of these examples:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => handlePromptClick("What are the symptoms of diabetes?")} className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Symptoms of diabetes
                  </button>
                  <button onClick={() => handlePromptClick("How does aspirin work?")} className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    How does aspirin work?
                  </button>
                  <button onClick={() => handlePromptClick("Explain the different types of vaccines.")} className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Types of vaccines
                  </button>
                </div>
              </div>
          )}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
                className="chat-input flex-1 w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a medical question..."
                disabled={isLoading}
                autoFocus
            />
            <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-11 h-11 bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
  );
}