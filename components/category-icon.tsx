import type { ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils";
import type { WaitCategoryKey } from "@/lib/categories";

type IconProps = SVGProps<SVGSVGElement> & {
  category: WaitCategoryKey;
};

function BaseIcon({
  children,
  className,
  ...props
}: Omit<IconProps, "category"> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function CategoryIcon({ category, className, ...props }: IconProps) {
  switch (category) {
    case "reply":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M4.75 6.75A2.75 2.75 0 0 1 7.5 4h9A2.75 2.75 0 0 1 19.25 6.75v5.5A2.75 2.75 0 0 1 16.5 15h-4.25L8 18.5V15H7.5a2.75 2.75 0 0 1-2.75-2.75Z" />
        </BaseIcon>
      );
    case "work":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
          <path d="M4.75 9.25h14.5V17A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17Z" />
          <path d="M10 12h4" />
        </BaseIcon>
      );
    case "relationships":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M12 19s-6-3.75-6-8.5a3.5 3.5 0 0 1 6-2.35 3.5 3.5 0 0 1 6 2.35C18 15.25 12 19 12 19Z" />
        </BaseIcon>
      );
    case "health":
      return (
        <BaseIcon className={className} {...props}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M12 8.5v7" />
          <path d="M8.5 12h7" />
        </BaseIcon>
      );
    case "home":
      return (
        <BaseIcon className={className} {...props}>
          <path d="m4.75 10.5 7.25-6 7.25 6" />
          <path d="M7.75 9.75v8.5h8.5v-8.5" />
        </BaseIcon>
      );
    case "road":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M12 20s4.5-4.75 4.5-8.25a4.5 4.5 0 1 0-9 0C7.5 15.25 12 20 12 20Z" />
          <circle cx="12" cy="11.75" r="1.75" />
        </BaseIcon>
      );
    case "study":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M5.5 6.5A2.5 2.5 0 0 1 8 4h10.5v14H8a2.5 2.5 0 0 0-2.5 2.5Z" />
          <path d="M8 4v16" />
        </BaseIcon>
      );
    case "family":
      return (
        <BaseIcon className={className} {...props}>
          <circle cx="9" cy="9" r="2.25" />
          <circle cx="15.5" cy="10" r="1.75" />
          <path d="M5.5 18a3.5 3.5 0 0 1 7 0" />
          <path d="M13.25 18a2.75 2.75 0 0 1 5.5 0" />
        </BaseIcon>
      );
    case "friends":
      return (
        <BaseIcon className={className} {...props}>
          <circle cx="8.5" cy="9.25" r="2.25" />
          <circle cx="15.5" cy="9.25" r="2.25" />
          <path d="M4.75 18a3.75 3.75 0 0 1 7.5 0" />
          <path d="M11.75 18a3.75 3.75 0 0 1 7.5 0" />
        </BaseIcon>
      );
    case "delivery":
      return (
        <BaseIcon className={className} {...props}>
          <path d="M5.5 8.25 12 4.75l6.5 3.5L12 11.75Z" />
          <path d="M5.5 8.25v7.5L12 19.25l6.5-3.5v-7.5" />
          <path d="M12 11.75v7.5" />
        </BaseIcon>
      );
    default:
      return (
        <BaseIcon className={className} {...props}>
          <circle cx="12" cy="12" r="7.25" />
          <path d="M12 8.75v3.75l2.25 1.5" />
        </BaseIcon>
      );
  }
}
