import { useState } from "react";
import { EXFIL_FILES } from "../data";
import { useInterval } from "../hooks";
import { cn } from "../utils/cn";
import { Led, Meter, Panel, SectionHead, Stat, Tag } from "./ui";

function fmtSize(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

export default function ModuleExfil({
  addExfil,
  addPackets,
}: {
  addExfil: (mb: number) => void;
  addPackets: (n: number) => void;
}) {
  const [prog, setProg] = useState<number[]>(() => EXFIL_FILES.map(() => 0));
  const [running, setRunning] = useState(false);
  const [boost, setBoost] = useState(false);
  const [aborted, setAborted] = useState(false);
  const [rate, setRate] = useState(0);
  const [buf, setBuf] = useState<number[]>(() => Array(48).fill(0));
  const [cmds, setCmds] = useState<string[]>([
    "arthur@ops:~$ exfil --target 10.71.0.7 --grab '/classified/**' --tunnel chaff",
    "[tunnel] chaff relay established · 3 hops · xchacha20",
  ]);

  const doneCount = prog.filter((p) => p >= 100).length;
  const allDone = doneCount === EXFIL_FILES.length;
  const totalMB = EXFIL_FILES.reduce((acc, f, i) => acc + (f.size * prog[i]) / 100, 0);

  useInterval(() => {
    if (!running) {
      setRate((r) => r * 0.82);
      setBuf((b) => [...b.slice(1), 0]);
      return;
    }
    const speed = boost ? 3.2 : 1;
    const idx = prog.findIndex((p) => p < 100);
    if (idx === -1) {
      setRunning(false);
      return;
    }
    const file = EXFIL_FILES[idx];
    const inc = (16 / Math.log2(file.size * 10 + 4)) * speed * (0.7 + Math.random() * 0.6);
    setProg((prev) => {
      const next = [...prev];
      next[idx] = Math.min(100, prev[idx] + inc);
      return next;
    });
    const deltaMB = (file.size * inc) / 100;
    addExfil(deltaMB);
    addPackets(Math.round(inc * 24));
    setRate(deltaMB / 0.14);
    setBuf((b) => [...b.slice(1), deltaMB / 0.14]);
    if (prog[idx] + inc >= 100) {
      setCmds((c) => [...c, `scp root@10.71.0.7:${file.path} ./vault/  ✓ ${fmtSize(file.size)} · sha512 ok`].slice(-14));
    }
  }, 140);

  const max = Math.max(1, ...buf);
  const pts = buf.map((v, i) => `${(i / (buf.length - 1)) * 300},${76 - (v / max) * 68}`).join(" ");

  const start = () => {
    if (allDone) return;
    setAborted(false);
    setRunning(true);
  };
  const abort = () => {
    setRunning(false);
    setAborted(true);
    setCmds((c) => [...c, "!! ABORT — tunnel collapsed, shards shredded"].slice(-14));
  };
  const reset = () => {
    setProg(EXFIL_FILES.map(() => 0));
    setRunning(false);
    setAborted(false);
    setRate(0);
    setBuf(Array(48).fill(0));
    setCmds(["arthur@ops:~$ exfil --target 10.71.0.7 --grab '/classified/**' --tunnel chaff"]);
  };

  return (
    <div>
      <SectionHead
        kicker="Data Operations // Target → Vault"
        title="Exfiltration Pipeline"
        right={
          <>
            <Tag tone={running ? "ok" : aborted ? "al" : allDone ? "cy" : "haz"}>
              <Led tone={running ? "ok" : aborted ? "al" : allDone ? "cy" : "haz"} blink={running} />
              {allDone ? "Vault Sealed" : running ? "Streaming" : aborted ? "Aborted" : "Idle"}
            </Tag>
          </>
        }
      />

      {/* stats */}
      <div className="anim-rise mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Panel noPad bodyClass="p-4" title="Exfiltrated">
          <Stat label="session total" value={totalMB >= 1024 ? (totalMB / 1024).toFixed(2) : totalMB.toFixed(1)} unit={totalMB >= 1024 ? "GB" : "MB"} tone="haz" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Files Recovered">
          <Stat label="of 8 targets" value={String(doneCount).padStart(2, "0")} unit="/ 08" tone="cy" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Throughput" tone="cy">
          <Stat label="current" value={rate.toFixed(1)} unit="MB/s" tone="cy" />
        </Panel>
        <Panel noPad bodyClass="p-4" title="Integrity">
          <Stat label="sha-512" value={aborted ? "—.—" : "100"} unit={aborted ? "" : "%"} tone={aborted ? "al" : "ok"} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        {/* conduit */}
        <Panel title="Transfer Conduit" code="XFL-01" className="anim-rise xl:col-span-7">
          <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)]">
            <div className="border border-al/40 bg-al/5 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-disp text-xs font-semibold tracking-[0.2em] text-al">TARGET MACHINE</span>
                <Led tone="al" blink />
              </div>
              <div className="space-y-1 text-[11px] text-dim">
                <div>HOST <span className="float-right text-ink">K71-MAINFRAME</span></div>
                <div>ADDR <span className="float-right text-ink">10.71.0.7</span></div>
                <div>OS <span className="float-right text-ink">WatsonRTOS 9.4</span></div>
                <div>ROOT <span className="float-right text-ok">own ✓</span></div>
              </div>
            </div>

            <svg viewBox="0 0 130 120" className="mx-auto h-28 w-full max-w-[150px]">
              <path d="M6,60 C40,20 90,100 124,60" fill="none" stroke="#34485F" strokeWidth="1.2" />
              <path d="M6,60 C40,20 90,100 124,60" fill="none" stroke="#F2B33D" strokeWidth="1.6" className="dashline" />
              <circle r="3.6" fill="#49D7E8">
                <animateMotion dur="1.3s" repeatCount="indefinite" path="M6,60 C40,20 90,100 124,60" />
              </circle>
              <circle r="2.4" fill="#F2B33D">
                <animateMotion dur="1.3s" begin="0.65s" repeatCount="indefinite" path="M6,60 C40,20 90,100 124,60" />
              </circle>
              <text x="65" y="112" textAnchor="middle" fill="#5A6F85" fontSize="8" fontFamily="IBM Plex Mono" letterSpacing="1.5">TLS-CHAFF · 3 HOPS</text>
            </svg>

            <div className="border border-ok/40 bg-ok/5 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-disp text-xs font-semibold tracking-[0.2em] text-ok">ATTACKER MACHINE</span>
                <Led tone="ok" blink />
              </div>
              <div className="space-y-1 text-[11px] text-dim">
                <div>HOST <span className="float-right text-ink">ARTHUR-OPS</span></div>
                <div>ADDR <span className="float-right text-ink">192.168.7.7</span></div>
                <div>OS <span className="float-right text-ink">ArthurOS 4.7 (Kali-derivative)</span></div>
                <div>VAULT <span className="float-right text-haz">OPEN ▸</span></div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <button onClick={running ? () => setRunning(false) : start} disabled={allDone} className="btn-tac btn-haz clip-cut flex-1 justify-center">
              {running ? "❚❚ Pause Stream" : "▸ Run Exfiltration"}
            </button>
            <button onClick={() => setBoost((b) => !b)} className={cn("btn-tac flex-1 justify-center", boost && "!border-cy !text-cy shadow-[0_0_18px_rgba(73,215,232,0.25)]")}>
              ⚡ Boost ×3.2 {boost ? "ON" : "OFF"}
            </button>
            <button onClick={abort} disabled={!running} className="btn-tac btn-al flex-1 justify-center">✕ Abort</button>
            <button onClick={reset} className="btn-tac flex-1 justify-center">↺ Reset</button>
          </div>
        </Panel>

        {/* throughput */}
        <Panel title="Throughput Monitor" code="THRU-7" className="anim-rise xl:col-span-5" tone="cy">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-disp text-4xl font-bold text-cy xl:text-5xl">{rate.toFixed(1)}</div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.35em] text-fnt">megabytes / second</div>
            </div>
            <Tag tone={boost ? "cy" : "dim"}>{boost ? "BOOST ENGAGED" : "NOMINAL"}</Tag>
          </div>
          <svg viewBox="0 0 300 80" className="mt-4 h-24 w-full" preserveAspectRatio="none">
            <line x1="0" y1="76" x2="300" y2="76" stroke="rgba(52,72,95,0.8)" strokeWidth="1" />
            <line x1="0" y1="8" x2="300" y2="8" stroke="rgba(52,72,95,0.35)" strokeWidth="1" strokeDasharray="2 4" />
            <polyline points={pts} fill="none" stroke="#49D7E8" strokeWidth="1.8" />
            <polygon points={`0,76 ${pts} 300,76`} fill="rgba(73,215,232,0.1)" />
          </svg>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
            {[
              ["CIPHER", "XCHACHA20"],
              ["JITTER", "MASKED"],
              ["IDS", "BLIND"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[8px] tracking-[0.3em] text-fnt">{k}</div>
                <div className="text-[10px] font-semibold tracking-wider text-dim">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* queue */}
        <Panel title="Transfer Queue" code="Q-88" className="anim-rise xl:col-span-7" noPad bodyClass="p-0">
          <div className="divide-y divide-line/70">
            {EXFIL_FILES.map((f, i) => {
              const p = prog[i];
              const active = running && p < 100 && prog.slice(0, i).every((x) => x >= 100);
              const state = p >= 100 ? "DONE" : aborted && p < 100 && !running ? "HELD" : active ? "ACTIVE" : "QUEUED";
              return (
                <div key={f.path} className={cn("flex items-center gap-3 px-4 py-2.5", active && "bg-haz/5")}>
                  <span className="w-5 text-[10px] text-fnt">{String(i + 1).padStart(2, "0")}</span>
                  <Tag tone={state === "DONE" ? "ok" : state === "ACTIVE" ? "haz" : state === "HELD" ? "al" : "dim"} className="w-16 justify-center">
                    {f.kind}
                  </Tag>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] text-ink">{f.path}</div>
                    <Meter value={p} tone={state === "DONE" ? "ok" : "haz"} striped={active} className="mt-1.5" />
                  </div>
                  <span className="w-16 text-right text-[10px] text-fnt">{fmtSize(f.size)}</span>
                  <span className={cn("w-12 text-right font-disp text-xs font-semibold", p >= 100 ? "text-ok" : active ? "text-haz" : "text-dim")}>
                    {Math.floor(p)}%
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* session log */}
        <Panel title="Session Log" code="TTY-3" className="anim-rise xl:col-span-5" noPad bodyClass="p-4">
          <div className="space-y-1.5 text-[11px] leading-relaxed">
            {cmds.slice(-9).map((c, i) => (
              <div key={i} className={c.startsWith("!!") ? "text-al" : c.startsWith("[tunnel]") ? "text-fnt" : c.startsWith("scp") ? "text-dim" : "text-ok"}>
                {c}
              </div>
            ))}
            {allDone && (
              <div className="mt-2 border border-ok/40 bg-ok/10 px-3 py-2 text-center font-disp text-xs font-semibold tracking-[0.25em] text-ok">
                ✓ VAULT SEALED — {fmtSize(totalMB)} ACQUIRED
              </div>
            )}
            <div className="flex items-center gap-2 text-ok">
              <span className="text-fnt">arthur@ops:~$</span>
              <span className="blinkc inline-block h-3.5 w-2 bg-ok" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
