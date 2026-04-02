export type WaitCategoryKey =
  | "reply"
  | "work"
  | "relationships"
  | "health"
  | "home"
  | "road"
  | "study"
  | "family"
  | "friends"
  | "delivery"
  | "other";

export interface WaitCategoryMeta {
  key: WaitCategoryKey;
  label: string;
  tags: string[];
}

export const WAIT_CATEGORIES: WaitCategoryMeta[] = [
  { key: "reply", label: "Ответ", tags: ["ответ"] },
  { key: "work", label: "Работа", tags: ["работа"] },
  { key: "relationships", label: "Отношения", tags: ["отношения"] },
  { key: "health", label: "Здоровье", tags: ["здоровье"] },
  { key: "home", label: "Дом", tags: ["дом", "кот"] },
  { key: "road", label: "Дорога", tags: ["дорога", "ночь"] },
  { key: "study", label: "Учёба", tags: ["учёба"] },
  { key: "family", label: "Семья", tags: ["семья"] },
  { key: "friends", label: "Друзья", tags: ["друзья"] },
  { key: "delivery", label: "Доставка", tags: ["доставка"] },
  { key: "other", label: "Ожидание", tags: ["ожидание"] }
];

export const CREATE_CATEGORY_PRESETS: WaitCategoryKey[] = [
  "reply",
  "work",
  "relationships",
  "health",
  "home",
  "road"
];

export function getWaitCategory(key: WaitCategoryKey): WaitCategoryMeta {
  return WAIT_CATEGORIES.find((category) => category.key === key) ?? WAIT_CATEGORIES[0];
}

export function resolveWaitCategory(
  tags: string[],
  categoryKey?: WaitCategoryKey
): WaitCategoryMeta {
  if (categoryKey) {
    return getWaitCategory(categoryKey);
  }

  const match = WAIT_CATEGORIES.find((category) =>
    category.tags.some((tag) => tags.includes(tag))
  );

  return match ?? getWaitCategory("other");
}
