import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const AssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I’m the Codetech Assistant. Ask me anything about learning, courses, or using the platform." }]);
  const user = getUser();
  const suggestions = useMemo(() => user?.role === "instructor"
    ? ["How do I create a course?", "How do I add a lesson?", "How do meetings work?"]
    : user?.role === "admin"
      ? ["What can I manage as an admin?", "Where are instructor reports?", "How do I view students?"]
      : ["How do I buy a course?", "Where is My Learning?", "How do I request a meeting?"], [user?.role]);

  const sendMessage = async (message = input) => {
    const text = message.trim();
    if (!text || sending || !user) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    try {
      const { data } = await api.post("/api/assistant/chat", { messages: nextMessages.slice(-8) });
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error.response?.data?.message || "I’m unable to answer right now. Please try again shortly." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ duration: 0.2 }} className="mb-4 flex h-[min(38rem,calc(100vh-8rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900">
            <header className="flex items-center justify-between bg-gradient-to-br from-blue-700 to-indigo-700 px-5 py-4 text-white">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Bot className="h-5 w-5" /></span><div><p className="font-semibold">Codetech Assistant</p><p className="text-xs text-blue-100">Here to help you navigate</p></div></div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close assistant"><X className="h-5 w-5" /></button>
            </header>
            {!user ? (
              <div className="grid flex-1 place-items-center p-6 text-center"><div><Sparkles className="mx-auto h-8 w-8 text-blue-600" /><h2 className="mt-4 text-lg font-semibold">Sign in to chat</h2><p className="mt-2 text-sm leading-6 text-slate-500">The assistant gives role-aware help for your Codetech account.</p><Link to="/login" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Sign in</Link></div></div>
            ) : <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-950/40">
                {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-2.5 text-sm leading-6 text-white" : "mr-5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}>{message.content}</div>)}
                {sending && <div className="mr-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"><LoaderCircle className="h-4 w-4 animate-spin" />Thinking…</div>}
              </div>
              {messages.length === 1 && <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 dark:border-slate-800">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-left text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">{suggestion}</button>)}</div>}
              <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800"><input value={input} onChange={(event) => setInput(event.target.value)} maxLength="1000" placeholder="Ask about Codetech…" className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800" /><button disabled={!input.trim() || sending} className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send className="h-4 w-4" /></button></form>
            </>}
          </motion.section>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((value) => !value)} className="group grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/35 transition hover:scale-105 hover:bg-blue-700" aria-label={open ? "Close Codetech Assistant" : "Open Codetech Assistant"}>{open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 transition group-hover:scale-110" />}</button>
    </div>
  );
};

export default AssistantWidget;
