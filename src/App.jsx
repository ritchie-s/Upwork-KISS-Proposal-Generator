import React, { useState } from 'react';
import { Copy, Sparkles, AlertCircle } from 'lucide-react';

export default function UpworkKISSGenerator() {
  const [description, setDescription] = useState('');
  const [proposal, setProposal] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateProposal = async () => {
    if (!description.trim()) {
      alert('Please paste a job description first');
      return;
    }

    setLoading(true);
    setProposal('');
    setSpecialInstructions([]);

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
    } catch (err) {
      // Keep the existing catch block - don't change this part
      console.error('Error:', error);
      alert('Failed to generate proposal. Please try again.');
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
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Upwork KISS Proposal Generator
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Paste the job description below and get a casual, punchy proposal that sounds like you're actually talking to a human.
          </p>

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
              />
            </div>

            <button
              onClick={generateProposal}
              disabled={loading || !description.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
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

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>✨ Client dust for you ✨ </p>
        <p className="text-xs text-gray-500">
            Created by <span className="font-semibold">Ritchie L. Suico</span> | © 2025 All Rights Reserved </p>
        </div>
      </div>
    </div>
  );
}
