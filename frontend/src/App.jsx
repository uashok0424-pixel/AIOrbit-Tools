import { useEffect, useMemo, useState } from "react";

const initialTools = [
  {
    id: 1,
    name: "ChatGPT",
    company: "OpenAI",
    category: "Productivity",
    rating: 4.8,
    users: "180M+",
    pricing: "Freemium",
    description:
      "An AI assistant for writing, coding, research, brainstorming, and everyday productivity.",
    color: "#10a37f",
    icon: "✦",
    tags: ["AI Assistant", "Writing", "Coding"],
    website: "https://chatgpt.com",
  },
  {
    id: 2,
    name: "Claude",
    company: "Anthropic",
    category: "Productivity",
    rating: 4.7,
    users: "20M+",
    pricing: "Freemium",
    description:
      "A thoughtful AI assistant designed for analysis, writing, coding, and complex tasks.",
    color: "#d97757",
    icon: "C",
    tags: ["AI Assistant", "Research", "Writing"],
    website: "https://claude.ai",
  },
  {
    id: 3,
    name: "Cursor",
    company: "Anysphere",
    category: "Coding",
    rating: 4.9,
    users: "1M+",
    pricing: "Paid",
    description:
      "An AI-powered code editor that helps developers write, understand, and improve code faster.",
    color: "#ffffff",
    icon: "</>",
    tags: ["Coding", "Developer", "IDE"],
    website: "https://cursor.com",
  },
  {
    id: 4,
    name: "Gemini",
    company: "Google",
    category: "Research",
    rating: 4.7,
    users: "400M+",
    pricing: "Freemium",
    description:
      "Google's AI assistant for research, reasoning, writing, image understanding, and productivity.",
    color: "#4285f4",
    icon: "✦",
    tags: ["AI Assistant", "Research", "Multimodal"],
    website: "https://gemini.google.com",
  },
  {
    id: 5,
    name: "Perplexity",
    company: "Perplexity AI",
    category: "Research",
    rating: 4.8,
    users: "30M+",
    pricing: "Freemium",
    description:
      "An AI-powered search engine that provides direct answers with sources and citations.",
    color: "#20b8cd",
    icon: "P",
    tags: ["Search", "Research", "AI"],
    website: "https://perplexity.ai",
  },
  {
    id: 6,
    name: "Midjourney",
    company: "Midjourney",
    category: "Design",
    rating: 4.6,
    users: "17M+",
    pricing: "Paid",
    description:
      "Create detailed and imaginative images from natural language prompts.",
    color: "#ffffff",
    icon: "M",
    tags: ["Image", "Design", "Creative"],
    website: "https://midjourney.com",
  },
  {
    id: 7,
    name: "Runway",
    company: "Runway AI",
    category: "Video",
    rating: 4.6,
    users: "10M+",
    pricing: "Freemium",
    description:
      "Creative AI tools for generating, editing, and transforming professional video.",
    color: "#a855f7",
    icon: "R",
    tags: ["Video", "Creative", "Generation"],
    website: "https://runwayml.com",
  },
  {
    id: 8,
    name: "GitHub Copilot",
    company: "GitHub",
    category: "Coding",
    rating: 4.8,
    users: "20M+",
    pricing: "Paid",
    description:
      "Your AI pair programmer that helps you write code, explain code, and solve development problems.",
    color: "#ffffff",
    icon: "●",
    tags: ["Coding", "Developer", "IDE"],
    website: "https://github.com/features/copilot",
  },
  {
    id: 9,
    name: "Canva AI",
    company: "Canva",
    category: "Design",
    rating: 4.5,
    users: "190M+",
    pricing: "Freemium",
    description:
      "AI-powered design features for presentations, social media, graphics, and visual content.",
    color: "#7c3aed",
    icon: "C",
    tags: ["Design", "Graphics", "Marketing"],
    website: "https://canva.com",
  },
  {
    id: 10,
    name: "ElevenLabs",
    company: "ElevenLabs",
    category: "Audio",
    rating: 4.7,
    users: "5M+",
    pricing: "Freemium",
    description:
      "AI voice technology for realistic text-to-speech, voice cloning, and audio generation.",
    color: "#f59e0b",
    icon: "11",
    tags: ["Voice", "Audio", "Generation"],
    website: "https://elevenlabs.io",
  },
  {
    id: 11,
    name: "Notion AI",
    company: "Notion",
    category: "Writing",
    rating: 4.5,
    users: "100M+",
    pricing: "Paid",
    description:
      "AI-powered workspace features for writing, summarizing, organizing, and managing knowledge.",
    color: "#ffffff",
    icon: "N",
    tags: ["Writing", "Productivity", "Workspace"],
    website: "https://notion.so",
  },
  {
    id: 12,
    name: "v0",
    company: "Vercel",
    category: "Coding",
    rating: 4.8,
    users: "2M+",
    pricing: "Freemium",
    description:
      "Generate production-ready user interfaces and applications using natural language.",
    color: "#ffffff",
    icon: "v0",
    tags: ["Coding", "UI", "Generation"],
    website: "https://v0.dev",
  },
];

