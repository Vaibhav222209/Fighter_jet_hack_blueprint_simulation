import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Led({ tone = "ok", blink = false }: { tone?: "ok" | "haz" | "al" | "cy"; blink?: boolean }) {
  return <span className={cn("led", `led-${tone}`, blink && "blinkc")} />;
}

export function Panel({
  title,
  code,
  right,
  children,
  className,
  bodyClass,
  tone = "haz",
  noPad = false,
}: {
  title?: string;
  code?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
  tone?: "haz" | "cy" | "al";
  noPad?: boolean;
}) {
  return (
    <section className={cn("panel corners flex flex-col", tone === "cy" && "corners-cy", className)}>
      {title && (
        <header className="flex items-center gap-2.5 border-b border-line px-4 py-2.5">
          <Led tone={tone} />
          <h3 className="font-disp text-[11px] font-semibold uppercase tracking-[0.28em] text-dim">
            {title}
          </h3>
          {code && <span className="text-[9px] tracking-[0.2em] text-fnt">{code}</span>}
          <div className="ml-auto flex items-center gap-2">{right}</div>
        </header>
      )}
      <div className={cn("min-h-0 flex-1", noPad ? "" : "p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function Tag({
  children,
  tone = "dim",
  className,
}: {
  children: ReactNode;
  tone?: "haz" | "cy" | "al" | "ok" | "dim";
  className?: string;
}) {
  const map = {
    haz: "text-haz border-haz/50 bg-haz/10",
    cy: "text-cy border-cy/50 bg-cy/10",
    al: "text-al border-al/50 bg-al/10",
    ok: "text-ok border-ok/50 bg-ok/10",
    dim: "text-dim border-edge bg-lift/60",
  } as const;
  return (
    <span
      className={cn(
        "clip-tag inline-flex items-center gap-1.5 border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em]",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  unit,
  tone = "ink",
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "ink" | "haz" | "cy" | "ok" | "al";
  className?: string;
}) {
  const color = { ink: "text-ink", haz: "text-haz", cy: "text-cy", ok: "text-ok", al: "text-al" }[tone];
  return (
    <div className={cn("min-w-0", className)}>
      <div className="text-[9px] uppercase tracking-[0.3em] text-fnt">{label}</div>
      <div className={cn("font-disp text-2xl font-bold leading-tight xl:text-3xl", color)}>
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-dim">{unit}</span>}
      </div>
    </div>
  );
}

export function Meter({
  value,
  tone = "haz",
  striped = false,
  className,
}: {
  value: number;
  tone?: "haz" | "cy" | "ok" | "al";
  striped?: boolean;
  className?: string;
}) {
  const bg = { haz: "bg-haz", cy: "bg-cy", ok: "bg-ok", al: "bg-al" }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden bg-line/60", className)}>
      <div
        className={cn("h-full transition-[width] duration-200", bg, striped && "stripe-bar")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="anim-rise mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="hazard-tape inline-block h-2 w-10" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-haz">{kicker}</span>
        </div>
        <h2 className="font-disp text-3xl font-bold uppercase leading-none tracking-wide text-ink xl:text-4xl">
          {title}
        </h2>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
