import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Library, Terminal, GitBranch, FileCode, Settings, X, Key, ExternalLink, FileText, TestTube, Shield, Zap, MessageSquare, Database, Cloud, Bug, Sparkles, AlertTriangle, Coffee, Skull } from "lucide-react";
import toast from "react-hot-toast";

// Claude Code Icon
const ClaudeCodeIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#d97757"/>
    <path d="M12 14h16M12 20h12M12 26h8" stroke="#141413" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="28" cy="26" r="3" fill="#141413"/>
  </svg>
);

// X (Twitter) Icon
const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Scrolling example skills
const scrollingExamples = [
  { icon: <GitBranch size={14} />, label: "Git Commits", category: "Dev" },
  { icon: <FileText size={14} />, label: "README Generator", category: "Docs" },
  { icon: <TestTube size={14} />, label: "Unit Tests", category: "Testing" },
  { icon: <Shield size={14} />, label: "Security Audit", category: "Security" },
  { icon: <MessageSquare size={14} />, label: "Code Review", category: "Dev" },
  { icon: <Database size={14} />, label: "Schema Designer", category: "Data" },
  { icon: <Cloud size={14} />, label: "Docker Config", category: "DevOps" },
  { icon: <Bug size={14} />, label: "Debug Helper", category: "Dev" },
  { icon: <FileCode size={14} />, label: "API Docs", category: "Docs" },
  { icon: <Zap size={14} />, label: "Performance", category: "Dev" },
  { icon: <Terminal size={14} />, label: "CLI Builder", category: "Dev" },
  { icon: <Sparkles size={14} />, label: "Refactor", category: "Dev" },
];

// Easter egg error messages
const funnyErrors = [
  { title: "Error 418", message: "I'm a teapot", icon: <Coffee size={16} /> },
  { title: "Error 666", message: "Have you tried turning it off and on again?", icon: <Skull size={16} /> },
  { title: "Warning", message: "This is fine.", icon: <AlertTriangle size={16} /> },
  { title: "Error 404", message: "Motivation not found", icon: <Bug size={16} /> },
  { title: "Fatal Error", message: "Task failed successfully!", icon: <Sparkles size={16} /> },
  { title: "Error 42", message: "The answer was here all along", icon: <Zap size={16} /> },
  { title: "Oops!", message: "You weren't supposed to click that", icon: <AlertTriangle size={16} /> },
  { title: "Error", message: "Works on my machine", icon: <Terminal size={16} /> },
];

