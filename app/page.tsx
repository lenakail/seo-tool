"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  const mockResults = [
    { category: "Meta Tags", status: "error", message: "Missing meta description", task: "Add a unique meta description between 150–160 characters" },
    { category: "Headings", status: "warning", message: "Multiple H1 tags found", task: "Keep only one H1 tag per page" },
    { category: "Images", status: "error", message: "14 images missing alt text", task: "Add descriptive alt attributes to all images" },
    { category: "Performance", status: "ok", message: "Page loads in 1.8s", task: "No action needed" },
    { category: "Links", status: "warning", message: "3 broken internal links", task: "Fix or remove broken links on the homepage" },
    { category: "Sitemap", status: "ok", message: "sitemap.xml found and valid", task: "No action needed" },
  ];

  const statusColor = {
    ok: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };

  const statusLabel = {
    ok: "✓ OK",
    warning: "⚠ Warning",
    error: "✕ Error",
  };

  const score = 74;
  const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <header className="border-b border-zinc-100 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">seocheck</span>
          <span className="text-xs text-zinc-400">fast & focused</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            SEO audit in seconds
          </h1>
          <p className="text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
            Paste your URL — get a clear list of issues and ready-made tasks for your dev team. No bloated reports, no noise.
          </p>
        </div>

        <div className="flex gap-2 mb-16">
          <Input
            placeholder="https://yoursite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 h-12 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-base font-medium"
          >
            {loading ? "Checking..." : "Analyze"}
          </Button>
        </div>

        {analyzed && (
          <div>
            <div className="text-center mb-10">
              <p className="text-sm text-zinc-400 mb-1 uppercase tracking-widest">SEO Score</p>
              <p className={`text-7xl font-bold ${scoreColor}`}>{score}</p>
              <p className="text-zinc-400 text-sm mt-1">out of 100</p>
            </div>

            <div className="flex flex-col gap-3">
              {mockResults.map((item) => (
                <div
                  key={item.category}
                  className="bg-white border border-zinc-100 rounded-xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-zinc-800">{item.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[item.status as keyof typeof statusColor]}`}>
                        {statusLabel[item.status as keyof typeof statusLabel]}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{item.message}</p>
                    <p className="text-xs text-zinc-400 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100">
                      📋 {item.task}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
