import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";

/* ─── Utility ───────────────────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─── Shared Icon Button ─────────────────────────────────────────────────────── */
function IconBtn({ icon, title, className = "", onClick }) {
  return (
    <button onClick={onClick} title={title}
      className={`p-1.5 rounded hover:bg-secondary-container hover:text-on-surface transition-colors duration-150 ${className}`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}

/* ─── Assistant Action Row ───────────────────────────────────────────────────── */
function AssistantActions() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-1 pt-1 text-secondary">
      <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        title="Copy response"
        className="p-1.5 rounded hover:bg-secondary-container hover:text-on-surface transition-colors">
        <span className="material-symbols-outlined text-[18px]">{copied ? "check" : "content_copy"}</span>
      </button>
      <IconBtn icon="thumb_up"   title="Good response" />
      <IconBtn icon="thumb_down" title="Poor response" />
      <IconBtn icon="refresh"    title="Retry generation" />
    </div>
  );
}

/* ─── Code Block ─────────────────────────────────────────────────────────────── */
const CODE_SNIPPET = `useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);`;

function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-2 rounded-xl bg-[#1E1E1D] text-[#FAF9F5] border border-[#33312E] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#262523] border-b border-[#33312E]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#403E3A]" />
          <span className="font-mono text-[11px] text-[#A6A29A] tracking-wider uppercase">javascript</span>
        </div>
        <button onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#33312E] text-[#D8D4CA] text-xs transition-colors duration-150">
          <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[13px] text-[#FAF9F5] leading-relaxed">
        <code>
          <span className="text-[#D97757]">useEffect</span>{"(() => {\n"}
          {"  "}<span className="text-[#D97757]">const</span>{" subscription = props.source."}
          <span className="text-[#E6C687]">subscribe</span>{"();\n  "}
          <span className="text-[#D97757]">return</span>{" () => {\n    subscription."}
          <span className="text-[#E6C687]">unsubscribe</span>{"();\n  };\n}, [props.source]);"}
        </code>
      </pre>
    </div>
  );
}

