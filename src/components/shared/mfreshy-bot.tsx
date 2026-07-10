"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { MFreshyCharacter } from "@/components/shared/mfreshy-character";
import {
  type ChatMessage,
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGE,
  getBotResponse,
} from "@/lib/mfreshy-knowledge";
import { cn } from "@/lib/utils";

const GREETING_MESSAGES = [
  "Need help sourcing wholesale seafood? Ask me!",
  "Looking for verified food suppliers? I'm here!",
  "Confused about bulk pricing? Let's chat!",
  "Welcome to M Fresh — tap me to talk!",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function MFreshyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expression, setExpression] = useState<"happy" | "thinking" | "talking" | "wave">("happy");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % GREETING_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = { id: createId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setExpression("thinking");

    const delay = 600 + Math.min(trimmed.length * 20, 800);
    setTimeout(() => {
      const reply = getBotResponse(trimmed);
      setMessages((prev) => [...prev, { id: createId(), role: "bot", text: reply }]);
      setIsTyping(false);
      setExpression("talking");
      setTimeout(() => setExpression("happy"), 1200);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-[5.5rem] right-5 z-[110] flex flex-col items-end gap-3 sm:bottom-[6.5rem] sm:right-6">
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative max-w-[240px] rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg shadow-primary/8 sm:max-w-[260px]"
          >
            <button
              type="button"
              onClick={() => setShowBubble(false)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-light-gray text-muted hover:bg-border"
              aria-label="Dismiss message"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-xs font-medium leading-relaxed text-dark-gray sm:text-sm">
              {GREETING_MESSAGES[messageIndex]}
            </p>
            <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-border bg-surface" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="flex w-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/12 sm:w-[340px]"
            style={{ maxHeight: "min(520px, calc(100vh - 100px))" }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary to-primary-light px-4 py-3">
              <div className="flex items-center gap-2.5">
                <MFreshyCharacter size={40} expression={expression} />
                <div>
                  <p className="text-sm font-bold text-white">MFreshy</p>
                  <p className="text-[11px] text-white/75">
                    {isTyping ? "Typing..." : "Online · Marketplace guide"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-fresh-mint/50 p-3" style={{ minHeight: 280 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {msg.role === "bot" && (
                    <MFreshyCharacter size={28} expression="happy" className="mt-0.5" />
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-primary text-white"
                        : "rounded-tl-sm border border-border bg-surface text-dark-gray",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <MFreshyCharacter size={28} expression="thinking" className="mt-0.5" />
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="shrink-0 border-t border-border bg-surface px-3 py-2">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-primary/15 bg-primary-muted px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex shrink-0 items-center gap-2 border-t border-border bg-surface p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask MFreshy anything..."
                disabled={isTyping}
                className="flex-1 rounded-xl border border-border bg-fresh-mint px-3.5 py-2.5 text-sm text-dark-gray placeholder:text-muted focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger */}
      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) setExpression("wave");
        }}
        animate={isOpen ? {} : { rotate: [0, -4, 4, -3, 3, 0] }}
        transition={
          isOpen
            ? {}
            : { duration: 0.6, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg shadow-primary/20 ring-4 ring-surface transition-shadow hover:shadow-xl hover:shadow-primary/30 sm:h-16 sm:w-16"
        aria-label={isOpen ? "Close MFreshy Bot" : "Open MFreshy Bot"}
      >
        <MFreshyCharacter size={isOpen ? 44 : 48} expression={isOpen ? "wave" : "happy"} />
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white ring-2 ring-surface">
            !
          </span>
        )}
      </motion.button>
    </div>
  );
}
