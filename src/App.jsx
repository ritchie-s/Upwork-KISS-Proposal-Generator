import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, AlertCircle, ExternalLink, BookOpen, Zap, TrendingUp } from 'lucide-react';

export default function UpworkKISSGenerator() {
  const [description, setDescription] = useState('');
  const [proposal, setProposal] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [dailyLimit] = useState(5);
  const [currentAd, setCurrentAd] = useState(0);

  // Rotating top banner ads
  const topAds = [
    {
      title: "Automate Your Freelance Business",
      description: "Build funnels, email campaigns & more - all in one platform",
      cta: "Try Systeme.io Free",
      link: "https://systeme.io/?sa=sa0039793676c8635eb32752ef9e9001c4766027f6",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "AI-Powered Content Creation",
      description: "Create viral content ideas in minutes with Syllaby",
      cta: "Get Started Free",
      link: "https://syllaby.io/?via=ritchie46",
      color: "from-purple-500 to-pink-600"
    }
  ];

  // Featured blog posts
  const featuredPosts = [
    {
      title: "How to Write Upwork Proposals That Actually Get Read",
      excerpt: "Stop writing essays. Learn the KISS method that wins clients in 2-3 sentences.",
      category: "Upwork Tips",
      readTime: "5 min read",
      slug: "upwork-proposals-that-get-read"
    },
    {
      title: "Building a Freelance Business with Automation Tools",
      excerpt: "How I scaled from $2K to $10K/month using simple automation tools.",
      category: "Business",
      readTime: "8 min read",
      slug: "freelance-automation-tools"
    },
    {
      title: "10 Side Hustles for Filipinos in 2025",
      excerpt: "Real side hustles that actually pay. From reselling to freelancing.",
      category: "Side Hustles",
      readTime: "10 min read",
      slug: "filipino-side-hustles-2025"
    }
  ];

  // Rotate ads every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % topAds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('kissProposalUsage');
    if (storedData) {
      const { count, date } = JSON.parse(storedData);
      const today = new Date().toDateString();
      
      if (date !== today) {
        localStorage.setItem('kissProposalUsage', JSON.stringify({ count: 0, date: today }));
        setUsageCount(0);
      } else {
        setUsageCount(count);
      }
    } else {
      const today = new Date().toDateString();
      localStorage.setItem('kissProposalUsage', JSON.stringify({ count: 0, date: today }));
    }
  }, []);

  const isLimitReached = usageCount >= dailyLimit;
  const remainingUses = dailyLimit - usageCount;

  const incrementUsage = () => {
    const newCount = usageCount + 1;
    const today = new Date().toDateString();
    localStorage.setItem('kissProposalUsage', JSON.stringify({ count: newCount, date: today }));
    setUsageCount(newCount);
  };

  const generateProposal = async () => {
    if (!description.trim()) {
      alert('Please paste a job description first');
      return;
    }

    if (isLimitReached) {
      return;
    }

    setLoading(true);
    setProposal('');
    setSpecialInstructions([]);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const parsed = await response.json();
      setProposal(parsed.proposal);
      setSpecialInstructions(parsed.special_instructions_found || []);
      incrementUsage();
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('❌ Network Error: Unable to reach the server.');
      } else {
        setError(`❌ Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* TOP ROTATING AD BANNER */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto">
          <a 
            href={`/blog/${post.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-gradient-to-r ${topAds[currentAd].color} px-6 py-4 hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{topAds[currentAd].title}</h3>
                <p className="text-sm opacity-90">{topAds[currentAd].description}</p>
              </div>
              <div className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold">
                {topAds[currentAd].cta}
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR - AFFILIATE ADS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Syllaby Ad */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200 sticky top-4">
              <div className="text-center mb-4">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Create Viral Content</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI-powered content ideas & video scripts in minutes
                </p>
              </div>
              <a
                href="/blog.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center font-semibold py-3 rounded-lg transition-all"
              >
                Try Syllaby Free
              </a>
            </div>

            {/* Shopee Product Placeholder */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
              <div className="text-center mb-4">
                <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Recommended Gear</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Essential tools for freelancers & creators
                </p>
              </div>
              <a
                href="https://shp.ee/yourproduct"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center font-semibold py-3 rounded-lg transition-all"
              >
                Shop on Shopee
              </a>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-8">
            {/* GENERATOR TOOL */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      Upwork KISS Proposal Generator
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">by ritchielab.s</p>
                  </div>
                </div>
                <div className="text-right">
                  {isLimitReached ? (
                    <span className="text-sm font-semibold text-red-600">Limit reached</span>
                  ) : (
                    <div className="text-sm">
                      <span className="font-bold text-indigo-600 text-xl">{remainingUses}</span>
                      <span className="text-gray-500"> / 5 free today</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Generate casual, punchy proposals that hook clients in seconds
              </p>

              {isLimitReached && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    You've used all 5 free proposals today! 🎯
                  </h3>
                  <p className="text-red-800 mb-3">
                    Come back tomorrow for more. Meanwhile, check out the blog below! ⬇️
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Paste the Upwork job description here..."
                    className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                    disabled={isLimitReached}
                  />
                </div>

                <button
                  onClick={generateProposal}
                  disabled={loading || !description.trim() || isLimitReached}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLimitReached ? (
                    `Come Back Tomorrow!`
                  ) : loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Free ({remainingUses} left)
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {proposal && (
                  <div className="space-y-6">
                    {specialInstructions.length > 0 && (
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <h3 className="text-sm font-bold text-amber-900 mb-2">
                          ✓ Special Instructions Detected & Followed:
                        </h3>
                        <ul className="space-y-1">
                          {specialInstructions.map((instruction, idx) => (
                            <li key={idx} className="text-sm text-amber-800">
                              • {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Your KISS Proposal</h2>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-indigo-100">
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                          {proposal}
                        </p>
                      </div>
                    </div>

                    {/* AD AFTER PROPOSAL - Systeme.io */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2">Scale Your Freelance Business</h3>
                          <p className="text-blue-100 mb-4">
                            Funnels, email marketing & automation - all in one platform
                          </p>
                          <a
                            href="https://systeme.io/?sa=sa0039793676c8635eb32752ef9e9001c4766027f6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                          >
                            Start Free Trial
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FEATURED BLOG POSTS */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Latest from the Blog</h2>
                </div>
                <a href="/blog" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                  View All →
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post, idx) => (
                  <a
                    key={idx}
                    href={`/blog/${post.slug}`}
                    className="group border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-500 hover:shadow-lg transition-all"
                  >
                    <div className="text-xs font-semibold text-indigo-600 mb-2">{post.category}</div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                    <div className="text-xs text-gray-500">{post.readTime}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/resources" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Recommended Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://systeme.io/?sa=sa0039793676c8635eb32752ef9e9001c4766027f6" target="_blank" rel="noopener noreferrer" className="hover:text-white">Systeme.io</a></li>
                <li><a href="https://syllaby.io?ref=yourcode" target="_blank" rel="noopener noreferrer" className="hover:text-white">Syllaby</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-gray-400 mb-2">Need help?</p>
              <a href="mailto:ritchie@kissproposal.com" className="text-indigo-400 hover:text-indigo-300">
                ritchie@kissproposal.com
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
            <p className="mb-2">✨ Client Dust For You. All Glory To God ✨</p>
            <p>© 2025 ritchielab.s | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