// Confetti colors
const confettiColors = ['#d97757', '#6a9bcc', '#788c5d', '#faf9f5', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#f472b6', '#a78bfa'];

// Generate confetti particles once
const generateConfettiParticles = () => {
  return [...Array(100)].map((_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    size: Math.random() * 12 + 6,
    startX: 50 + (Math.random() - 0.5) * 10,
    startY: 50,
    endX: (Math.random() - 0.5) * 180,
    endY: Math.random() * 120 + 60,
    rotation: Math.random() * 1080 - 540,
    delay: Math.random() * 0.4,
    duration: 1.8 + Math.random() * 0.8,
    shape: i % 4, // 0: square, 1: rectangle, 2: circle, 3: triangle
  }));
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [useOwnKey, setUseOwnKey] = useState(false);
  const navigate = useNavigate();

  // Easter egg states
  const [chaosMode, setChaosMode] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [errorWindows, setErrorWindows] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mainWindowHidden, setMainWindowHidden] = useState(false);

  // Generate confetti particles once
  const confettiParticles = useMemo(() => generateConfettiParticles(), [showConfetti]);

  // Load settings from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("anthropic_api_key") || "";
    const savedUseOwn = localStorage.getItem("use_own_key") === "true";
    setApiKey(savedKey);
    setUseOwnKey(savedUseOwn);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("anthropic_api_key", apiKey);
    localStorage.setItem("use_own_key", useOwnKey.toString());
    toast.success("Settings saved!");
    setShowSettings(false);
  };

  // Easter egg: Red button click
  const handleRedButtonClick = (e) => {
    e.stopPropagation();

    if (!chaosMode) {
      setChaosMode(true);
      setGlitching(true);

      setTimeout(() => {
        setGlitching(false);
        setMainWindowHidden(true);
        spawnErrorWindows(3);
      }, 800);
    }
  };

  const spawnErrorWindows = (count) => {
    const newWindows = [];
    for (let i = 0; i < count; i++) {
      const error = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
      newWindows.push({
        id: Date.now() + i,
        ...error,
        x: Math.random() * 60 + 20,
        y: Math.random() * 50 + 20,
        rotation: (Math.random() - 0.5) * 20,
      });
    }
    setErrorWindows(prev => [...prev, ...newWindows]);
  };

  const handleErrorWindowClose = (id) => {
    setErrorWindows(prev => prev.filter(w => w.id !== id));
    const totalWindows = errorWindows.length;

    if (totalWindows >= 6) {
      endChaos();
    } else {
      setTimeout(() => spawnErrorWindows(2), 100);
    }
  };

  const endChaos = () => {
    setShowConfetti(true);
    setErrorWindows([]);

    setTimeout(() => {
      setShowConfetti(false);
      setChaosMode(false);
      setMainWindowHidden(false);
      toast.success("Nice try!", { icon: "🎉" });
    }, 2500);
  };

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) {
      toast.error("Please describe your skill in more detail.");
      return;
    }

    if (useOwnKey && !apiKey) {
      toast.error("Please add your API key in settings.");
      setShowSettings(true);
      return;
    }

    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (useOwnKey && apiKey) {
        headers["X-API-Key"] = apiKey;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Skill generated!");
        navigate(`/editor/${data.skill.id}`);
      }
    } catch (err) {
      toast.error("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    { icon: <GitBranch size={18} />, label: "Git Commits", prompt: "A skill that automatically writes conventional commit messages based on staged changes" },
    { icon: <FileCode size={18} />, label: "API Docs", prompt: "A skill that generates OpenAPI documentation from my code" },
    { icon: <Terminal size={18} />, label: "Test Writer", prompt: "A skill that writes unit tests for my functions" },
  ];

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#b0aea5]/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ClaudeCodeIcon size={32} />
            <span className="text-lg font-semibold text-[#faf9f5]">Skillbuilder</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#b0aea5]/10 rounded-lg transition"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <Link to="/library" className="btn-secondary text-sm py-2 px-4">
              <Library size={16} />
              Library
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d97757]/10 border border-[#d97757]/20 text-[#d97757] text-sm mb-6">
            <img src="/claude-logo.png" alt="Claude" className="w-4 h-4" />
            Powered by Claude
          </div>
          <h1 className="text-5xl font-bold text-[#faf9f5] mb-4 tracking-tight">
            Build Skills with AI
          </h1>
          <p className="text-[#b0aea5] text-lg max-w-xl mx-auto">
            Describe what your Claude Code skill should do.
            AI generates the SKILL.md – install with one click.
          </p>
          <a
            href="https://claude.com/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6a9bcc] hover:text-[#6a9bcc]/80 text-sm mt-4 transition"
          >
            Learn about Claude Skills
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Main Input Card */}
        <div
          className={`skill-card glow-strong transition-all duration-300 ${
            glitching ? "animate-pulse scale-95 opacity-50" : ""
          } ${mainWindowHidden ? "scale-0 opacity-0 h-0 overflow-hidden mb-0" : ""}`}
        >
          <div className="terminal-header -mx-6 -mt-6 mb-6 rounded-t-xl flex justify-between items-center pr-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRedButtonClick}
                className="terminal-dot bg-[#d97757] hover:bg-red-500 hover:scale-125 transition-all cursor-pointer"
                title="Close?"
              />
              <div className="terminal-dot bg-[#788c5d]"></div>
              <div className="terminal-dot bg-[#6a9bcc]"></div>
              <span className="text-[#b0aea5] text-xs ml-2 font-mono">
                {glitching ? "Not Responding..." : "new-skill.md"}
              </span>
            </div>
            {useOwnKey && apiKey && (
              <span className="text-[#788c5d] text-xs font-mono flex items-center gap-1">
                <Key size={10} />
                Using your key
              </span>
            )}
          </div>

          <label className="block text-sm font-medium text-[#b0aea5] mb-3">
            <span className="text-[#d97757] font-mono">{">"}</span> What should your skill do?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="I need a skill that automatically..."
            className="code-editor w-full h-36 rounded-lg p-4 text-[#faf9f5] placeholder-[#b0aea5]/50 resize-none text-sm"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              "Generate Skill"
            )}
          </button>
        </div>

        {/* Easter Egg Error Windows */}
        {errorWindows.map((window) => (
          <div
            key={window.id}
            className="fixed z-50 animate-bounce-in"
            style={{
              left: `${window.x}%`,
              top: `${window.y}%`,
              transform: `translate(-50%, -50%) rotate(${window.rotation}deg)`,
            }}
          >
            <div className="skill-card w-72 shadow-2xl border-red-500/30">
              <div className="terminal-header -mx-6 -mt-6 mb-4 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleErrorWindowClose(window.id)}
                    className="terminal-dot bg-[#d97757] hover:bg-red-500 hover:scale-125 transition-all cursor-pointer"
                  />
                  <div className="terminal-dot bg-[#788c5d]"></div>
                  <div className="terminal-dot bg-[#6a9bcc]"></div>
                  <span className="text-[#b0aea5] text-xs ml-2 font-mono">{window.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-red-400">{window.icon}</div>
                <p className="text-[#faf9f5] text-sm">{window.message}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Real Confetti Explosion */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {confettiParticles.map((particle) => (
              <div
                key={particle.id}
                className="absolute confetti-particle"
                style={{
                  left: `${particle.startX}%`,
                  top: `${particle.startY}%`,
                  width: particle.shape === 1 ? particle.size * 0.4 : particle.size,
                  height: particle.shape === 1 ? particle.size * 1.8 : particle.size,
                  backgroundColor: particle.color,
                  borderRadius: particle.shape === 2 ? '50%' : particle.shape === 3 ? '0' : '2px',
                  clipPath: particle.shape === 3 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                  '--end-x': `${particle.endX}vw`,
                  '--end-y': `${particle.endY}vh`,
                  '--rotation': `${particle.rotation}deg`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Quick Examples */}
        <div className={`mt-14 transition-all ${mainWindowHidden ? "mt-0" : ""}`}>
          <p className="text-[#b0aea5]/60 text-sm text-center mb-5 font-mono">// or try an example</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex.prompt)}
                className="skill-card text-left group"
              >
                <div className="flex items-center gap-2 text-[#d97757] mb-3">
                  {ex.icon}
                  <span className="font-medium text-sm">{ex.label}</span>
                </div>
                <p className="text-[#b0aea5] text-xs leading-relaxed line-clamp-2 group-hover:text-[#faf9f5] transition-colors">
                  {ex.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-14">
          <p className="text-[#b0aea5]/40 text-xs font-mono mb-3">
            Skills are saved to ~/.claude/skills/
          </p>
          <div className="flex items-center justify-center gap-4 text-[#b0aea5]/40 text-xs">
            <div className="flex items-center gap-2">
              <img src="/claude-logo.png" alt="Claude" className="w-3.5 h-3.5 opacity-40" />
              <span>Claude Code</span>
            </div>
            <span className="text-[#b0aea5]/20">•</span>
            <a
              href="https://claude.com/skills"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b0aea5] transition"
            >
              Docs
            </a>
            <span className="text-[#b0aea5]/20">•</span>
            <a
              href="https://x.com/lenny_enderle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#b0aea5] transition"
            >
              <XIcon size={12} />
              <span>lenny_enderle</span>
            </a>
            <span className="text-[#b0aea5]/20">•</span>
            <a
              href="https://buymeacoffee.com/lennyenderle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#d97757] transition"
            >
              <Coffee size={12} />
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </main>

      {/* Scrolling Examples Marquee */}
      <div className="border-t border-[#b0aea5]/10 overflow-hidden py-4 bg-[#141413]/50">
        <div className="marquee">
          <div className="marquee-content">
            {[...scrollingExamples, ...scrollingExamples].map((ex, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 mx-2 rounded-full bg-[#b0aea5]/5 border border-[#b0aea5]/10 text-[#b0aea5] text-xs whitespace-nowrap"
              >
                {ex.icon}
                <span>{ex.label}</span>
                <span className="text-[#b0aea5]/40">•</span>
                <span className="text-[#d97757]/60">{ex.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-[#141413]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="skill-card max-w-md w-full glow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#faf9f5] flex items-center gap-2">
                <Settings size={20} />
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[#b0aea5] hover:text-[#faf9f5] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-[#b0aea5] mb-2">
                  <Key size={14} />
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="code-editor w-full rounded-lg p-3 text-[#faf9f5] placeholder-[#b0aea5]/40 text-sm"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useOwnKey}
                  onChange={(e) => setUseOwnKey(e.target.checked)}
                  className="w-4 h-4 rounded border-[#b0aea5]/30 bg-[#141413] text-[#d97757] focus:ring-[#d97757]/50"
                />
                <span className="text-sm text-[#faf9f5]">Use my own API key</span>
              </label>

              <p className="text-xs text-[#b0aea5]/50">
                Your key is stored locally in your browser and never sent to our server.
              </p>

              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6a9bcc] hover:text-[#6a9bcc]/80 flex items-center gap-1 transition"
              >
                Get an API key from Anthropic
                <ExternalLink size={10} />
              </a>
            </div>

            <button onClick={saveSettings} className="btn-primary w-full mt-6">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
