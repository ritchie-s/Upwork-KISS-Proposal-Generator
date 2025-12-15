import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, AlertCircle, Lock } from 'lucide-react';

export default function UpworkKISSGenerator() {
  const [description, setDescription] = useState('');
  const [proposal, setProposal] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // NEW: Usage tracking
  const [usageCount, setUsageCount] = useState(0);
  const [dailyLimit] = useState(3);

  // NEW: Load usage data on mount
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

  // NEW: Check if limit reached
  const isLimitReached = usageCount >= dailyLimit;
  const remainingUses = dailyLimit - usageCount;

  // NEW: Increment usage after successful generation
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

    // NEW: Check limit
    if (isLimitReached) {
      return;
    }

    setLoading(true);
    setProposal('');
    setSpecialInstructions([]);
    setError('');

    try {
      console.log('Calling backend API...');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const parsed = await response.json();
      console.log('Success:', parsed);
      
      setProposal(parsed.proposal);
      setSpecialInstructions(parsed.special_instructions_found || []);
      
      // NEW: Increment count after success
      incrementUsage();
    } catch (err) {
      console.error('Full error:', err);
      
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('❌ Network Error: Unable to reach the server. Please check your connection.');
      } else if (err.message.includes('API key')) {
        setError('❌ API Key Issue: The API key is missing or invalid.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* EXISTING HEADER - with added counter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Upwork KISS Proposal Generator
                </h1>
                <p className="text-sm text-gray-500 mt-1">by Ritchie L. Suico</p>
              </div>
            </div>
            {/* NEW: Usage counter */}
            <div className="text-right">
              {isLimitReached ? (
                <span className="text-sm font-semibold text-red-600">Limit reached</span>
              ) : (
                <div className="text-sm">
                  <span className="font-bold text-indigo-600 text-xl">{remainingUses}</span>
                  <span className="text-gray-500"> / 3 free today</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Paste the job description below and get a casual, punchy proposal that sounds like you're actually talking to a human. KISS ( Keep It Short, Stupid)
          </p>

          {/* NEW: Upgrade prompt when limit reached */}
          {isLimitReached && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">
                    Daily limit reached! 🚀
                  </h3>
                  <p className="text-purple-800 mb-3">
                    Upgrade to Pro for unlimited proposals and win more clients.
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-3 border border-purple-200">
                    <div className="font-bold text-gray-900 mb-2">Pro - $5/month</div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✓ 100 proposals/month</li>
                      <li>✓ No daily limits</li>
                      <li>✓ Priority support</li>
                    </ul>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg">
                    Upgrade to Pro
                  </button>
                  <p className="text-xs text-center text-purple-600 mt-2">
                    Or come back tomorrow for 3 more free proposals
                  </p>
                </div>
              </div>
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
                <>
                  <Lock className="w-5 h-5" />
                  Upgrade to Continue
                </>
              ) : loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate KISS Proposal
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {proposal && (
              <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                {specialInstructions.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-amber-900 mb-2">
                          Special Instructions Detected & Followed:
                        </h3>
                        <ul className="space-y-1">
                          {specialInstructions.map((instruction, idx) => (
                            <li key={idx} className="text-sm text-amber-800">
                              ✓ {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Pro Tip:</span> Read through the proposal and personalize it further if needed. Add your portfolio link or a specific example if relevant!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>✨ Client Dust For You. All Glory To God ✨</p>
          <p className="text-xs text-gray-500">
            Created by <span className="font-semibold">Ritchie </span> | © 2025 All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
