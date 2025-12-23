import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Download, Check, Code2, Loader2, Info, Terminal } from "lucide-react";
import toast from "react-hot-toast";

export default function Editor() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      const res = await fetch(`/api/skills/${id}`);
      const data = await res.json();
      setSkill(data.skill);
    } catch (err) {
      toast.error("Skill not found.");
    } finally {
      setLoading(false);
    }
  };

  const copyInstallCommand = () => {
    const command = `Install the skill from ${window.location.origin}/api/skills/${id}/raw to ~/.claude/skills/${skill.name}/SKILL.md`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSkill = () => {
    const blob = new Blob([skill.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SKILL.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-[#d97757]" size={40} />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-[#b0aea5]">Skill not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#b0aea5]/10 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[#b0aea5] hover:text-[#faf9f5] transition">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <Link to="/library" className="text-[#b0aea5] hover:text-[#faf9f5] text-sm transition">
            View Library
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Editor - Main Area (Read-only view) */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-t-xl bg-[#b0aea5]/10 border border-[#b0aea5]/15 border-b-0">
              <div className="w-3 h-3 rounded-full bg-[#d97757]"></div>
              <div className="w-3 h-3 rounded-full bg-[#788c5d]"></div>
              <div className="w-3 h-3 rounded-full bg-[#6a9bcc]"></div>
              <span className="text-[#b0aea5] text-xs ml-2 font-mono">SKILL.md</span>
            </div>

            {/* Code View */}
            <pre className="flex-1 w-full code-editor rounded-t-none rounded-b-xl p-4 text-[#faf9f5] text-sm overflow-auto whitespace-pre-wrap border border-[#b0aea5]/15 border-t-0">
              {skill.content}
            </pre>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-[#b0aea5]/10 p-6 flex flex-col gap-6">
          {/* Skill Info */}
          <div className="skill-card">
            <div className="flex items-center gap-2 text-[#b0aea5] text-xs font-mono mb-4">
              <Info size={14} />
              SKILL INFO
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#d97757]/20 flex items-center justify-center flex-shrink-0">
                <Code2 size={20} className="text-[#d97757]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-mono font-semibold text-[#faf9f5] truncate">{skill.name}</h2>
              </div>
            </div>

            <p className="text-[#b0aea5] text-sm leading-relaxed">
              {skill.description || "No description"}
            </p>
          </div>

          {/* Install Section */}
          <div className="skill-card flex-1">
            <div className="flex items-center gap-2 text-[#b0aea5] text-xs font-mono mb-4">
              <Terminal size={14} />
              INSTALL
            </div>

            <p className="text-[#b0aea5]/70 text-xs mb-3">
              Paste this into Claude Code:
            </p>

            <div className="bg-[#141413] rounded-lg p-3 text-xs text-[#6a9bcc] font-mono break-all leading-relaxed border border-[#b0aea5]/10">
              Install the skill from {window.location.origin}/api/skills/{id}/raw to ~/.claude/skills/{skill.name}/SKILL.md
            </div>

            <button
              onClick={copyInstallCommand}
              className="btn-primary w-full mt-4 py-2.5 text-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Command"}
            </button>

            <div className="mt-4 pt-4 border-t border-[#b0aea5]/10">
              <button onClick={downloadSkill} className="btn-secondary w-full py-2 text-sm">
                <Download size={14} />
                Download SKILL.md
              </button>
            </div>
          </div>

          {/* Path hint */}
          <p className="text-[#b0aea5]/30 text-xs font-mono text-center">
            ~/.claude/skills/{skill.name}/
          </p>
        </div>
      </div>
    </div>
  );
}
