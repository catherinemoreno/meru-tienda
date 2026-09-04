import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  eyebrow,
  title,
  href,
  hrefLabel = "Ver todo",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          {hrefLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
