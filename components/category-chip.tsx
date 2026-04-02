import { CategoryIcon } from "@/components/category-icon";
import type { WaitCategoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryChip({
  category,
  compact = false,
  className
}: {
  category: WaitCategoryMeta;
  compact?: boolean;
  className?: string;
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
    <div
      className={cn(
        "flex min-h-[84px] flex-col items-start justify-between rounded-[18px] border border-border bg-card px-3 py-3 text-left",
        className
      )}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-foreground/72">
        <CategoryIcon category={category.key} className="h-5 w-5" />
      </span>
      <span className="text-[13px] font-medium leading-4 text-foreground/80">
        {category.label}
      </span>
    </div>
  );
}
