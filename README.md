# W8: stuck together

Мобильный PWA-дневник ожидания на `Next.js App Router`, `TypeScript`, `Tailwind CSS` и локальном mock data layer.

Репозиторий подготовлен к обычному GitHub-экспорту: верхний уровень оставлен близким к стандартной структуре Next.js, а доменная логика собрана внутри `lib/`.

## Что внутри

- Один активный waiting session на пользователя.
- Старт, создание записи, активная сессия с таймером и завершение.
- Русский UI и реалистичный локальный mock feed.
- PWA manifest, placeholder icons и service worker.
- Локальный репозиторий на `localStorage`, который легко заменить на Supabase.

## Структура

```text
.
├── app/
├── components/
├── lib/
├── public/
├── package.json
└── README.md
```

- `app/` — маршруты App Router, layout, global styles и manifest.
- `components/` — экранные компоненты и базовые UI primitives.
- `lib/` — данные, типы, утилиты и форматирование времени.
- `public/` — PWA assets и service worker.

Остальные файлы в корне — это стандартные конфиги Next.js, TypeScript, Tailwind и PostCSS.

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Как позже подключить Supabase

Основная точка замены — `lib/data/w8-repository.ts`.

Сейчас UI работает через интерфейс `W8Repository`:

- `getSnapshot()`
- `createSession(message)`
- `finishSession(finalMessage)`

Чтобы перейти на Supabase, достаточно:

1. Сохранить этот интерфейс.
2. Добавить реализацию `createSupabaseRepository()`.
3. Подменить `getW8Repository()` на выбор локального или Supabase-источника.
