"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Send } from "lucide-react";
import { AiOutlineMedicineBox } from "react-icons/ai";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState({ width: 420, height: 520 });

  const fileInputRef = useRef(null);
  const endRef = useRef(null);
  const resizableRef = useRef(null);
  const isResizing = useRef(false);


  useEffect(() => {
    const move = (e) => {
      if (!isResizing.current) return;
      const box = resizableRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(320, e.clientX - box.left),
        height: Math.max(320, e.clientY - box.top),
      });
    };
    const stop = () => (isResizing.current = false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
  }, []);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", type: "text", content: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/medquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      setMessages((p) => [
        ...p,
        { sender: "bot", type: "text", content: data.answer || "⚠️ Something went wrong." },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { sender: "bot", type: "text", content: "❌ Error contacting server." },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      setMessages((p) => [
        ...p,
        {
          sender: "user",
          type: "file",
          content: URL.createObjectURL(file),
          fileType: file.type,
          fileName: file.name,
        },
      ]);
    });
  };


  const handleMicInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported in this browser");
    const rec = new SR();
    rec.lang = "en-US";
    rec.start();
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
  };


  const TypingIndicator = () => (
    <div className="flex justify-start mb-2 px-3">
      <div className="p-3 rounded-2xl bg-blue-100 text-blue-900 max-w-xs">
        Bot is typing…
      </div>
    </div>
  );


  const ChatMessage = ({ message }) => {
    const isUser = message.sender === "user";
    const bubble = isUser
      ? "bg-blue-50 text-blue-900 rounded-br-none"
      : "bg-blue-600 text-white rounded-bl-none";

    return (
      <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} px-3 mb-2`}>
        {!isUser && (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
            💬
          </div>
        )}
        <div
          style={{ borderRadius: "18px" }}
          className={`relative max-w-xs px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${bubble}`}
        >
          {message.type === "file" ? (
            message.fileType?.startsWith("image/") ? (
              <img src={message.content} alt={message.fileName} className="max-w-full rounded-lg" />
            ) : (
              <a href={message.content} download={message.fileName} className="underline">
                {message.fileName}
              </a>
            )
          ) : (
            message.content
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 text-blue-900 m-3">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >

        <div className="relative w-12 h-12 transition-opacity duration-300">
          <AiOutlineMedicineBox size={48} className="text-blue-600" />
        </div>


        <div
          ref={resizableRef}
          style={{
            width: size.width,
            height: isHovered ? size.height : 0,
            opacity: isHovered ? 1 : 0,
            right: "0px",
            bottom: "48px",
          }}
          className={`absolute transition-all duration-300 ease-in-out transform rounded-2xl shadow-2xl flex flex-col border border-blue-300 bg-white ${
            !isHovered && "pointer-events-none"
          }`}
        >
          <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span role="img" aria-label="chat">💬</span> Chat Assistant
            </h2>
            <span className="text-blue-100 text-sm">● Online</span>
          </header>

          <section className="flex-1 overflow-y-auto px-2 py-4 bg-blue-50">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
            {isBotTyping && <TypingIndicator />}
            <div ref={endRef} />
          </section>

          <form
            onSubmit={sendMessage}
            className="p-3 flex gap-2 border-t border-blue-200 bg-blue-50"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button type="button" onClick={handleMicInput} className="text-blue-600">
              <Mic size={20} />
            </button>
            <input
              className="flex-1 rounded-full border border-blue-300 bg-white text-blue-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="text-blue-600 font-semibold px-3">
              <Send size={20} />
            </button>
          </form>

          <div
            onMouseDown={() => (isResizing.current = true)}
            className="h-2 bg-blue-200 cursor-ns-resize"
          />
        </div>
      </div>
    </div>
  );
}
