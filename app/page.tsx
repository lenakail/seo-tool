"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Logo } from "@/components/logo";

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

const loadingSteps = [
  "Fetching page...",
  "Checking meta tags...",
  "Analyzing headings...",
  "Scanning images...",
  "Checking links...",
  "Validating sitemap...",
  "Calculating score...",
];

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

function Gauge({ score }: { score: number }) {
  const total = 176;
  const offset = total - (total * score) / 100;
  const color = score >= 80 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke="#e4e4e7" strokeWidth="10" strokeLinecap="round"/>
        <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={total} strokeDashoffset={offset}/>
        <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="500" fill="currentColor">{score}</text>
      </svg>
      <div className="flex justify-between w-32 -mt-2">
        <span className="text-xs text-zinc-400">0</span>
        <span className="text-xs text-zinc-400">100</span>
      </div>
      <span className="text-xs text-zinc-400 mt-1">SEO Score</span>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [step, setStep] = useState(0);

  const handleAnalyze = () => {
    if (!url) return;
    setLoading(true);
    setAnalyzed(false);
    setStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStep(i);
      if (i >= loadingSteps.length - 1) {
        clearInterval(interval);
        setTimeout(() => { setLoading(false); setAnalyzed(true); }, 400);
      }
    }, 350);
  };

  const handleExport = () => {
    const text = results.map(r =>
      `[${r.status.toUpperCase()}] ${r.category}\n${r.message}\nTask: ${r.task}`
    ).join("\n\n");
    const blob = new Blob([`Ranksy SEO Audit — ${url}\n\n${text}`], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ranksy-audit.txt";
    a.click();
  };

  const errors = results.filter(r => r.status === "error").length;
  const warnings = results.filter(r => r.status === "warning").length;
  const ok = results.filter(r => r.status === "ok").length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <header className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-1">
            <Link href="/blog" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">Blog</Link>
            <Link href="/showcase" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">Showcase</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-2">SEO audit in seconds</h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
            Paste your URL — get a clear list of issues and ready-made tasks for your dev team. Simple audit, real impact.
          </p>
        </div>

        <div className="flex gap-2 mb-2">
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
        <p className="text-xs text-zinc-400 mb-12">Checks 20+ SEO parameters · Already used by 1,240 teams</p>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-zinc-100 rounded-xl px-6 py-8 flex flex-col items-center gap-4">
            <div className="flex flex-col gap-1.5 w-full max-w-xs">
              {loadingSteps.map((s, i) => (
                <div key={s} className={`flex items-center gap-2 text-xs transition-all duration-300 ${i <= step ? "text-zinc-900" : "text-zinc-300"}`}>
                  <span>{i < step ? "✓" : i === step ? "›" : "·"}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="w-full max-w-xs bg-zinc-100 rounded-full h-1 mt-2">
              <div
                className="bg-zinc-900 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {analyzed && (
          <div>
            {/* Gauge card */}
            <div className="bg-white border border-zinc-100 rounded-xl px-6 py-5 flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-900">{(() => { try { return new URL(url).hostname; } catch { return url; } })()}</span>
                <span className="text-xs text-zinc-400">{url}</span>
              </div>
              <Gauge score={74} />
              <div className="flex flex-col gap-2 min-w-28">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-right">{errors} Errors</span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-right">{warnings} Warnings</span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-right">{ok} OK</span>
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-6 px-6 py-4 bg-white border border-zinc-100 rounded-xl mb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-medium text-zinc-900">48</span>
                <span className="text-xs text-zinc-400">Pages crawled</span>
              </div>
              <div className="w-px h-8 bg-zinc-100" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-medium text-zinc-900">2</span>
                <span className="text-xs text-zinc-400">Sitemaps found</span>
              </div>
              <div className="w-px h-8 bg-zinc-100" />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-medium text-zinc-900">Homepage</span>
                <span className="text-xs text-zinc-400">Audit scope</span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-1 mb-6">
              {results.map((item) => <Card key={item.category} item={item} />)}
            </div>

            <button
              onClick={handleExport}
              className="w-full text-xs text-zinc-400 hover:text-zinc-700 border border-zinc-100 hover:border-zinc-200 rounded-xl py-3 transition-colors"
            >
              Export as .txt
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
