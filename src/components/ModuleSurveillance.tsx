import { useState } from "react";
import { COMMS_POOL, CONTRACTORS } from "../data";
import { stamp, useClock, useInterval } from "../hooks";
import { cn } from "../utils/cn";
import { Led, Meter, Panel, SectionHead, Tag } from "./ui";

const STATUS_TONE = { ACTIVE: "cy", FLAGGED: "haz", DARK: "al" } as const;

export default function ModuleSurveillance() {
  const [sel, setSel] = useState("brandt");
  const [comms, setComms] = useState<string[]>(COMMS_POOL.slice(0, 4));
  const now = useClock();

  useInterval(() => {
    setComms((c) => [...c, COMMS_POOL[Math.floor(Math.random() * COMMS_POOL.length)]].slice(-8));
  }, 2600);

  const subject = CONTRACTORS.find((c) => c.id === sel) ?? CONTRACTORS[0];

  return (
    <div>
      <SectionHead
        kicker="Humint // Sigint Grid"
        title="Contractor Watchlist"
        right={
          <>
            <Tag tone="dim">04 Subjects</Tag>
            <Tag tone="al">
              <Led tone="al" blink /> Live Grid
            </Tag>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-12">
        {/* dossier list */}
        <div className="anim-rise flex flex-col gap-3 xl:col-span-4">
          {CONTRACTORS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSel(c.id)}
              style={{ animationDelay: `${i * 70}ms` }}
              className={cn(
                "panel anim-rise flex items-center gap-3 p-3 text-left transition-all duration-200",
                sel === c.id
                  ? "!border-haz/70 shadow-[0_0_22px_rgba(242,179,61,0.12)]"
                  : "hover:!border-edge hover:translate-x-0.5"
              )}
            >
              <div className={cn("relative h-16 w-16 flex-none overflow-hidden border", sel === c.id ? "border-haz" : "border-line")}>
                <img src={c.img} alt={c.name} className="h-full w-full object-cover grayscale contrast-125" />
                <div className="scanlines absolute inset-0 opacity-60" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-disp text-[13px] font-bold tracking-wider text-ink">{c.name}</span>
                  <Tag tone={STATUS_TONE[c.status]}>{c.status}</Tag>
                </div>
                <div className="mt-0.5 truncate text-[10px] tracking-[0.15em] text-dim">
                  {c.callsign} · {c.role} @ {c.org}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[8.5px] tracking-[0.25em] text-fnt">THREAT</span>
                  <Meter value={c.threat} tone={c.threat > 80 ? "al" : c.threat > 50 ? "haz" : "cy"} className="flex-1" />
                  <span className={cn("font-disp text-xs font-bold", c.threat > 80 ? "text-al" : c.threat > 50 ? "text-haz" : "text-cy")}>
                    {c.threat}
                  </span>
                </div>
              </div>
            </button>
          ))}
          <Panel title="Grid Note" code="ADVISORY" tone="al">
            <p className="text-[10.5px] leading-relaxed text-dim">
              All subjects are <span className="text-haz">fictional sample personas</span> rendered with synthetic
              imagery. No real individuals are depicted, tracked or implied.
            </p>
          </Panel>
        </div>

        {/* live feed + subject file */}
        <div className="anim-rise flex flex-col gap-4 xl:col-span-8" style={{ animationDelay: "100ms" }}>
          <Panel
            title={`Live Feed — ${subject.cam}`}
            code="SRV-LOOP"
            tone={STATUS_TONE[subject.status]}
            noPad
            bodyClass="p-0"
            right={<Led tone={subject.status === "DARK" ? "al" : "ok"} blink />}
          >
            <div className="relative overflow-hidden bg-black">
              <img
                key={subject.id}
                src={subject.img}
                alt={`${subject.name} surveillance feed`}
                className={cn(
                  "anim-rise crt h-64 w-full object-cover md:h-80",
                  subject.status === "DARK" ? "opacity-40 grayscale contrast-150" : "opacity-90 grayscale contrast-130 sepia-[0.18]"
                )}
              />
              <div className="scanlines pointer-events-none absolute inset-0 opacity-75" />
              <div className="noise pointer-events-none absolute inset-0" />
              <div className="feed-scanbar pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-cy/10 to-transparent" />
              <div className="vignette pointer-events-none absolute inset-0" />

              {/* OSD */}
              <div className="absolute left-3 top-3 text-[10px] tracking-[0.25em] text-ok drop-shadow">{subject.cam}</div>
              <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-al">
                <span className="blinkc">●</span> REC
              </div>
              <div className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] text-ink/90 drop-shadow">{stamp(now)}</div>
              <div className="absolute bottom-3 right-3 text-[8.5px] tracking-[0.2em] text-fnt">SYNTHETIC SAMPLE — FICTIONAL SUBJECT</div>
              {subject.status === "DARK" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border border-al/60 bg-abg/80 px-5 py-2 font-disp text-sm font-bold tracking-[0.35em] text-al">
                    SIGNAL LOST — 74 H
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-line p-4 md:grid-cols-4">
              {[
                ["CLEARANCE", subject.clearance, "text-haz"],
                ["CALLSIGN", subject.callsign, "text-cy"],
                ["LAST PING", subject.coords, "text-ink"],
                ["THREAT INDEX", `${subject.threat} / 100`, subject.threat > 80 ? "text-al" : subject.threat > 50 ? "text-haz" : "text-cy"],
              ].map(([k, v, c]) => (
                <div key={k}>
                  <div className="text-[8.5px] tracking-[0.3em] text-fnt">{k}</div>
                  <div className={cn("mt-0.5 text-[11px] font-semibold", c)}>{v}</div>
                </div>
              ))}
              <div className="col-span-2 md:col-span-4">
                <div className="text-[8.5px] tracking-[0.3em] text-fnt">LAST PING LOCATION</div>
                <div className="mt-0.5 text-[11px] font-semibold text-ink">{subject.lastPing}</div>
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Subject File" code={`DOSSIER-${subject.id.toUpperCase()}`}>
              <p className="text-[11px] leading-relaxed text-dim">{subject.note}</p>
              <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                {subject.timeline.map((t) => (
                  <div key={t} className="flex gap-2 text-[10.5px] leading-snug">
                    <span className="text-haz">▸</span>
                    <span className="text-dim">{t}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Intercepted Comms" code="SIGINT" tone="cy" right={<Led tone="cy" blink />}>
              <svg viewBox="0 0 200 26" className="mb-2 h-7 w-full">
                {Array.from({ length: 40 }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 5}
                    y="3"
                    width="3"
                    height="20"
                    fill="rgba(73,215,232,0.55)"
                    className="eqbar"
                    style={{ animationDelay: `${(i % 7) * 0.13}s`, animationDuration: `${0.8 + (i % 5) * 0.14}s` }}
                  />
                ))}
              </svg>
              <div className="space-y-1.5">
                {comms.slice(-5).map((c, i, arr) => (
                  <div key={`${c}-${i}`} className={cn("truncate text-[10.5px]", i === arr.length - 1 ? "anim-rise text-ink" : "text-dim")}>
                    {c}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
