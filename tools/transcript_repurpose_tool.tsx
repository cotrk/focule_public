import React, { useState } from 'react';
import { Upload, Sparkles, Video, Share2, Lightbulb, Download, FileText, Loader2 } from 'lucide-react';

const TranscriptRepurposeTool = () => {
    const [transcript, setTranscript] = useState('');
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            setTranscript(event.target.result);
        };

        reader.readAsText(file);
    };

    const processTranscript = async () => {
        if (!transcript.trim()) {
            alert('Please upload or paste a transcript first');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 4000,
                    messages: [{
                        role: 'user',
                        content: `You are a content strategist for a rural storytelling videographer. Analyze this transcript and provide detailed suggestions for repurposing content.

TRANSCRIPT:
${transcript.substring(0, 15000)}

Provide your analysis in this exact JSON format:
{
  "keyMoments": [
    {
      "timestamp": "00:00:00",
      "speaker": "Speaker name",
      "quote": "The actual quote",
      "why": "Why this moment is valuable",
      "duration": "Suggested clip length"
    }
  ],
  "shortFormIdeas": [
    {
      "title": "Video title",
      "hook": "Opening hook",
      "keyPoints": ["point1", "point2"],
      "platform": "TikTok/Instagram/YouTube Shorts",
      "estimatedLength": "30-60 seconds"
    }
  ],
  "platformSuggestions": {
    "instagram": {
      "posts": ["suggestion 1", "suggestion 2"],
      "reels": ["reel idea 1", "reel idea 2"],
      "stories": ["story idea 1"]
    },
    "facebook": {
      "posts": ["suggestion 1"],
      "groups": ["share angle 1"]
    },
    "tiktok": {
      "videos": ["trend idea 1", "trend idea 2"]
    },
    "youtube": {
      "shorts": ["short idea 1"],
      "community": ["post idea 1"]
    },
    "heart": {
      "posts": ["professional angle 1"]
    }
  },
  "smartSuggestions": [
    {
      "category": "Content Series",
      "suggestion": "detailed suggestion",
      "rationale": "why this works"
    }
  ],
  "themes": ["theme1", "theme2"],
  "callsToAction": ["CTA 1", "CTA 2"]
}`
                    }]
                })
            });

            const data = await response.json();
            const content = data.content[0].text;

            // Extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setResults(parsed);
            } else {
                throw new Error('Could not parse AI response');
            }
        } catch (error) {
            console.error('Error processing transcript:', error);
            alert('Error processing transcript. Check console for details.');
        } finally {
            setIsProcessing(false);
        }
    };

    const exportResults = () => {
        if (!results) return;

        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `content-ideas-${fileName || 'transcript'}.json`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Transcript Repurpose Tool
                    </h1>
                    <p className="text-slate-400">
                        Upload your video transcript and get smart content suggestions for multiple platforms
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <Upload className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold">Step 1: Upload Transcript</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm text-slate-400">Upload File (.txt, .csv)</label>
                            <input
                                type="file"
                                accept=".txt,.csv"
                                onChange={handleFileUpload}
                                className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            {fileName && (
                                <p className="mt-2 text-sm text-green-400">Loaded: {fileName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-slate-400">Or Paste Transcript</label>
                            <textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Paste your transcript here..."
                                className="w-full h-32 p-3 bg-slate-700 rounded border border-slate-600 text-white resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={processTranscript}
                        disabled={isProcessing || !transcript.trim()}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Analyze Transcript
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {results && (
                    <div className="space-y-6">
                        {/* Key Moments */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Video className="w-6 h-6 text-green-400" />
                                    <h2 className="text-xl font-semibold">Key Moments to Clip</h2>
                                </div>
                                <span className="text-sm text-slate-400">
                                    {results.keyMoments?.length || 0} moments found
                                </span>
                            </div>

                            <div className="space-y-4">
                                {results.keyMoments?.map((moment, idx) => (
                                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-blue-400 font-mono text-sm">{moment.timestamp}</span>
                                                <span className="ml-3 text-slate-400">{moment.speaker}</span>
                                            </div>
                                            <span className="text-xs bg-slate-600 px-2 py-1 rounded">{moment.duration}</span>
                                        </div>
                                        <p className="text-white mb-2 italic">"{moment.quote}"</p>
                                        <p className="text-sm text-slate-400">{moment.why}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Short Form Ideas */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                                <h2 className="text-xl font-semibold">Short Form Video Ideas</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {results.shortFormIdeas?.map((idea, idx) => (
                                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{idea.title}</h3>
                                            <span className="text-xs bg-purple-600 px-2 py-1 rounded">{idea.platform}</span>
                                        </div>
                                        <p className="text-sm text-blue-400 mb-2">Hook: {idea.hook}</p>
                                        <ul className="text-sm space-y-1 mb-2">
                                            {idea.keyPoints?.map((point, pidx) => (
                                                <li key={pidx} className="text-slate-300">• {point}</li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-slate-400">{idea.estimatedLength}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Platform Suggestions */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <Share2 className="w-6 h-6 text-pink-400" />
                                <h2 className="text-xl font-semibold">Platform-Specific Ideas</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(results.platformSuggestions || {}).map(([platform, suggestions]) => (
                                    <div key={platform} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                        <h3 className="font-semibold text-lg mb-3 capitalize">{platform}</h3>
                                        {Object.entries(suggestions).map(([type, ideas]) => (
                                            <div key={type} className="mb-3">
                                                <p className="text-sm text-slate-400 mb-1 capitalize">{type}:</p>
                                                <ul className="text-sm space-y-1">
                                                    {ideas.map((idea, idx) => (
                                                        <li key={idx} className="text-slate-300">• {idea}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Suggestions */}
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb className="w-6 h-6 text-orange-400" />
                                <h2 className="text-xl font-semibold">Smart Suggestions</h2>
                            </div>

                            <div className="space-y-4">
                                {results.smartSuggestions?.map((suggestion, idx) => (
                                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                                        <h3 className="font-semibold text-lg mb-2">{suggestion.category}</h3>
                                        <p className="text-slate-300 mb-2">{suggestion.suggestion}</p>
                                        <p className="text-sm text-slate-400 italic">{suggestion.rationale}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Themes & CTAs */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <h3 className="font-semibold text-lg mb-3">Themes Identified</h3>
                                <div className="flex flex-wrap gap-2">
                                    {results.themes?.map((theme, idx) => (
                                        <span key={idx} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <h3 className="font-semibold text-lg mb-3">Suggested CTAs</h3>
                                <ul className="space-y-2">
                                    {results.callsToAction?.map((cta, idx) => (
                                        <li key={idx} className="text-slate-300">• {cta}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={exportResults}
                                className="px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Export Results as JSON
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranscriptRepurposeTool;
