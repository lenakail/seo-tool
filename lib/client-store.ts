"use client";

import type {
  Author,
  Job,
  JobResult,
  JobStep,
  JobStepState,
  Language,
  PublishedPost,
} from "./types";

const STEP_LABELS: Record<JobStep, string> = {
  "fetch-index": "Получение RSS-индекса",
  "pick-relevant": "Выбор релевантных постов",
  "crawl-pages": "Загрузка страниц",
  "extract-content": "Извлечение контента",
  "generate-article": "Генерация статьи",
  "generate-image": "Генерация изображения",
  "publish-github": "Публикация в GitHub",
};

const STEP_ORDER: JobStep[] = [
  "fetch-index",
  "pick-relevant",
  "crawl-pages",
  "extract-content",
  "generate-article",
  "generate-image",
  "publish-github",
];

const STORAGE_KEY = "sitegrep:posts:v2";

const IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&h=675&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop",
];

const SOURCES = [
  {
    title: "A new resource for optimizing for generative AI in Google Search",
    url: "https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing",
  },
  {
    title: "Inside Googlebot: demystifying crawling, fetching, and the bytes we process",
    url: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
  },
  {
    title: "Google's February 2026 Discover Core Update",
    url: "https://developers.google.com/search/blog/2026/02/discover-core-update",
  },
];

const GAPS_RU = [
  "Конкретные примеры разметки контента под AI Overviews",
  "Чек-лист для аудита существующих страниц перед оптимизацией",
  "Edge-кейсы: что делать, если страница не индексируется неделями",
  "Метрики, по которым можно оценить успех в первые 30 дней",
];

const GAPS_EN = [
  "Concrete markup examples for AI Overviews optimization",
  "Audit checklist for existing pages before re-optimization",
  "Edge cases: what to do when a page is not indexed for weeks",
  "Metrics to measure success within the first 30 days",
];

export function initialSteps(): JobStepState[] {
  return STEP_ORDER.map((id) => ({
    id,
    label: STEP_LABELS[id],
    status: "pending",
  }));
}