/* ─── Chat Messages ──────────────────────────────────────────────────────────── */
function ChatMessages({ dark }) {
  const bubbleCls = dark
    ? "bg-[#2E2C29] text-[#F0EDE8] border border-[#3A3835]"
    : "bg-[#F0EEE6] text-[#1F1E1D] border border-[#E5E2D9]";
  const assistantText = dark ? "text-[#F0EDE8]" : "text-[#1F1E1D]";
  const inlineCode = dark
    ? "bg-[#2E2C29] text-[#E09F7D] border border-[#3A3835]"
    : "bg-[#F0EEE6] text-[#99462a] border border-[#E5E2D9]";

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-44">
      <div className="max-w-[720px] mx-auto flex flex-col space-y-9">

        {/* Turn 1 – User */}
        <div className="flex justify-end">
          <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] shadow-sm ${bubbleCls}`}>
            <p className="font-sans text-[15px] leading-relaxed">
              Can you explain how React useEffect works?
            </p>
          </div>
        </div>

        {/* Turn 2 – Assistant */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[#D97757] text-base leading-none">&#10022;</span>
            <span className="font-sans font-semibold text-[15px] tracking-tight" style={{color: dark ? "#F0EDE8" : "#1F1E1D"}}>Bipin</span>
            <span className="text-[11px] font-sans text-secondary">thought for 1.2s</span>
          </div>
          <p className={`font-serif text-[18px] leading-[1.875rem] ${assistantText}`}>
            The{" "}
            <code className={`font-mono text-[14px] px-1.5 py-0.5 rounded ${inlineCode}`}>useEffect</code>
            {" "}hook in React lets you synchronize a component with an external system—such as browser APIs, network requests, or third-party subscriptions. It tells React that your component needs to do something after rendering.
          </p>
          <p className={`font-serif text-[18px] leading-[1.875rem] ${assistantText}`}>
            It takes two arguments: an effect callback function and an optional dependency array. React executes the effect function after flushing DOM changes. If you provide dependencies, it only re-runs when those values change between renders.
          </p>
          <CodeBlock />
          <AssistantActions />
        </div>

        {/* Turn 3 – User */}
        <div className="flex justify-end">
          <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] shadow-sm ${bubbleCls}`}>
            <p className="font-sans text-[15px] leading-relaxed">
              What happens if I leave the dependency array empty?
            </p>
          </div>
        </div>

        {/* Turn 4 – Assistant */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[#D97757] text-base leading-none">&#10022;</span>
            <span className="font-sans font-semibold text-[15px] tracking-tight" style={{color: dark ? "#F0EDE8" : "#1F1E1D"}}>Bipin</span>
          </div>
          <p className={`font-serif text-[18px] leading-[1.875rem] ${assistantText}`}>
            Passing an empty dependency array (
            <code className={`font-mono text-[14px] px-1.5 py-0.5 rounded ${inlineCode}`}>[]</code>
            ) tells React that your effect does not depend on any props or state values, meaning it will execute exactly once when the component mounts.
          </p>
          <div className={`space-y-3 pl-1 font-serif text-[18px] ${assistantText} leading-[1.875rem]`}>
            {[
              ["Runs once on mount:", "The callback executes only after the initial render."],
              ["Cleanup runs on unmount:", "If the effect returns a cleanup function, it will only run when the component is being removed from the screen."],
              ["Ideal for one-time initialization:", "Perfect for setting up global event listeners, timer intervals, or fetching initial static configuration."],
            ].map(([bold, rest]) => (
              <div key={bold} className="flex items-start gap-3">
                <span className="text-[#D97757] text-sm mt-1 select-none">&#9679;</span>
                <div><strong className="font-sans font-semibold">{bold}</strong>{" "}{rest}</div>
              </div>
            ))}
          </div>
          <AssistantActions />
        </div>

      </div>
    </div>
  );
}

/* ─── Input Composer ─────────────────────────────────────────────────────────── */
function InputComposer({ dark, value, onChange, onSend }) {
  const containerCls = dark
    ? "bg-[#22201E] border border-[#2E2C29]"
    : "bg-white border border-[#E5E2D9] shadow-[0_2px_14px_-2px_rgba(31,30,29,0.06)]";
  const textCls = dark
    ? "text-[#F0EDE8] placeholder-[#8A8780]"
    : "text-[#1F1E1D] placeholder-[#73716B]";
  const actionCls = dark
    ? "text-[#8A8780] hover:text-[#F0EDE8] hover:bg-[#2E2C29]"
    : "text-[#73716B] hover:text-[#1F1E1D] hover:bg-[#F0EEE6]";
  const pillCls = dark
    ? "text-[#8A8780] hover:text-[#F0EDE8] hover:bg-[#2E2C29] border-[#2E2C29]"
    : "text-[#73716B] hover:text-[#1F1E1D] hover:bg-[#F0EEE6] border-[#E5E2D9]/60";
  const hintCls = dark ? "text-[#8A8780]" : "text-[#73716B]";

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div className={`rounded-2xl p-2.5 transition-all focus-within:ring-1 focus-within:ring-[#D97757] ${containerCls}`}>
      <textarea
        rows={2}
        value={value}
        onChange={onChange}
        onKeyDown={handleKey}
        placeholder="Reply to Bipin..."
        className={`w-full bg-transparent resize-none border-0 p-2 text-[15px] font-sans leading-relaxed focus:ring-0 focus:outline-none ${textCls}`}
      />
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button title="Attach file" className={`p-2 rounded-xl transition-colors ${actionCls}`}>
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <button className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[13px] font-sans border transition-colors ${pillCls}`}>
            <span className="text-[#D97757] text-xs">&#10022;</span>
            <span>Bipin 1.0</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-sans hidden sm:inline ${hintCls}`}>Shift + Return for new line</span>
          <button onClick={onSend} title="Send message"
            className="w-9 h-9 rounded-full bg-[#D97757] hover:bg-[#C26547] text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty / Welcome State ──────────────────────────────────────────────────── */
