"use client";

import { useSearchParams } from "next/navigation";
import { findPostBySlug } from "@/lib/client-store";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function PostContent() {
  const params = useSearchParams();
  const slug = params.get("slug");
  const post = slug ? findPostBySlug(slug) : null;

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-sm text-zinc-500">Статья не найдена</p>
        <Link href="/blog" className="text-xs text-zinc-400 hover:text-zinc-700 underline">← Вернуться к блогу</Link>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-xs text-zinc-400 hover:text-zinc-700 mb-8 inline-block">← Все статьи</Link>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl mb-8">
        <Image src={post.imageUrl} alt={post.metaTitle} fill className="object-cover"/>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {post.tags.map((t) => (
          <span key={t} className="rounded-md bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 border border-zinc-100">{t}</span>
        ))}
      </div>

      <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-3">{post.metaTitle}</h1>
      <p className="text-sm text-zinc-500 mb-6">{post.metaDescription}</p>

      <div className="flex items-center gap-3 pb-6 mb-8 border-b border-zinc-100">
        <Image src={post.author.avatarUrl} alt={post.author.name} width={32} height={32} className="rounded-full"/>
        <div>
          <p className="text-xs font-medium text-zinc-900">{post.author.name}</p>
          <p className="text-xs text-zinc-400">{post.author.role}</p>
        </div>
        <span className="ml-auto text-xs text-zinc-400">{post.readingTimeMin} мин чтения</span>
      </div>

      <div className="prose prose-sm prose-zinc max-w-none">
        {post.articleMd.split("\n").map((line, i) => {
          if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-medium text-zinc-900 mt-8 mb-3">{line.slice(2)}</h1>;
          if (line.startsWith("## ")) return <h2 key={i} className="text-base font-medium text-zinc-900 mt-6 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-medium text-zinc-900 mt-4 mb-1">{line.slice(4)}</h3>;
          if (line.match(/^\d+\. /)) return <p key={i} className="text-sm text-zinc-600 mb-1 pl-4">{line}</p>;
          if (line.trim() === "") return <div key={i} className="h-2"/>;
          return <p key={i} className="text-sm text-zinc-600 leading-relaxed mb-2">{line}</p>;
        })}
      </div>
    </main>
  );
}

export default function PostPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/blog" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">← Blog</Link>
        </div>
      </header>
      <Suspense fallback={<div className="py-32 text-center text-xs text-zinc-400">Загрузка...</div>}>
        <PostContent />
      </Suspense>
    </div>
  );
}
