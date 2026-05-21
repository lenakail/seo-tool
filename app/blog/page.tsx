import { Gallery } from "@/components/content/gallery";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <nav className="flex items-center gap-1">
            <Link href="/blog" className="text-xs text-zinc-900 font-medium px-3 py-1.5 rounded-md bg-zinc-50">Blog</Link>
            <Link href="https://seo-audit--snezhnayaa.replit.app/marketplace" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">Showcase</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
        <div className="space-y-2 pb-8">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-900">Опубликованные статьи</h1>
          <p className="max-w-xl text-sm text-zinc-500">
            Все статьи, сгенерированные агентом и опубликованные в GitHub. Источник — свежие материалы Google Search Central.
          </p>
        </div>
        <Gallery />
      </main>
      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6 text-[11px] text-zinc-400">
          <span>Ranksy · Content Agent</span>
          <span className="font-mono">MVP</span>
        </div>
      </footer>
    </div>
  );
}