function EmptyState({ dark, userName, input, onInputChange, onSend }) {
  const bgCls      = dark ? "bg-[#1A1917]" : "bg-[#FAF9F5]";
  const headingCls = dark ? "text-[#F0EDE8]" : "text-[#1F1E1D]";
  const subCls     = dark ? "text-[#8A8780]" : "text-[#73716B]";
  const chipCls    = dark
    ? "bg-[#22201E] border border-[#2E2C29] text-[#8A8780] hover:border-[#D97757] hover:text-[#F0EDE8]"
    : "bg-white border border-[#E5E2D9] text-[#1F1E1D] hover:border-[#D97757] hover:bg-[#F0EEE6]";

  const chips = [
    { emoji: "📝", label: "Help me write" },
    { emoji: "💡", label: "Brainstorm ideas" },
    { emoji: "🔍", label: "Explain a concept" },
    { emoji: "🛠️", label: "Debug my code" },
  ];

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-4 pb-8 ${bgCls}`}>
      <div className="w-full max-w-[680px] flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className={`font-serif text-[2.25rem] leading-[2.75rem] tracking-tight ${headingCls}`}>
            {getGreeting()}, {(userName || "").split(" ")[0] || "there"}.
          </h2>
          <p className={`mt-2 font-sans text-[16px] ${subCls}`}>How can I help you today?</p>
        </div>
        <div className="w-full">
          <InputComposer dark={dark} value={input} onChange={onInputChange} onSend={onSend} />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {chips.map(({ emoji, label }) => (
            <button key={label}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[14px] font-sans transition-colors duration-150 ${chipCls}`}>
              <span>{emoji}</span><span>{label}</span>
            </button>
          ))}
        </div>
        <p className={`text-center text-[11px] font-sans ${subCls}`}>
          Bipin can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */
const TODAY_CHATS = [
  { icon: "chat_bubble", label: "React useEffect Hook guide", active: true },
  { icon: "terminal",    label: "Async runtime architectures" },
  { icon: "history_edu", label: "Drafting essay on epistemology" },
];
const WEEK_CHATS = [
  { icon: "chat_bubble", label: "TypeScript 5.4 release review" },
  { icon: "chat_bubble", label: "CSS Grid vs Flexbox deep dive" },
  { icon: "chat_bubble", label: "Tailwind token migration notes" },
  { icon: "archive",     label: "Archived Manuscripts" },
];

