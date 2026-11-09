import { useEffect, useState } from "react";
import { LOG_POOL } from "../data";
import { useInterval, utc } from "../hooks";
import { cn } from "../utils/cn";
import { Led, Meter, Panel, SectionHead, Stat, Tag } from "./ui";

type ModuleId = "overview" | "target" | "exfil" | "surveillance" | "terminal";

export default function ModuleOverview({
  breach,
  exfilMB,
  packets,
  goto,
}: {
  breach: boolean;
  exfilMB: number;
  packets: number;
  goto: (m: ModuleId) => void;
}) {
  const [feed, setFeed] = useState<{ t: string; msg: string }[]>([]);
  const [uptime, setUptime] = useState(0);

  useInterval(() => {
    setUptime((u) => u + 1);
  }, 1000);

  useInterval(() => {
    const msg = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
    setFeed((f) => [{ t: utc(new Date()), msg }, ...f].slice(0, 9));
  }, 1500);

  useEffect(() => {
    // seed feed so the panel never looks empty
    setFeed(
      LOG_POOL.slice(0, 6).map((msg, i) => ({
        t: utc(new Date(Date.now() - i * 9000)),
        msg,
      }))
    );
  }, []);

  const up = `${String(Math.floor(uptime / 3600)).padStart(2, "0")}:${String(Math.floor((uptime % 3600) / 60)).padStart(2, "0")}:${String(uptime % 60).padStart(2, "0")}`;

  return (
    <div>
      <SectionHead
        kicker="Operation Ironveil // Live Theatre"
        title="Ops Overview"
        right={
          <>
            <Tag tone="al">Threatcon Elevated</Tag>
            <Tag tone="ok">
              <Led tone="ok" blink /> Grid Secure
            </Tag>
          </>
        }
      />

      {/* stat strip */}
      <div className="anim-rise mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4" style={{ animationDelay: "60ms" }}>
        <Panel noPad bodyClass="p-4" title="Packets Intercepted" tone="cy">
          <Stat label="since 00:00Z" value={packets.toLocaleString()} tone="cy" />
          <Meter value={(packets % 97) + 3} tone="cy" className="mt-3" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Data Exfiltrated" tone="haz">
          <Stat label="into vault" value={exfilMB >= 1024 ? (exfilMB / 1024).toFixed(2) : exfilMB.toFixed(1)} unit={exfilMB >= 1024 ? "GB" : "MB"} tone="haz" />
          <Meter value={(exfilMB / 14.6) % 100} tone="haz" striped className="mt-3" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Active Nodes">
          <Stat label="relay mesh" value="07" unit="/ 09" tone="ok" />
          <Meter value={78} tone="ok" className="mt-3" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Console Uptime">
          <Stat label="this session" value={up} tone="ink" />
          <Meter value={(uptime % 60) * 1.67} tone="cy" className="mt-3" />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        {/* network interdiction */}
        <Panel title="Interdiction Route" code="NET-01" className="anim-rise xl:col-span-7" tone="cy">
          <svg viewBox="0 0 660 220" className="h-auto w-full">
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#F2B33D" />
              </marker>
            </defs>
            {/* node: target */}
            <g>
              <rect x="14" y="70" width="172" height="80" fill="rgba(255,93,93,0.06)" stroke="#FF5D5D" strokeWidth="1.2" />
              <text x="28" y="96" fill="#FF5D5D" fontSize="12" fontWeight="600" fontFamily="Chakra Petch" letterSpacing="1.5">K71-MAINFRAME</text>
              <text x="28" y="116" fill="#8CA0B3" fontSize="10.5" fontFamily="IBM Plex Mono">10.71.0.7 · WatsonRTOS 9.4</text>
              <text x="28" y="134" fill="#5FDD8A" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.5">STATE: BREACHED</text>
              <circle cx="170" cy="86" r="4" fill="#FF5D5D" className="blinkc" />
            </g>
            {/* node: relay */}
            <g>
              <rect x="246" y="70" width="168" height="80" fill="rgba(73,215,232,0.06)" stroke="#34485F" strokeWidth="1.2" />
              <text x="260" y="96" fill="#49D7E8" fontSize="12" fontWeight="600" fontFamily="Chakra Petch" letterSpacing="1.5">TOR CHAFF RELAY</text>
              <text x="260" y="116" fill="#8CA0B3" fontSize="10.5" fontFamily="IBM Plex Mono">awf-ops.onion · 3 hops</text>
              <text x="260" y="134" fill="#8CA0B3" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.5">EXIT: IS-REYKJAVÍK</text>
            </g>
            {/* node: attacker */}
            <g>
              <rect x="474" y="70" width="172" height="80" fill="rgba(95,221,138,0.06)" stroke="#5FDD8A" strokeWidth="1.2" />
              <text x="488" y="96" fill="#5FDD8A" fontSize="12" fontWeight="600" fontFamily="Chakra Petch" letterSpacing="1.5">ARTHUR-OPS</text>
              <text x="488" y="116" fill="#8CA0B3" fontSize="10.5" fontFamily="IBM Plex Mono">192.168.7.7 · ArthurOS 4.7</text>
              <text x="488" y="134" fill="#F2B33D" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.5">VAULT: OPEN</text>
              <circle cx="630" cy="86" r="4" fill="#5FDD8A" className="blinkc" />
            </g>
            {/* conduit */}
            <path d="M186,110 L246,110" stroke="#F2B33D" strokeWidth="1.4" className="dashline" markerEnd="url(#arr)" />
            <path d="M414,110 L474,110" stroke="#F2B33D" strokeWidth="1.4" className="dashline" markerEnd="url(#arr)" />
            <circle r="3.4" fill="#49D7E8">
              <animateMotion dur="1.5s" repeatCount="indefinite" path="M186,110 L246,110" />
            </circle>
            <circle r="3.4" fill="#49D7E8">
              <animateMotion dur="1.5s" begin="0.5s" repeatCount="indefinite" path="M414,110 L474,110" />
            </circle>
            <circle r="2.2" fill="#F2B33D">
              <animateMotion dur="1.5s" begin="1s" repeatCount="indefinite" path="M186,110 L246,110" />
            </circle>
            <text x="330" y="60" textAnchor="middle" fill="#5A6F85" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="2.5">
              TLS-CHAFFED TUNNEL · XCHACHA20 · LATENCY 412 ms
            </text>
            <text x="330" y="180" textAnchor="middle" fill="#F2B33D" fontSize="11" fontFamily="Chakra Petch" letterSpacing="3">
              TARGET MACHINE ▸▸▸ ATTACKER MACHINE
            </text>
            <text x="330" y="198" textAnchor="middle" fill="#5A6F85" fontSize="9.5" fontFamily="IBM Plex Mono" letterSpacing="2">
              entropy 7.94 bits/B · jitter masked · IDS blind
            </text>
          </svg>
        </Panel>

        {/* live feed */}
        <Panel
          title="Live Intercept Feed"
          code="SIG-09"
          className="anim-rise xl:col-span-5"
          right={<Led tone="al" blink />}
          noPad
          bodyClass="p-3"
        >
          <div className="space-y-1.5">
            {feed.map((l, i) => (
              <div key={l.t + i} className={cn("flex gap-2.5 text-[11px] leading-snug", i === 0 && "anim-rise")}>
                <span className="flex-none text-fnt">{l.t}</span>
                <span className={i === 0 ? "text-ink" : "text-dim"}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* mission phases */}
        <Panel title="Mission Phases" code="OP-PLAN" className="anim-rise xl:col-span-4">
          <div className="space-y-3.5">
            {[
              { n: "01", name: "RECON & MAPPING", st: breach ? "COMPLETE" : "COMPLETE", tone: "ok" as const, v: 100 },
              { n: "02", name: "BREACH K71-MAINFRAME", st: breach ? "COMPLETE" : "STANDBY", tone: breach ? ("ok" as const) : ("haz" as const), v: breach ? 100 : 0 },
              { n: "03", name: "EXFILTRATION", st: "IN PROGRESS", tone: "haz" as const, v: Math.min(99, (exfilMB / 1462) * 100) },
              { n: "04", name: "COVER & BURN", st: "QUEUED", tone: "dim" as const, v: 0 },
            ].map((p) => (
              <div key={p.n}>
                <div className="mb-1 flex items-center gap-2 text-[11px]">
                  <span className="font-disp text-haz">{p.n}</span>
                  <span className="tracking-wider text-ink">{p.name}</span>
                  <Tag tone={p.tone === "dim" ? "dim" : p.tone} className="ml-auto">{p.st}</Tag>
                </div>
                <Meter value={p.v} tone={p.tone === "dim" ? "haz" : p.tone} striped={p.st === "IN PROGRESS"} />
              </div>
            ))}
          </div>
          <button onClick={() => goto(breach ? "exfil" : "target")} className="btn-tac btn-haz clip-cut mt-5 w-full justify-center">
            {breach ? "▸ Resume Exfiltration" : "▸ Begin Breach Protocol"}
          </button>
        </Panel>

        {/* radar */}
        <Panel title="Airspace Sweep" code="RAD-2" className="anim-rise xl:col-span-3" tone="cy">
          <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[220px]">
            {[30, 60, 90].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(73,215,232,0.22)" strokeWidth="1" />
            ))}
            <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(73,215,232,0.15)" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(73,215,232,0.15)" />
            <g className="radar-sweep">
              <path d="M100,100 L100,10 A90,90 0 0 1 163,36 Z" fill="rgba(95,221,138,0.14)" />
              <line x1="100" y1="100" x2="100" y2="10" stroke="#5FDD8A" strokeWidth="1.4" />
            </g>
            {[
              [132, 66],
              [64, 128],
              [146, 142],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="9" fill="none" stroke="#5FDD8A" strokeWidth="1" className="hsring" />
                <circle cx={x} cy={y} r="2.6" fill="#5FDD8A" />
              </g>
            ))}
            <text x="100" y="196" textAnchor="middle" fill="#5A6F85" fontSize="8.5" fontFamily="IBM Plex Mono" letterSpacing="2">
              3 TRACKS · IFF NEGATIVE
            </text>
          </svg>
        </Panel>

        {/* target snapshot */}
        <Panel title="Target Snapshot" code="TGT-71" className="anim-rise xl:col-span-5" noPad bodyClass="p-0">
          <div className="relative">
            <img src="img/jet-hangar.jpg" alt="K-71 Watson in hangar" className="crt h-40 w-full object-cover opacity-80" />
            <div className="scanlines pointer-events-none absolute inset-0 opacity-70" />
            <div className="absolute left-3 top-3">
              <Tag tone="al">Priority-Alpha</Tag>
            </div>
            <div className="absolute bottom-3 left-3">
              <div className="font-disp text-xl font-bold tracking-wider text-ink drop-shadow">K-71 “WATSON”</div>
              <div className="text-[10px] tracking-[0.3em] text-dim">6TH-GEN STEALTH DEMONSTRATOR</div>
            </div>
            <div className="absolute bottom-3 right-3">
              <Tag tone={breach ? "ok" : "haz"}>{breach ? "Compromised" : "Hardened"}</Tag>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
            {[
              ["RCS", "−42 dBsm"],
              ["MACH", "2.41"],
              ["BAYS", "03"],
            ].map(([k, v]) => (
              <div key={k} className="py-2.5">
                <div className="text-[9px] tracking-[0.3em] text-fnt">{k}</div>
                <div className="font-disp text-sm font-semibold text-cy">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-line p-3">
            <button onClick={() => goto("target")} className="btn-tac flex-1 justify-center">Open Dossier</button>
            <button onClick={() => goto("surveillance")} className="btn-tac flex-1 justify-center">Watchlist</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
