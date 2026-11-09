import { useEffect, useRef, useState } from "react";
import { BOOT_LINES } from "../data";
import { cn } from "../utils/cn";

export default function Boot({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [granted, setGranted] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let acc = 600;
    BOOT_LINES.forEach((line, i) => {
      acc += line.d;
      const t = window.setTimeout(() => {
        setCount(i + 1);
        if (i === BOOT_LINES.length - 1) setGranted(true);
      }, acc);
      timers.current.push(t);
    });
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setCount(BOOT_LINES.length);
    setGranted(true);
  };

  const pct = Math.round((count / BOOT_LINES.length) * 100);

  return (
    <div className="bg-rig relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="sweepband pointer-events-none absolute inset-x-0" />

      <div className="anim-rise relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* left — identity */}
        <div className="panel corners corners-cy clip-cut relative flex flex-col justify-between p-7">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <LogoMark className="h-11 w-11" />
              <div>
                <div className="font-disp text-lg font-bold uppercase leading-tight tracking-[0.18em] text-ink">
                  Arthur
                </div>
                <div className="text-[10px] uppercase tracking-[0.42em] text-haz">Weapons Factory</div>
              </div>
            </div>
            <h1 className="font-disp text-4xl font-bold uppercase leading-[1.05] text-ink">
              Tactical Ops
              <br />
              Console <span className="text-haz">v4.7</span>
            </h1>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-dim">
              Offensive-security simulation platform. Target:{" "}
              <span className="text-cy">K-71 “WATSON”</span> stealth demonstration airframe. All data is
              fictional — built as an educational interface exercise.
            </p>
          </div>
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-fnt">
              <span>Boot sequence</span>
              <span className="text-haz">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-line">
              <div
                className="stripe-bar h-full bg-haz transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="pt-1 text-[10px] tracking-[0.2em] text-fnt">
              OPERATOR: <span className="text-ink">VAIBHAV THAKUR</span> // CLEARANCE:{" "}
              <span className="text-haz">COMMANDER</span>
            </div>
          </div>
        </div>

        {/* right — terminal */}
        <div className="panel corners relative flex min-h-[420px] flex-col p-5">
          <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dim">secure-tty0 // auth</span>
            <button onClick={skip} className="btn-tac !py-1 text-[9px]">
              Skip ▸▸
            </button>
          </div>
          <div className="flex-1 space-y-1 overflow-hidden text-xs leading-relaxed">
            {BOOT_LINES.slice(0, count).map((l, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre-wrap",
                  l.t.startsWith(">>>")
                    ? "font-semibold text-ok"
                    : l.t.startsWith("AUTH")
                      ? "text-haz"
                      : "text-dim"
                )}
              >
                {l.t}
              </div>
            ))}
            {!granted && <span className="blinkc inline-block h-3.5 w-2 bg-cy align-middle" />}
          </div>

          <div className={cn("mt-4 border-t border-line pt-4 transition-opacity duration-500", granted ? "opacity-100" : "pointer-events-none opacity-0")}>
            <button onClick={onDone} className="btn-tac btn-haz clip-cut w-full justify-center !py-3.5 text-xs">
              ▸ Enter Ops Console
            </button>
            <div className="mt-3 text-center text-[9px] uppercase tracking-[0.35em] text-fnt">
              top secret // arthur-71 // exercise — fictional data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path d="M24 3 42 12v14c0 10-7.6 16.6-18 19C13.6 42.6 6 36 6 26V12L24 3Z" stroke="#F2B33D" strokeWidth="2.2" />
      <path d="M24 10 35 15.5v9.2c0 6.4-4.7 10.7-11 12.6-6.3-1.9-11-6.2-11-12.6v-9.2L24 10Z" stroke="#49D7E8" strokeWidth="1.4" opacity="0.7" />
      <path d="M24 16v16M16.5 24h15" stroke="#F2B33D" strokeWidth="2" />
      <circle cx="24" cy="24" r="3.4" stroke="#49D7E8" strokeWidth="1.6" />
      <path d="M15 32.5 24 14l9 18.5" stroke="#DCE4EC" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
