import { CategoryIcon } from "@/components/category-icon";
import type { WaitCategoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryChip({
  category,
  compact = false,
  className,
  selected = false,
  onSelect,
  disabled = false
}: {
  category: WaitCategoryMeta;
  compact?: boolean;
  className?: string;
  selected?: boolean;
  onSelect?: (category: WaitCategoryMeta) => void;
  disabled?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[13px] text-foreground/78",
          className
        )}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-card text-foreground/70">
          <CategoryIcon category={category.key} className="h-[17px] w-[17px]" />
        </span>
        <span>{category.label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(category)}
      disabled={disabled}
      className={cn(
        "flex min-h-[84px] flex-col items-start justify-between rounded-[18px] border border-border bg-card px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none",
        selected && "border-primary/40 bg-primary/[0.08]",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-foreground/72",
          selected && "border-primary/30 bg-primary/[0.12] text-foreground"
        )}
      >
        <CategoryIcon category={category.key} className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "text-[13px] font-medium leading-4 text-foreground/80",
          selected && "text-foreground"
        )}
      >
        {category.label}
      </span>
    </button>
  );
}
