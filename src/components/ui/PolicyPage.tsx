export default function PolicyPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      {updatedAt && <p className="mt-2 text-xs text-muted">Última actualización: {updatedAt}</p>}
      <div className="prose prose-invert mt-8 max-w-none space-y-4 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  );
}
