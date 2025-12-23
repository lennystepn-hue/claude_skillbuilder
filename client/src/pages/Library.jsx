import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, Loader2, Package, Code2, FolderCode, FileText, TestTube, Shield, Database, Cloud, Check, Download, Copy, X } from "lucide-react";
import toast from "react-hot-toast";

const categoryIcons = {
  Dev: <Code2 size={12} />,
  Docs: <FileText size={12} />,
  Testing: <TestTube size={12} />,
  Security: <Shield size={12} />,
  DevOps: <Cloud size={12} />,
  Data: <Database size={12} />,
};

const categoryColors = {
  Dev: "bg-[#d97757]/20 text-[#d97757]",
  Docs: "bg-[#6a9bcc]/20 text-[#6a9bcc]",
  Testing: "bg-[#788c5d]/20 text-[#788c5d]",
  Security: "bg-red-500/20 text-red-400",
  DevOps: "bg-purple-500/20 text-purple-400",
  Data: "bg-yellow-500/20 text-yellow-400",
};

export default function Library() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const selectAll = () => {
    setSelected(new Set(filtered.map(s => s.id)));
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {}
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch (err) {
      textArea.remove();
      return false;
    }
  };

  const copyInstallCommands = async () => {
    const selectedSkills = skills.filter(s => selected.has(s.id));
    const commands = selectedSkills.map(s =>
      `Install the skill from ${window.location.origin}/api/skills/${s.id}/raw to ~/.claude/skills/${s.name}/SKILL.md`
    ).join("\n\n");

    const success = await copyToClipboard(commands);
    if (success) {
      toast.success(`Copied ${selected.size} install commands!`);
    } else {
      toast.error("Copy failed");
    }
  };

  const downloadAllAsZip = async () => {
    setDownloading(true);
    try {
      // Dynamically import JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Fetch all selected skills
      const selectedSkills = skills.filter(s => selected.has(s.id));

      for (const skill of selectedSkills) {
        const res = await fetch(`/api/skills/${skill.id}`);
        const data = await res.json();
        // Create folder structure: skill-name/SKILL.md
        zip.file(`${skill.name}/SKILL.md`, data.skill.content);
      }

      // Generate and download
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `claude-skills-${selected.size}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${selected.size} skills!`);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  // Get unique categories
  const categories = ["All", ...new Set(skills.map(s => s.category).filter(Boolean))];

  const filtered = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group skills by category for display
  const groupedSkills = {};
  filtered.forEach(skill => {
    const cat = skill.category || "Other";
    if (!groupedSkills[cat]) groupedSkills[cat] = [];
    groupedSkills[cat].push(skill);
  });

  return (
    <div className="min-h-screen gradient-bg">
      {/* Nav */}
      <nav className="border-b border-[#b0aea5]/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[#b0aea5] hover:text-[#faf9f5] transition">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#6a9bcc] flex items-center justify-center">
              <FolderCode size={14} className="text-[#141413]" />
            </div>
            <span className="font-semibold text-[#faf9f5]">Skill Library</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0aea5]/50" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="code-editor w-full py-3 pl-12 pr-4 rounded-lg text-[#faf9f5] placeholder-[#b0aea5]/40 text-sm"
          />
        </div>

        {/* Category Filter + Select All */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.length > 1 && categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#d97757] text-[#141413]"
                  : "bg-[#b0aea5]/10 text-[#b0aea5] hover:bg-[#b0aea5]/20"
              }`}
            >
              {cat}
            </button>
          ))}

          {filtered.length > 0 && (
            <button
              onClick={selected.size === filtered.length ? clearSelection : selectAll}
              className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium bg-[#b0aea5]/10 text-[#b0aea5] hover:bg-[#b0aea5]/20 transition-all"
            >
              {selected.size === filtered.length ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#d97757]" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#b0aea5]/10 flex items-center justify-center mx-auto mb-4">
              <Package className="text-[#b0aea5]/30" size={32} />
            </div>
            <p className="text-[#b0aea5] text-lg mb-2">
              {skills.length === 0 ? "No skills published yet" : "No skills found"}
            </p>
            <p className="text-[#b0aea5]/50 text-sm mb-6 font-mono">
              {skills.length === 0 ? "// be the first to create one" : "// try a different search"}
            </p>
            <Link to="/" className="btn-primary inline-flex">
              <Sparkles size={18} />
              Create Skill
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#b0aea5]/50 text-sm mb-6 font-mono">
              // {filtered.length} skill{filtered.length !== 1 ? "s" : ""} available
              {selected.size > 0 && <span className="text-[#d97757]"> • {selected.size} selected</span>}
            </p>

            {/* Grouped by Category */}
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${categoryColors[category] || "bg-[#b0aea5]/20 text-[#b0aea5]"}`}>
                    {categoryIcons[category] || <Code2 size={12} />}
                  </div>
                  <h2 className="text-sm font-semibold text-[#faf9f5]">{category}</h2>
                  <span className="text-xs text-[#b0aea5]/50">({categorySkills.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="relative group">
                      {/* Checkbox */}
                      <button
                        onClick={(e) => toggleSelect(skill.id, e)}
                        className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-all z-10 ${
                          selected.has(skill.id)
                            ? "bg-[#d97757] border-[#d97757]"
                            : "border-[#b0aea5]/30 hover:border-[#d97757] bg-[#141413]"
                        }`}
                      >
                        {selected.has(skill.id) && <Check size={12} className="text-[#141413]" />}
                      </button>

                      <Link
                        to={`/editor/${skill.id}`}
                        className={`skill-card block h-32 ${selected.has(skill.id) ? "border-[#d97757]/50" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-3 pr-8">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${categoryColors[skill.category] || "bg-[#d97757]/20 text-[#d97757]"}`}>
                            {categoryIcons[skill.category] || <Code2 size={12} />}
                          </div>
                          <h3 className="font-mono font-medium text-[#faf9f5] text-sm group-hover:text-[#d97757] transition truncate">
                            {skill.name}
                          </h3>
                        </div>
                        <p className="text-[#b0aea5] text-xs leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      {/* Floating Action Bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a19] border border-[#b0aea5]/20 rounded-xl p-4 shadow-2xl flex items-center gap-4 z-50">
          <span className="text-[#faf9f5] text-sm font-medium">
            {selected.size} skill{selected.size !== 1 ? "s" : ""} selected
          </span>

          <div className="w-px h-8 bg-[#b0aea5]/20" />

          <button
            onClick={copyInstallCommands}
            className="btn-secondary py-2 px-4 text-sm"
          >
            <Copy size={14} />
            Copy Commands
          </button>

          <button
            onClick={downloadAllAsZip}
            disabled={downloading}
            className="btn-primary py-2 px-4 text-sm"
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? "Zipping..." : "Download ZIP"}
          </button>

          <button
            onClick={clearSelection}
            className="p-2 text-[#b0aea5] hover:text-[#faf9f5] transition"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
