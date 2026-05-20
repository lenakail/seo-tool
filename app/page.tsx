"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const results = [
  { category: "Meta Tags", status: "error", message: "Missing meta description", task: "Add a unique meta description between 150–160 characters" },
  { category: "Headings", status: "warning", message: "Multiple H1 tags found", task: "Keep only one H1 tag per page" },
  { category: "Images", status: "error", message: "14 images missing alt text", task: "Add descriptive alt attributes to all images" },
  { category: "Performance", status: "ok", message: "Page loads in 1.8s", task: "No action needed" },
  { category: "Links", status: "warning", message: "3 broken internal links", task: "Fix or remove broken links on the homepage" },
  { category: "Sitemap", status: "ok", message: "sitemap.xml found and valid", task: "No action needed" },
];

const badge: Record<string, string> = {
  ok: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  error: "bg-red-50 text-red-700 border border-red-200",
};

const label: Record<string, string> = {
  ok: "OK",
  warning: "Warning",
  error: "Error",
};

function Card({ item }: { item: typeof results[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-zinc-900">{item.category}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge[item.status]}`}>
            {label[item.status]}
          </span>
          <span className={`text-zinc-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-100">
          <p className="text-sm text-zinc-500 mb-2">{item.message}</p>
          <div className="text-xs text-zinc-400 uppercase tracking-wide font-medium mb-1">Dev task</div>
          <div className="text-xs text-zinc-500 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100">
            {item.task}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <header className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-900">Ranksy</span>
          <span className="text-xs text-zinc-400">fast & focused</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-2">SEO audit in seconds</h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
            Paste your URL — get a clear list of issues and ready-made tasks for your dev team. No bloated reports, no noise.
          </p>
        </div>
        <div className="flex gap-2 mb-12">
          <Input
            placeholder="https://yoursite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            className="h-9 text-sm bg-white border-zinc-200"
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="h-9 px-5 text-sm bg-zinc-900 hover:bg-zinc-700 text-white"
          >
            {loading ? "Checking..." : "Analyze"}
          </Button>
        </div>
        {analyzed && (
          <div>
            <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-zinc-100">
              <span className="text-xs text-zinc-400 uppercase tracking-widest">SEO Score</span>
              <span className="text-4xl font-medium text-zinc-900">74</span>
              <span className="text-sm text-zinc-400">/ 100</span>
            </div>
            <div className="flex flex-col gap-1">
              {results.map((item) => <Card key={item.category} item={item} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
