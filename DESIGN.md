# Ranksy Design System

## Шрифт
Plus Jakarta Sans — подключён через `app/layout.tsx`
- 300 light, 400 regular, 500 medium, 600 semibold

## Цвета
Используй только Tailwind zinc + статусные цвета:

| Назначение        | Класс                        |
|-------------------|------------------------------|
| Фон страницы      | bg-[#FAFAFA]                 |
| Фон карточек      | bg-white                     |
| Текст основной    | text-zinc-900                |
| Текст secondary   | text-zinc-500                |
| Текст hint        | text-zinc-400                |
| Бордер            | border-zinc-100              |
| Ошибка            | bg-red-50 text-red-600       |
| Предупреждение    | bg-yellow-50 text-yellow-600 |
| Ок                | bg-green-50 text-green-600   |

## Компоненты

### Карточка
```tsx
<div className="bg-white border border-zinc-100 rounded-xl px-6 py-5">
```

### Бейдж статуса
```tsx
<span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600 border border-red-100">
  Error
</span>
```

### Кнопка primary
```tsx
<Button className="h-9 px-5 text-sm bg-zinc-900 hover:bg-zinc-700 text-white">
```

### Кнопка ghost (nav)
```tsx
className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors"
```

## Типографика
| Элемент       | Классы                                          |
|---------------|-------------------------------------------------|
| H1            | text-2xl font-medium tracking-tight text-zinc-900 |
| Body          | text-sm text-zinc-500 leading-relaxed           |
| Label мелкий  | text-xs text-zinc-400 uppercase tracking-widest |
| Цифры крупные | text-lg font-medium text-zinc-900               |

## Отступы и радиусы
- Карточки: `rounded-xl`
- Кнопки и инпуты: `rounded-md`
- Бейджи: `rounded-full`
- Gap между карточками: `gap-1`
- Padding карточки: `px-6 py-5`

## Хедер
```tsx
<header className="border-b border-zinc-100 bg-white px-6 py-3">
  <div className="max-w-2xl mx-auto flex items-center justify-between">
    <Logo />
    <nav className="flex items-center gap-1">
      <Link href="/blog" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">Blog</Link>
      <Link href="/showcase" className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">Showcase</Link>
    </nav>
  </div>
</header>
```

## Лого
Компонент `<Logo />` из `components/logo.tsx` — SVG планета + текст Ranksy

## Макс ширина контента
`max-w-2xl mx-auto px-6`

## Принципы
- Минимализм — никаких градиентов, теней, лишних элементов
- Монохром — основа zinc, акценты только для статусов
- Плотность — контролы h-9, compact h-8
- Один CTA на область