const initialCategories = [
  "All",
  "Coding",
  "Productivity",
  "Research",
  "Design",
  "Video",
  "Audio",
  "Writing",
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Trending");
  const [view, setView] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  const [tools, setTools] = useState(initialTools);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        setApiError("");

        const [toolsResponse, categoriesResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/tools`),
          fetch(`${import.meta.env.VITE_API_URL}/api/tools/categories`),
        ]);

        if (!toolsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Unable to load data from the AI Orbit API.");
        }

        const toolsResult = await toolsResponse.json();
        const categoriesResult = await categoriesResponse.json();

        if (toolsResult.success && Array.isArray(toolsResult.data)) {
          const normalizedTools = toolsResult.data.map((tool, index) => ({
            ...tool,
            color: tool.color || initialTools[index]?.color || "#ffffff",
            icon: tool.icon || initialTools[index]?.icon || "✦",
            tags:
              Array.isArray(tool.tags) && tool.tags.length > 0
                ? tool.tags
                : initialTools[index]?.tags || [tool.category],
          }));

          setTools(normalizedTools);
        }

        if (
          categoriesResult.success &&
          Array.isArray(categoriesResult.data)
        ) {
          setCategories(categoriesResult.data);
        }
      } catch (error) {
        console.error("API Error:", error);
        setApiError(
          "Could not connect to the AI Orbit API. Showing demo data instead."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  const filteredTools = useMemo(() => {
    let result = tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.company.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (sort === "Highest Rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    if (sort === "A-Z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, search, sort]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const openTool = (tool) => {
    setSelectedTool(tool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedTool) {
    const relatedTools = tools
      .filter(
        (tool) =>
          tool.category === selectedTool.category &&
          tool.id !== selectedTool.id
      )
      .slice(0, 3);

    return (
      <div className="app">
        <nav className="navbar">
          <button className="brand" onClick={() => setSelectedTool(null)}>
            <span className="brand-mark">✦</span>
            <span>AI<span>Orbit</span></span>
          </button>

          <div className="nav-links">
            <button className="nav-link active">Tools</button>
            <button className="nav-link">Agents</button>
            <button className="nav-link">Models</button>
            <button className="nav-link">Companies</button>
          </div>

          <div className="nav-actions">
            <button className="nav-icon">⌕</button>
            <button className="sign-in">Sign in</button>
          </div>
        </nav>

        <main className="detail-page">
          <button className="back-button" onClick={() => setSelectedTool(null)}>
            ← Back to AI Tools
          </button>

          <section className="detail-hero">
            <div
              className="detail-logo"
              style={{ "--logo-color": selectedTool.color }}
            >
              {selectedTool.icon}
            </div>

            <div className="detail-heading">
              <div className="detail-title-row">
                <h1>{selectedTool.name}</h1>
                <span className="verified">✓ Verified</span>
              </div>

              <p className="company-name">{selectedTool.company}</p>

              <div className="detail-meta">
                <span>★ {selectedTool.rating}</span>
                <span>•</span>
                <span>{selectedTool.users} users</span>
                <span>•</span>
                <span>{selectedTool.pricing}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className={`favorite-large ${
                  favorites.includes(selectedTool.id) ? "saved" : ""
                }`}
                onClick={() => toggleFavorite(selectedTool.id)}
              >
                {favorites.includes(selectedTool.id) ? "♥ Saved" : "♡ Save"}
              </button>

              <a
                className="visit-button"
                href={selectedTool.website}
                target="_blank"
                rel="noreferrer"
              >
                Visit website ↗
              </a>
            </div>
          </section>

          <div className="detail-layout">
            <div>
              <section className="detail-section">
                <h2>Overview</h2>
                <p className="detail-description">
                  {selectedTool.description} It is designed to help individuals
                  and teams work more efficiently while reducing repetitive
                  tasks and improving creative workflows.
                </p>
              </section>

              <section className="detail-section">
                <h2>Key capabilities</h2>

                <div className="capabilities">
                  {[
                    "AI-powered workflow",
                    "Natural language interaction",
                    "Fast and intuitive experience",
                    "Cross-platform accessibility",
                    "Continuous improvements",
                    "Professional use cases",
                  ].map((item) => (
                    <div className="capability" key={item}>
                      <span>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-section">
                <h2>Use cases</h2>

                <div className="tag-list">
                  {selectedTool.tags.map((tag) => (
                    <span className="detail-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="detail-sidebar">
              <div className="info-box">
                <span className="info-label">PRICING</span>
                <strong>{selectedTool.pricing}</strong>
                <p>Plans available for different needs and usage levels.</p>
              </div>

              <div className="info-box">
                <span className="info-label">CATEGORY</span>
                <strong>{selectedTool.category}</strong>
                <p>Explore more tools in this category.</p>
              </div>
            </aside>
          </div>

          {relatedTools.length > 0 && (
            <section className="related-section">
              <div className="section-heading">
                <div>
                  <h2>Similar tools</h2>
                  <p>Explore alternatives in the same category.</p>
                </div>
              </div>

              <div className="related-grid">
                {relatedTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    favorite={favorites.includes(tool.id)}
                    onFavorite={toggleFavorite}
                    onOpen={openTool}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <button className="brand" onClick={() => setSelectedTool(null)}>
          <span className="brand-mark">✦</span>
          <span>AI<span>Orbit</span></span>
        </button>

        <div className="nav-links">
          <button className="nav-link active">Tools</button>
          <button className="nav-link">Agents</button>
          <button className="nav-link">Models</button>
          <button className="nav-link">Companies</button>
        </div>

        <div className="nav-actions">
          <button className="nav-icon">⌕</button>
          <button className="sign-in">Sign in</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-glow"></div>

          <div className="hero-content">
            <p className="hero-label">AI TOOLS DIRECTORY</p>
            <h1>
              Discover the right
              <br />
              <span>AI tool for your work.</span>
            </h1>

            <p className="hero-description">
              Explore powerful AI tools for coding, research, design,
              productivity, writing, and more.
            </p>

            <div className="hero-search">
              <span className="search-icon">⌕</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search AI tools, categories, or use cases..."
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{tools.length}</strong>
                <span>Featured tools</span>
              </div>
              <div>
                <strong>{Math.max(categories.length - 1, 0)}</strong>
                <span>Categories</span>
              </div>
              <div>
                <strong>
                  {tools.length
                    ? (
                        tools.reduce((sum, tool) => sum + Number(tool.rating || 0), 0) /
                        tools.length
                      ).toFixed(1)
                    : "0.0"}
                </strong>
                <span>Average rating</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tools-section">
          {apiError && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: "#b8b8b8",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {apiError}
            </div>
          )}

          {loading && (
            <div
              style={{
                marginBottom: "20px",
                color: "#999",
              }}
            >
              Loading AI tools...
            </div>
          )}

          <div className="section-heading">
            <div>
              <p className="section-kicker">EXPLORE</p>
              <h2>AI tools</h2>
              <p>Find tools built for the way you work.</p>
            </div>

            <div className="toolbar">
              <div className="view-toggle">
                <button
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                  title="List view"
                >
                  ☷
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option>Trending</option>
                <option>Highest Rated</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="category-row">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category ? "category active" : "category"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="results-row">
            <span>
              Showing <strong>{filteredTools.length}</strong> tools
            </span>

            {(search || selectedCategory !== "All") && (
              <button
                className="reset-button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Reset filters ×
              </button>
            )}
          </div>

          {filteredTools.length > 0 ? (
            <div className={view === "grid" ? "tools-grid" : "tools-list"}>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  favorite={favorites.includes(tool.id)}
                  onFavorite={toggleFavorite}
                  onOpen={openTool}
                  listView={view === "list"}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
              <h3>No tools found</h3>
              <p>
                We couldn't find anything matching "{search}".
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">✦</span>
          <span>AI<span>Orbit</span></span>
        </div>
        <p>Discover. Compare. Build with AI.</p>
        <span>© 2026 AI Orbit</span>
      </footer>
    </div>
  );
}

function ToolCard({
  tool,
  favorite,
  onFavorite,
  onOpen,
  listView = false,
}) {
  return (
    <article className={`tool-card ${listView ? "list-card" : ""}`}>
      <div className="card-top">
        <div
          className="tool-logo"
          style={{ "--logo-color": tool.color }}
        >
          {tool.icon}
        </div>

        <button
          className={`favorite ${favorite ? "saved" : ""}`}
          onClick={() => onFavorite(tool.id)}
          aria-label="Save tool"
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-content">
        <div className="tool-title-row">
          <h3>{tool.name}</h3>
          <span className="rating">★ {tool.rating}</span>
        </div>

        <p className="company">{tool.company}</p>

        <p className="tool-description">{tool.description}</p>

        <div className="card-tags">
          <span>{tool.category}</span>
          <span>{tool.pricing}</span>
        </div>
      </div>

      <div className="card-bottom">
        <span className="users">{tool.users} users</span>

        <button className="view-button" onClick={() => onOpen(tool)}>
          View details <span>→</span>
        </button>
      </div>
    </article>
  );
}

export default App;