function Sidebar({ dark, onNewChat, userName }) {
  const bg          = dark ? "bg-[#22201E] border-r border-[#2E2C29]"              : "bg-[#F0EEE6] border-r border-[#E5E2D9]";
  const text        = dark ? "text-[#F0EDE8]"                                       : "text-[#1F1E1D]";
  const muted       = dark ? "text-[#8A8780]"                                       : "text-[#73716B]";
  const btnBg       = dark ? "bg-[#1A1917] border border-[#2E2C29] hover:bg-[#2E2C29]" : "bg-white border border-[#E5E2D9] hover:bg-[#F0EEE6] shadow-sm";
  const itemHover   = dark ? "hover:bg-[#2E2C29] hover:text-[#F0EDE8]"             : "hover:bg-[#E8E5DC] hover:text-[#1F1E1D]";
  const activeCls   = dark ? "bg-[rgba(217,119,87,0.15)] text-[#F0EDE8] border-l-2 border-[#D97757]" : "bg-[#FDE8DF] text-[#1F1E1D] border-l-2 border-[#D97757]";
  const section     = dark ? "text-[#8A8780]"                                       : "text-[#73716B]";
  const divider     = dark ? "border-t border-[#2E2C29]"                            : "border-t border-[#E5E2D9]";
  const profileHov  = dark ? "hover:bg-[#2E2C29]"                                  : "hover:bg-[#E8E5DC]";
  const badge       = dark ? "bg-[#2E2C29] text-[#8A8780] border border-[#3A3835]" : "bg-[#F0EEE6] text-[#73716B] border border-[#E5E2D9]";
  const kbdCls      = dark ? "bg-[#1A1917] border border-[#2E2C29] text-[#8A8780]" : "bg-[#F0EEE6] border border-[#E5E2D9] text-[#73716B]";

  const renderList = (chats) => chats.map(({ icon, label, active }) => (
    <a key={label} href="#" onClick={(e) => e.preventDefault()}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-sans transition-colors duration-150 active:scale-[0.98] ${
        active ? activeCls : `${muted} ${itemHover}`
      }`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="truncate flex-1">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />}
    </a>
  ));

  return (
    <aside className={`fixed top-0 bottom-0 left-0 w-64 md:w-72 h-full flex flex-col justify-between p-4 z-30 select-none ${bg}`}>
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[#D97757] text-xl leading-none">&#10022;</span>
            <div>
              <h1 className={`font-serif text-[1.25rem] font-medium tracking-tight leading-none ${text}`}>Bipin</h1>
              <p className={`text-[11px] font-sans mt-0.5 ${muted}`}>Literary Workspace</p>
            </div>
          </div>
          <button className={`p-1.5 rounded-lg transition-colors duration-150 ${muted} ${itemHover}`} title="Settings">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        {/* New chat */}
        <button onClick={onNewChat}
          className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition-colors duration-150 active:scale-[0.98] ${text} ${btnBg}`}>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#D97757] text-[19px]">edit_note</span>
            <span className="font-sans font-medium text-[13px]">Start New Thread</span>
          </div>
          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${kbdCls}`}>⌘K</span>
        </button>

        {/* Threads */}
        <div className="overflow-y-auto pr-1 -mr-1 flex flex-col gap-5 pt-1">
          <div className="flex flex-col gap-1">
            <div className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider font-medium ${section}`}>Today</div>
            {renderList(TODAY_CHATS)}
          </div>
          <div className="flex flex-col gap-1">
            <div className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider font-medium ${section}`}>Previous 7 days</div>
            {renderList(WEEK_CHATS)}
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className={`pt-3 flex flex-col gap-2 ${divider}`}>
        <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors duration-150 cursor-pointer ${profileHov}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-[#ffdbd0] border border-[#E5E2D9] flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXWHVkogqaq0_NM552WEwojT1rGMPGCoLk7rtoBPDsw9szyWno-nK0cOI81dP4jnLPq2zgKj2VEvg4itztQy6jnleEMNSjQfJZ4QLVa2rSnOqDOL__jns49MWOH02QP8FDH6WSXcy-lLaYX2vefBdWb7SZqAmbJnLgKzvvdzEaz_zNtB2Sag7lvRerzuo-nj5F14PpxnXJuc28D6UC1Ufcx-XYBEhdsmD2YBercVAw3g0lSgNMBFE9qlIhbWMY9ztajFVv5r2ErV0"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`font-sans font-semibold text-[14px] truncate ${text}`}>{userName}</span>
                <span className={`px-1.5 text-[10px] font-sans rounded border ${badge}`}>Free Plan</span>
              </div>
              <p className={`text-[11px] font-sans truncate ${muted}`}>alex.rivera@workspace.io</p>
            </div>
          </div>
          <button className={`${muted} p-1`}>
            <span className="material-symbols-outlined text-[19px]">more_horiz</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── Top Bar ────────────────────────────────────────────────────────────────── */
function TopBar({ dark, onToggleDark }) {
  const barBg    = dark ? "bg-[#1A1917]/95 border-b border-[#2E2C29]"           : "bg-[#FAF9F5]/95 border-b border-[#E5E2D9]";
  const pillBg   = dark ? "bg-[#22201E] border border-[#2E2C29] text-[#F0EDE8]" : "bg-[#F0EEE6] text-[#1F1E1D] border border-[#E5E2D9]";
  const actionCls = dark ? "text-[#8A8780] hover:bg-[#2E2C29] hover:text-[#F0EDE8]" : "text-[#73716B] hover:bg-[#F0EEE6] hover:text-[#1F1E1D]";

  return (
    <header className={`sticky top-0 w-full z-20 backdrop-blur-sm flex justify-between items-center px-6 py-2.5 ${barBg}`}>
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer text-[13px] font-sans ${pillBg}`}>
          <span className="w-2 h-2 rounded-full bg-[#D97757]" />
          <span className="font-medium">Bipin 1.0</span>
          <span className={dark ? "text-[#8A8780]" : "text-[#73716B]"}>(Sonnet 3.5)</span>
          <span className="material-symbols-outlined text-[16px]" style={{color: dark ? "#8A8780" : "#73716B"}}>expand_more</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onToggleDark} title={dark ? "Light mode" : "Dark mode"}
          className={`p-1.5 rounded-lg transition-colors duration-150 ${actionCls}`}>
          <span className="material-symbols-outlined text-[19px]">{dark ? "light_mode" : "dark_mode"}</span>
        </button>
        <button className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-sans transition-colors duration-150 ${actionCls}`}>
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span className="hidden sm:inline">Share</span>
        </button>
        <button className={`p-1.5 rounded-lg transition-colors duration-150 ${actionCls}`}>
          <span className="material-symbols-outlined text-[19px]">history</span>
        </button>
        <button className={`p-1.5 rounded-lg transition-colors duration-150 ${actionCls}`}>
          <span className="material-symbols-outlined text-[19px]">more_horiz</span>
        </button>
      </div>
    </header>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);
  const [dark, setDark] = useState(false);
  const [hasMessages, setHasMessages] = useState(true);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const userName = user?.name || "Alex Rivera";

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  useEffect(() => {
    if (hasMessages && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setHasMessages(true);
    setInput("");
  };

  const rootBg   = dark ? "bg-[#1A1917]" : "bg-[#FAF9F5]";
  const mainBg   = dark ? "bg-[#1A1917]" : "bg-[#FAF9F5]";
  const mutedTxt = dark ? "text-[#8A8780]" : "text-[#73716B]";
  const gradFrom = dark ? "from-[#1A1917] via-[#1A1917]/95" : "from-[#FAF9F5] via-[#FAF9F5]/95";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet" />

      <div className={`flex h-screen w-full overflow-hidden ${rootBg}`}>
        <Sidebar dark={dark} onNewChat={() => setHasMessages(false)} userName={userName} />
        <main className={`ml-64 md:ml-72 flex-1 flex flex-col h-full relative overflow-hidden ${mainBg}`}>
          <TopBar dark={dark} onToggleDark={() => setDark((d) => !d)} />

          {hasMessages ? (
            <>
              <ChatMessages dark={dark} />
              <div className={`absolute bottom-0 left-0 right-0 pointer-events-none pb-4 pt-10 bg-gradient-to-t ${gradFrom} to-transparent`}>
                <div className="max-w-[720px] mx-auto px-4 pointer-events-auto">
                  <InputComposer dark={dark} value={input} onChange={(e) => setInput(e.target.value)} onSend={handleSend} />
                  <p className={`text-center text-[11px] font-sans mt-2 ${mutedTxt}`}>
                    Bipin can make mistakes. Please double-check responses.
                  </p>
                </div>
              </div>
              <div ref={bottomRef} />
            </>
          ) : (
            <EmptyState dark={dark} userName={userName} input={input} onInputChange={(e) => setInput(e.target.value)} onSend={handleSend} />
          )}
        </main>
      </div>

      <style>{`
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal; font-size: 20px;
          line-height: 1; letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap; word-wrap: normal;
          direction: ltr; -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DBC1B9; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #88726C; }
      `}</style>
    </>
  );
};

export default Dashboard;
