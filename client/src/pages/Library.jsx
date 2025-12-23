import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, Loader2, Package, Code2, FolderCode } from "lucide-react";

export default function Library() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0aea5]/50" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="code-editor w-full py-3 pl-12 pr-4 rounded-lg text-[#faf9f5] placeholder-[#b0aea5]/40 text-sm"
          />
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
            <p className="text-[#b0aea5]/50 text-sm mb-4 font-mono">
              // {filtered.length} skill{filtered.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((skill) => (
                <Link
                  key={skill.id}
                  to={`/editor/${skill.id}`}
                  className="skill-card group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-[#d97757]/20 flex items-center justify-center">
                      <Code2 size={12} className="text-[#d97757]" />
                    </div>
                    <h3 className="font-mono font-medium text-[#faf9f5] text-sm group-hover:text-[#d97757] transition">
                      {skill.name}
                    </h3>
                  </div>
                  <p className="text-[#b0aea5] text-xs leading-relaxed line-clamp-2">
                    {skill.description}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
