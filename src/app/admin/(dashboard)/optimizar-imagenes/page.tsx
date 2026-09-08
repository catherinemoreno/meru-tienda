"use client";

import { useState } from "react";
import { ImageDown, Loader2, CheckCircle2 } from "lucide-react";

type Progress = {
  optimized: number;
  skipped: number;
  failed: number;
  bytesBefore: number;
  bytesAfter: number;
  processed: number;
  total: number;
  logs: string[];
};

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function OptimizarImagenesPage() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    optimized: 0,
    skipped: 0,
    failed: 0,
    bytesBefore: 0,
    bytesAfter: 0,
    processed: 0,
    total: 0,
    logs: [],
  });

  async function handleStart() {
    setRunning(true);
    setDone(false);
    setProgress({
      optimized: 0,
      skipped: 0,
      failed: 0,
      bytesBefore: 0,
      bytesAfter: 0,
      processed: 0,
      total: 0,
      logs: [],
    });

    let offset = 0;
    let isDone = false;

    while (!isDone) {
      const res = await fetch("/api/admin/optimize-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offset }),
      });

      if (!res.ok) {
        setProgress((prev) => ({
          ...prev,
          logs: [...prev.logs, "Se detuvo por un error del servidor. Intenta de nuevo."],
        }));
        break;
      }

      const data = await res.json();

      setProgress((prev) => ({
        optimized: prev.optimized + data.optimized,
        skipped: prev.skipped + data.skipped,
        failed: prev.failed + data.failed,
        bytesBefore: prev.bytesBefore + data.bytesBefore,
        bytesAfter: prev.bytesAfter + data.bytesAfter,
        processed: prev.processed + data.processedProducts,
        total: data.total,
        logs: data.log && data.log.length > 0 ? [...prev.logs, ...data.log] : prev.logs,
      }));

      isDone = data.done;
      offset = data.nextOffset;
    }

    setRunning(false);
    setDone(true);
  }

  const percent = progress.total > 0 ? Math.min(100, Math.round((progress.processed / progress.total) * 100)) : 0;
  const savedMB = formatMB(Math.max(0, progress.bytesBefore - progress.bytesAfter));

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Optimizar fotos de productos</h1>
      <p className="mt-2 text-sm text-muted">
        Esto revisa todas las fotos que ya están subidas en tus productos, y las
        que pesan mucho las comprime automáticamente sin cambiar su lugar ni su
        link, para que la tienda cargue más rápido. Las fotos que ya están
        livianas se dejan igual. Puede tardar varios minutos según cuántos
        productos tengas — no cierres esta página mientras corre.
      </p>

      <button
        onClick={handleStart}
        disabled={running}
        className="mt-6 flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a1408] transition-opacity disabled:opacity-60"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Optimizando...
          </>
        ) : (
          <>
            <ImageDown className="h-4 w-4" /> {done ? "Volver a optimizar" : "Optimizar fotos ahora"}
          </>
        )}
      </button>

      {(running || done) && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: percent + "%" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {progress.processed} de {progress.total} productos revisados ({percent}%)
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-lg font-semibold text-foreground">{progress.optimized}</p>
              <p className="text-[11px] text-muted">Comprimidas</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-lg font-semibold text-foreground">{progress.skipped}</p>
              <p className="text-[11px] text-muted">Ya livianas</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-lg font-semibold text-foreground">{progress.failed}</p>
              <p className="text-[11px] text-muted">Con error</p>
            </div>
          </div>

          {progress.bytesBefore > 0 && (
            <p className="mt-4 text-sm text-foreground">
              Espacio ahorrado hasta ahora: <span className="font-semibold text-accent">{savedMB}</span>
            </p>
          )}

          {done && !running && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-400">
              <CheckCircle2 className="h-4 w-4" /> Listo, terminó de revisar todas las fotos.
            </p>
          )}

          {progress.logs.length > 0 && (
            <details className="mt-4 text-xs text-muted">
              <summary className="cursor-pointer">Ver detalles de errores</summary>
              <ul className="mt-2 space-y-1">
                {progress.logs.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
