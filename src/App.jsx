import { useState, useEffect } from "react";

const DAILY_LIMIT = 5;
const BMC_LINK = "https://buymeacoffee.com/ritchielab.s";
const SYSTEME_LINK = "https://systeme.io/?sa=sa0039793676c8635eb32752ef9e9001c4766027f6";
const SYLLABY_LINK = "https://syllaby.io?via=ritchie46";

const blogPosts = [
  { title: "how to write Upwork proposals that actually get read 📋", meta: "by Ritchie, creator of KISS Proposal", color: "bg-pink-100", dot: "bg-red-400", link: "/blog/upwork-proposals-that-get-read.html" },
  { title: "building a freelance business with automation tools ⚡", meta: "by Ritchie, creator of KISS Proposal", color: "bg-blue-100", dot: "bg-blue-400", link: "/blog/freelance-automation-tools.html" },
  { title: "10 side hustles for Filipinos in 2025 that actually pay 💰", meta: "by Ritchie, creator of KISS Proposal", color: "bg-green-100", dot: "bg-green-400", link: "/blog/filipino-side-hustles-2025.html" },
  { title: "the KISS method: why shorter proposals win more jobs ✨", meta: "by Ritchie, creator of KISS Proposal", color: "bg-yellow-100", dot: "bg-yellow-400", link: "/blog/kiss-method-shorter-proposals.html" },
  { title: "AI tools for content creation: save 10 hours per week 🤖", meta: "by Ritchie, creator of KISS Proposal", color: "bg-purple-100", dot: "bg-purple-400", link: "/blog/ai-content-creation-tools.html" },
];

const GlitterStar = ({ style, size = 18, color = "#FFB3C6" }) => (
  <div className="absolute pointer-events-none animate-pulse" style={style}>
    <svg width={size} height={size} viewBox="0 0 22 22">
      <path d="M11 0L12.8 8.5L21 11L12.8 13.5L11 22L9.2 13.5L0 11L9.2 8.5Z" fill={color} />
    </svg>
  </div>
);

const Diamond = ({ style, size = 14, color = "#FFB3C6", opacity = 0.8 }) => (
  <div className="absolute pointer-events-none animate-pulse" style={style}>
    <svg width={size} height={size * 1.3} viewBox="0 0 14 18">
      <polygon points="7,0 14,7 7,18 0,7" fill={color} opacity={opacity} />
    </svg>
  </div>
);