export function transliterate(s: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return s
    .toLowerCase()
    .split("")
    .map((c) => (map[c] !== undefined ? map[c] : c))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function pickImage(seed: string) {
  return IMAGES[hashSeed(seed) % IMAGES.length];
}

const AUTHORS_RU: Author[] = [
  { name: "Алексей Морозов", role: "Senior SEO Specialist", avatarUrl: "https://i.pravatar.cc/100?img=12" },
  { name: "Елена Кравцова", role: "Content Strategist", avatarUrl: "https://i.pravatar.cc/100?img=47" },
  { name: "Дмитрий Соколов", role: "Technical SEO Lead", avatarUrl: "https://i.pravatar.cc/100?img=33" },
  { name: "Анна Лебедева", role: "Growth Marketing Lead", avatarUrl: "https://i.pravatar.cc/100?img=49" },
];

const AUTHORS_EN: Author[] = [
  { name: "Alex Morrow", role: "Senior SEO Specialist", avatarUrl: "https://i.pravatar.cc/100?img=15" },
  { name: "Helen Carter", role: "Content Strategist", avatarUrl: "https://i.pravatar.cc/100?img=45" },
  { name: "David Sutton", role: "Technical SEO Lead", avatarUrl: "https://i.pravatar.cc/100?img=68" },
  { name: "Anna Lebed", role: "Growth Marketing Lead", avatarUrl: "https://i.pravatar.cc/100?img=44" },
];

function pickAuthor(seed: string, language: Language): Author {
  const pool = language === "ru" ? AUTHORS_RU : AUTHORS_EN;
  return pool[hashSeed(seed + "::author") % pool.length];
}

const TAG_RULES = [
  { pattern: /\b(ai|искусственн|generative|generativ|overview)/i, tag: "AI" },
  { pattern: /\b(googlebot|crawl|crawler|краул|fetch|fetching)/i, tag: "Crawling" },
  { pattern: /\b(discover|core update|обновлен)/i, tag: "Updates" },
  { pattern: /\b(spam|спам|hijack|hijacking)/i, tag: "Spam Policy" },
  { pattern: /\b(schema|разметк|markup|structured)/i, tag: "Structured Data" },
  { pattern: /\b(e-?e-?a-?t|expertise|authority|trust)/i, tag: "E-E-A-T" },
  { pattern: /\b(content|контент|article|стать)/i, tag: "Content" },
  { pattern: /\b(technical|техническ)/i, tag: "Technical SEO" },
];

function deriveTags(topic: string): string[] {
  const found: string[] = ["SEO"];
  for (const rule of TAG_RULES) {
    if (rule.pattern.test(topic) && !found.includes(rule.tag)) found.push(rule.tag);
    if (found.length >= 4) break;
  }
  if (found.length < 2) found.push("Google");
  return found;
}

function readingTime(md: string): number {
  const words = md.replace(/[#*_>`\-]+/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function articleRu(topic: string) {
  return `# ${topic}\n\nВ мае 2026 года Google опубликовал ряд материалов, которые меняют подход к оптимизации контента под генеративный поиск.\n\n## Что изменилось\n\nКлассические факторы ранжирования никуда не делись — но к ним добавились новые сигналы качества.\n\n## Практические шаги\n\n1. Аудит существующих страниц\n2. Структурирование контента\n3. Усиление E-E-A-T\n\n## Заключение\n\nИзменения Google в 2026 году — возможность пересобрать контент-стратегию вокруг реальной пользы для читателя.`;
}

function articleEn(topic: string) {
  return `# ${topic}\n\nIn May 2026, Google published materials that shift the approach to optimizing content for generative search.\n\n## What changed\n\nClassic ranking factors remain — but new quality signals have been added.\n\n## Practical steps\n\n1. Audit existing pages\n2. Structure content properly\n3. Strengthen E-E-A-T\n\n## Conclusion\n\nGoogle's 2026 changes are an opportunity to rebuild content strategy around real reader value.`;
}

export function buildResult(input: { topic: string; language: Language; repo: string }): JobResult {
  const slug = transliterate(input.topic) || "article";
  const isRu = input.language === "ru";
  const articleMd = isRu ? articleRu(input.topic) : articleEn(input.topic);
  return {
    slug,
    language: input.language,
    metaTitle: isRu ? `${input.topic}: полный гайд 2026` : `${input.topic}: complete 2026 guide`,
    metaDescription: isRu
      ? "Как адаптировать контент под изменения Google в 2026 году."
      : "How to adapt content to Google's 2026 changes.",
    articleMd,
    imageUrl: pickImage(slug + input.language),
    gaps: isRu ? GAPS_RU : GAPS_EN,
    sources: SOURCES,
    githubUrl: `https://github.com/${input.repo}/blob/main/posts/${input.language}/${slug}.md`,
    tags: deriveTags(input.topic),
    readingTimeMin: readingTime(articleMd),
    author: pickAuthor(slug, input.language),
  };
}

const SEED_INPUT = [
  { topic: "Оптимизация под AI Overviews", language: "ru" as Language, daysAgo: 1 },
  { topic: "Optimizing for AI Overviews", language: "en" as Language, daysAgo: 2 },
  { topic: "Что изменилось в Googlebot в 2026", language: "ru" as Language, daysAgo: 4 },
  { topic: "Back button hijacking: новая спам-политика", language: "ru" as Language, daysAgo: 7 },
  { topic: "What changed in Googlebot in 2026", language: "en" as Language, daysAgo: 10 },
  { topic: "Discover Core Update February 2026", language: "en" as Language, daysAgo: 14 },
];

function buildSeedPosts(): PublishedPost[] {
  const now = Date.now();
  return SEED_INPUT.map((s) => {
    const result = buildResult({ topic: s.topic, language: s.language, repo: "MrPolina/seo-content" });
    return { ...result, topic: s.topic, publishedAt: new Date(now - s.daysAgo * 86400_000).toISOString(), repo: "MrPolina/seo-content" };
  });
}

export function getSeedPosts(): PublishedPost[] { return buildSeedPosts(); }

function readStorage(): PublishedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PublishedPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeStorage(posts: PublishedPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function loadAllPosts(): PublishedPost[] {
  const userPosts = readStorage();
  const seed = buildSeedPosts();
  const all = [...userPosts, ...seed.filter((s) => !userPosts.some((u) => u.slug === s.slug))];
  return all.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findPostBySlug(slug: string): PublishedPost | null {
  return loadAllPosts().find((p) => p.slug === slug) ?? null;
}

export function savePost(post: PublishedPost) {
  const existing = readStorage().filter((p) => p.slug !== post.slug);
  writeStorage([post, ...existing]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sitegrep:posts:update"));
  }
}

export function runPipeline(
  input: { topic: string; language: Language; repo: string },
  onUpdate: (job: Job) => void
): () => void {
  let cancelled = false;
  const job: Job = {
    id: crypto.randomUUID(),
    topic: input.topic,
    language: input.language,
    repo: input.repo,
    status: "pending",
    progress: 0,
    steps: initialSteps(),
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
  };
  onUpdate({ ...job, steps: [...job.steps] });
  const timings: Array<[JobStep, number]> = [
    ["fetch-index", 800], ["pick-relevant", 1500], ["crawl-pages", 2000],
    ["extract-content", 1200], ["generate-article", 4000], ["generate-image", 2500], ["publish-github", 1000],
  ];
  let idx = 0;
  const tick = () => {
    if (cancelled) return;
    if (idx >= timings.length) {
      const result = buildResult(input);
      job.status = "succeeded"; job.progress = 100; job.result = result;
      onUpdate({ ...job, steps: [...job.steps] });
      savePost({ ...result, topic: input.topic, publishedAt: new Date().toISOString(), repo: input.repo });
      return;
    }
    const [step, delay] = timings[idx];
    job.status = "running";
    job.steps = job.steps.map((s) => s.id === step ? { ...s, status: "running" } : s);
    onUpdate({ ...job, steps: [...job.steps] });
    setTimeout(() => {
      if (cancelled) return;
      job.steps = job.steps.map((s) => s.id === step ? { ...s, status: "done" } : s);
      idx += 1; job.progress = Math.round((idx / timings.length) * 100);
      onUpdate({ ...job, steps: [...job.steps] });
      tick();
    }, delay);
  };
  tick();
  return () => { cancelled = true; };
}
