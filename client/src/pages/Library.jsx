import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, Loader2, Package, Code2, FolderCode, GitBranch, FileText, TestTube, Shield, Database, Cloud } from "lucide-react";

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

      <main className="max-w-5xl mx-auto px-6 py-8">
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

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
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
          </div>
        )}

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
                    <Link
                      key={skill.id}
                      to={`/editor/${skill.id}`}
                      className="skill-card group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${categoryColors[skill.category] || "bg-[#d97757]/20 text-[#d97757]"}`}>
                            {categoryIcons[skill.category] || <Code2 size={12} />}
                          </div>
                          <h3 className="font-mono font-medium text-[#faf9f5] text-sm group-hover:text-[#d97757] transition">
                            {skill.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[#b0aea5] text-xs leading-relaxed line-clamp-2">
                        {skill.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