export default function App() {
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [blogPage, setBlogPage] = useState(0);
  const postsPerPage = 3;

  useEffect(() => {
    const stored = localStorage.getItem("kissProposalUsage");
    if (stored) {
      const { count, date } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (date !== today) {
        localStorage.setItem("kissProposalUsage", JSON.stringify({ count: 0, date: today }));
        setUsageCount(0);
      } else setUsageCount(count);
    } else {
      localStorage.setItem("kissProposalUsage", JSON.stringify({ count: 0, date: new Date().toDateString() }));
    }
  }, []);

  const isLimitReached = usageCount >= DAILY_LIMIT;
  const remaining = DAILY_LIMIT - usageCount;

  const incrementUsage = () => {
    const n = usageCount + 1;
    localStorage.setItem("kissProposalUsage", JSON.stringify({ count: n, date: new Date().toDateString() }));
    setUsageCount(n);
  };

  const generateProposal = async () => {
    if (!description.trim() || isLimitReached) return;
    setLoading(true); setProposal(""); setSpecialInstructions([]); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Request failed"); }
      const data = await res.json();
      setProposal(data.proposal);
      setSpecialInstructions(data.special_instructions_found || []);
      incrementUsage();
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const visiblePosts = blogPosts.slice(blogPage * postsPerPage, blogPage * postsPerPage + postsPerPage);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFF5F7", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&family=Special+Elite&display=swap');
        @keyframes jumpBubble { 0%,100%{transform:translateY(0) rotate(-1deg)} 30%{transform:translateY(-22px) rotate(1deg)} 60%{transform:translateY(-10px) rotate(0deg)} }
        @keyframes floatIcon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.5)} }
        .jump-bubble { animation: jumpBubble 2.4s ease-in-out infinite; }
        .float-icon { animation: floatIcon 3s ease-in-out infinite; }
        .twinkle { animation: twinkle 1.6s ease-in-out infinite; }
        .paper-bg {
          background-color: #FAF7F2;
          background-image:
            repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,0.025) 29px),
            repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(0,0,0,0.025) 29px),
            radial-gradient(ellipse at 15% 25%,rgba(180,150,120,0.08) 0%,transparent 55%),
            radial-gradient(ellipse at 85% 75%,rgba(150,120,100,0.07) 0%,transparent 50%);
        }
        .speech-bubble { position:relative; display:inline-block; background:#FFB3C6; border:2.5px dashed #D63A6A; border-radius:16px; padding:12px 32px; font-family:'Special Elite',monospace; font-size:18px; letter-spacing:2px; color:#1A1A2E; }
        .speech-bubble::after { content:''; position:absolute; bottom:-16px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:13px solid transparent; border-right:13px solid transparent; border-top:16px solid #FFB3C6; }
        .speech-bubble::before { content:''; position:absolute; bottom:-19px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-top:17px solid #D63A6A; z-index:-1; }
        .bcard-btn { display:inline-flex; align-items:center; gap:8px; border:2px dashed #333; border-radius:50px; padding:9px 20px; font-size:13px; font-weight:700; color:#1A1A2E; text-decoration:none; background:#fff; width:fit-content; margin-top:4px; }
        .bcard-btn:hover { background:#f5f5f5; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "2px solid #FFB3C6", padding: "14px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#D63A6A", fontWeight: 900 }}>
            KISS<span style={{ color: "#FF7BAC" }}>Proposal</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="/blog.html" style={{ fontSize: 14, fontWeight: 500, color: "#555", textDecoration: "none" }}>Blog</a>
            <a href="/about.html" style={{ fontSize: 14, fontWeight: 500, color: "#555", textDecoration: "none" }}>About</a>
            <a href={BMC_LINK} target="_blank" rel="noopener noreferrer"
              style={{ background: "#FBBF24", color: "#78350F", padding: "8px 18px", borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#FFE4EE 0%,#FFF0F5 50%,#FFE8D6 100%)", padding: "60px 0 50px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Glitters */}
        <GlitterStar style={{ top: 18, left: 55, animation: "twinkle 1.4s infinite" }} size={22} color="#FFB3C6" />
        <GlitterStar style={{ top: 55, left: 130, animation: "twinkle 1.9s infinite 0.3s" }} size={13} color="#D63A6A" />
        <GlitterStar style={{ top: 25, right: 70, animation: "twinkle 1.6s infinite 0.5s" }} size={18} color="#FF7BAC" />
        <GlitterStar style={{ top: 75, right: 150, animation: "twinkle 2s infinite 0.7s" }} size={10} color="#FFB3C6" />
        <GlitterStar style={{ bottom: 60, left: 180, animation: "twinkle 1.5s infinite 0.9s" }} size={15} color="#D63A6A" />
        <Diamond style={{ top: 95, left: 38, animation: "twinkle 2.2s infinite 0.4s" }} color="#FFB3C6" />
        <Diamond style={{ top: 40, right: 35, animation: "twinkle 1.7s infinite 0.8s" }} color="#D63A6A" opacity={0.6} />
        <Diamond style={{ bottom: 75, right: 110, animation: "twinkle 2.4s infinite 0.2s" }} color="#FF7BAC" />
        {/* 90s icons */}
        {[
          { icon: "💾", top: 190, left: 24, delay: "0s", size: 28 },
          { icon: "🖱️", top: 155, left: 78, delay: "0.5s", size: 22 },
          { icon: "💿", top: 230, right: 32, delay: "0.8s", size: 28 },
          { icon: "📟", top: 170, right: 86, delay: "0.3s", size: 20 },
          { icon: "🖨️", bottom: 75, left: 44, delay: "1s", size: 24 },
          { icon: "📺", bottom: 55, right: 55, delay: "0.6s", size: 26 },
          { icon: "⌨️", top: 120, left: 155, delay: "1.2s", size: 18 },
          { icon: "📠", bottom: 95, right: 145, delay: "0.9s", size: 20 },
        ].map((ic, i) => (
          <div key={i} className="float-icon" style={{ position: "absolute", fontSize: ic.size, opacity: 0.65, animationDelay: ic.delay, top: ic.top, bottom: ic.bottom, left: ic.left, right: ic.right }}>
            {ic.icon}
          </div>
        ))}

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-block", background: "#FFB3C6", color: "#8B1A3A", padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            ✨ 100% Free Tool for Freelancers
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, lineHeight: 1.1, color: "#1A1A2E", marginBottom: 16 }}>
            Stop Writing<br /><span style={{ color: "#D63A6A" }}>Boring Proposals.</span><br />Start Winning Jobs.
          </h1>
          <p style={{ fontSize: 18, color: "#555", maxWidth: 500, margin: "0 auto 30px", lineHeight: 1.6 }}>
            Generate short, punchy Upwork proposals in seconds. The KISS method that actually gets clients to reply.
          </p>
          <a href="#generator" style={{ display: "inline-block", background: "#D63A6A", color: "#fff", padding: "16px 36px", borderRadius: 50, fontSize: 17, fontWeight: 700, textDecoration: "none" }}>
            ✨ Generate Free Proposal →
          </a>
          <br /><br />
          <span style={{ fontSize: 13, color: "#888" }}>5 free proposals daily · No signup needed · Takes 10 seconds</span>
        </div>
      </div>

      {/* COUNTER STRIP */}
      <div style={{ background: "#D63A6A", color: "#fff", padding: "12px 0", textAlign: "center", fontSize: 14, fontWeight: 500 }}>
        🎉 Join <strong style={{ fontSize: 18 }}>2,400+</strong> freelancers already winning more jobs with KISS Proposal!
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "70px 0", background: "#FFF5F7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div className="jump-bubble speech-bubble">HOW IT WORKS</div>
          </div>
          <br /><br />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#1A1A2E", marginBottom: 8 }}>3 steps to win the job</h2>
          <p style={{ color: "#6B7280", fontSize: 16, marginBottom: 40 }}>No more staring at a blank screen. Just paste, generate, and send!</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 36px 1fr 36px 1fr", gap: 0, alignItems: "center" }}>
            {[
              { num: 1, icon: "📋", title: "Paste job description", desc: "Copy the Upwork job post and paste it into the generator" },
              { num: 2, icon: "⚡", title: "AI generates your hook", desc: "Get a casual, punchy 2-4 sentence proposal. Special instructions auto-detected!" },
              { num: 3, icon: "🎯", title: "Copy and send it!", desc: "One click to copy. Paste on Upwork and watch the responses come in!" },
            ].reduce((acc, step, i) => {
              acc.push(
                <div key={`step-${i}`} style={{ background: "#fff", border: "2px solid #FFB3C6", borderRadius: 24, padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ width: 42, height: 42, background: "#D63A6A", color: "#fff", borderRadius: "50%", fontSize: 19, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>{step.num}</div>
                  <div style={{ fontSize: 34, marginBottom: 12 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              );
              if (i < 2) acc.push(<div key={`arrow-${i}`} style={{ fontSize: 28, color: "#FFB3C6", textAlign: "center" }}>→</div>);
              return acc;
            }, [])}
          </div>
        </div>
      </div>

      {/* GENERATOR */}
      <div id="generator" style={{ background: "#fff", borderTop: "3px dashed #FFB3C6", borderBottom: "3px dashed #FFB3C6", padding: "60px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#FFE4EE", color: "#D63A6A", padding: "4px 14px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Try it now</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#1A1A2E", marginBottom: 8 }}>Your free proposal generator</h2>
          <p style={{ color: "#6B7280", marginBottom: 30 }}>Paste any Upwork job description below 👇</p>

          <div style={{ background: "#FFF5F7", border: "2px solid #FFB3C6", borderRadius: 24, padding: 32, maxWidth: 620, margin: "0 auto" }}>
            {/* Usage Counter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#D63A6A" }}>📋 Paste Job Description Here</span>
              <span style={{ fontSize: 13, color: isLimitReached ? "#EF4444" : "#6B7280" }}>
                {isLimitReached ? "❌ Limit reached" : <><strong style={{ color: "#D63A6A", fontSize: 16 }}>{remaining}</strong> / 5 left today</>}
              </span>
            </div>

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isLimitReached}
              placeholder="e.g. Looking for a VA to manage email and calendar. Include the word 'sunshine' in your application..."
              style={{ width: "100%", background: "#fff", border: "2px solid #FFD6E4", borderRadius: 12, padding: 14, fontSize: 14, color: "#333", resize: "none", height: 120, fontFamily: "inherit", outline: "none", opacity: isLimitReached ? 0.5 : 1 }}
            />

            <button
              onClick={generateProposal}
              disabled={loading || !description.trim() || isLimitReached}
              style={{ width: "100%", background: isLimitReached ? "#D1D5DB" : "#D63A6A", color: "#fff", border: "none", padding: 14, borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: isLimitReached ? "not-allowed" : "pointer", marginTop: 14, fontFamily: "inherit" }}
            >
              {isLimitReached ? "Come Back Tomorrow! 🌙" : loading ? "✨ Generating..." : `✨ Generate KISS Proposal (Free · ${remaining} left)`}
            </button>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 14, marginTop: 14, fontSize: 14, color: "#991B1B" }}>
                {error}
              </div>
            )}

            {/* LIMIT REACHED - Buy Me a Coffee */}
            {isLimitReached && (
              <div style={{ marginTop: 20, borderRadius: 16, overflow: "hidden", border: "2px solid #FFB3C6" }}>
                <div style={{ background: "linear-gradient(to right, #FFF1F2, #FFF7ED)", padding: "20px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🎯</p>
                  <p style={{ fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>You've used all 5 free proposals today!</p>
                  <p style={{ fontSize: 13, color: "#B91C1C" }}>Come back tomorrow for 5 more. Resets at midnight! 🌙</p>
                </div>
                <div style={{ borderTop: "2px dashed #FFB3C6" }} />
                <div style={{ background: "#FFFBEB", padding: "20px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>☕</p>
                  <p style={{ fontWeight: 700, color: "#78350F", marginBottom: 6 }}>Did this tool help you today?</p>
                  <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6, marginBottom: 16 }}>
                    I built this for free so freelancers like you can win more jobs.<br />
                    Buying me a coffee keeps it free for everyone! 💕
                  </p>
                  <a href={BMC_LINK} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", background: "#FBBF24", color: "#78350F", fontWeight: 700, padding: "12px 28px", borderRadius: 50, textDecoration: "none", fontSize: 15 }}>
                    ☕ Buy Me a Coffee
                  </a>
                  <p style={{ fontSize: 11, color: "#A16207", marginTop: 10 }}>Any amount helps · No pressure · Thank you! 💕</p>
                </div>
              </div>
            )}
          </div>

          {/* PROPOSAL OUTPUT */}
          {proposal && (
            <div style={{ maxWidth: 620, margin: "24px auto 0", display: "flex", flexDirection: "column", gap: 16 }}>
              {specialInstructions.length > 0 && (
                <div style={{ background: "#FFFBEB", border: "2px solid #FCD34D", borderRadius: 16, padding: 16, textAlign: "left" }}>
                  <p style={{ fontWeight: 700, color: "#92400E", marginBottom: 8 }}>✓ Special Instructions Detected & Followed:</p>
                  {specialInstructions.map((s, i) => <p key={i} style={{ fontSize: 13, color: "#78350F" }}>• {s}</p>)}
                </div>
              )}
              <div style={{ background: "linear-gradient(to right, #FFF5F7, #FAF5FF)", border: "2px solid #FFB3C6", borderRadius: 16, padding: 24, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, color: "#1A1A2E" }}>Your KISS Proposal ✨</h3>
                  <button onClick={copy}
                    style={{ background: "#D63A6A", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #FFE4EE" }}>
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{proposal}</p>
                </div>
              </div>

              {/* Pro Tip */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 14, textAlign: "left" }}>
                <p style={{ fontSize: 13, color: "#1E40AF" }}>
                  <strong>💡 Pro Tip:</strong> Personalize it further if needed. Add your portfolio link or a specific example!
                </p>
              </div>

              {/* BUY ME A COFFEE - after proposal (subtle) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>☕</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#78350F" }}>Found this helpful?</p>
                    <p style={{ fontSize: 12, color: "#92400E" }}>Buy me a coffee to keep this tool free for everyone!</p>
                  </div>
                </div>
                <a href={BMC_LINK} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#FBBF24", color: "#78350F", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 50, textDecoration: "none", flexShrink: 0 }}>
                  ☕ Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BLOG - crumpled paper */}
      <div className="paper-bg" style={{ padding: "70px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: "#1A1A2E", fontWeight: 900, textAlign: "center", marginBottom: 8 }}>
            Freelance tips that actually work
          </h2>
          <p style={{ textAlign: "center", color: "#6B7280", fontSize: 15, marginBottom: 44 }}>Real tips from a real freelancer who's been there</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {visiblePosts.map((post, i) => (
              <div key={i} className={post.color} style={{ borderRadius: 22, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.35 }}>{post.title}</h3>
                <hr style={{ border: "none", borderTop: "1.5px dashed #aaa" }} />
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{post.meta}</p>
                <a href={post.link} className="bcard-btn">
                  <span style={{ width: 11, height: 11, borderRadius: "50%", display: "inline-block", flexShrink: 0, background: post.dot.replace("bg-", "").includes("red") ? "#F87171" : post.dot.includes("blue") ? "#60A5FA" : post.dot.includes("green") ? "#4ADE80" : post.dot.includes("yellow") ? "#FBBF24" : "#C084FC" }} />
                  Read It Here
                </a>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 36 }}>
            <button onClick={() => setBlogPage(p => Math.max(0, p - 1))} disabled={blogPage === 0}
              style={{ background: "#fff", border: "2.5px solid #ccc", borderRadius: 10, padding: "8px 22px", fontSize: 20, cursor: blogPage === 0 ? "not-allowed" : "pointer", color: blogPage === 0 ? "#ccc" : "#888", fontFamily: "inherit" }}>
              ◁
            </button>
            <button onClick={() => setBlogPage(p => Math.min(totalPages - 1, p + 1))} disabled={blogPage === totalPages - 1}
              style={{ background: "#fff", border: "2.5px solid #ccc", borderRadius: 10, padding: "8px 22px", fontSize: 20, cursor: blogPage === totalPages - 1 ? "not-allowed" : "pointer", color: blogPage === totalPages - 1 ? "#ccc" : "#888", fontFamily: "inherit" }}>
              ▷
            </button>
          </div>
        </div>
      </div>

      {/* AFFILIATES */}
      <div style={{ background: "#1A1A2E", padding: "60px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#D63A6A", color: "#fff", padding: "4px 14px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recommended Tools</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#fff", marginBottom: 8 }}>Tools I personally use</h2>
          <p style={{ color: "#aaa", marginBottom: 40, fontSize: 16 }}>These are the exact tools that help me run my freelance business</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {[
              { icon: "⚡", name: "Systeme.io", desc: "All-in-one platform for email marketing, funnels, and client automation. Free to start!", link: SYSTEME_LINK, btnColor: "#3B6FD4", bg: "#162040", border: "#2A3F6F", label: "Try Free →" },
              { icon: "🎬", name: "Syllaby", desc: "Create viral content ideas and video scripts in minutes using AI. Perfect for freelancers!", link: SYLLABY_LINK, btnColor: "#7C3AED", bg: "#2A1040", border: "#5A2D9A", label: "Get Started →" },
            ].map((aff, i) => (
              <div key={i} style={{ background: aff.bg, border: `2px solid ${aff.border}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 36 }}>{aff.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{aff.name}</h3>
                <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.5 }}>{aff.desc}</p>
                <a href={aff.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", background: aff.btnColor, color: "#fff", padding: "10px 22px", borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: "none", width: "fit-content" }}>
                  {aff.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#D63A6A", color: "#fff", padding: "28px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>KISS Proposal ✨</p>
          <p style={{ fontSize: 14, opacity: 0.85 }}>
            Created with 💕 by Ritchie ·{" "}
            <a href="mailto:ritchie@kissproposal.com" style={{ color: "#FFD6E4" }}>ritchie@kissproposal.com</a>
          </p>
          <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>© 2026 All Rights Reserved · This site contains affiliate links</p>
        </div>
      </footer>
    </div>
  );
}
