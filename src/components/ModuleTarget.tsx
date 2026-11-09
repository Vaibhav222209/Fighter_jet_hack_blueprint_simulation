import { useEffect, useMemo, useRef, useState } from "react";
import { EXFIL_FILES, SOURCE_CODE, SPECS, SUBSYSTEMS } from "../data";
import { cn } from "../utils/cn";
import JetBlueprint from "./JetBlueprint";
import { Led, Meter, Panel, SectionHead, Tag } from "./ui";

const BREACH_STEPS = [
  "> arthur breach --target 10.71.0.7 --quiet",
  "[1/6] SYN sweep 10.71.0.7:1-1024 ........ 4 hosts up",
  "[2/6] port 4431/tcp OPEN  svc=WATSON-MAINT",
  "[3/6] fingerprint: WatsonRTOS 9.4 (build 7711)",
  "[4/6] vuln match: CVE-2077-1337 “FALCONBLEED” (CRITICAL)",
  "[5/6] payload staged → 0x7FFE1140 · shellcode 412 B",
  "[6/6] escalating: maint → root ........... OK",
  "ROOT SHELL ON K71-MAINFRAME — SESSION ENCRYPTED (XCHACHA20)",
];

const SEV_TONE = { CRITICAL: "al", HIGH: "haz", MEDIUM: "cy", LOW: "dim" } as const;

// ---- tiny C syntax highlighter ----------------------------------------
const TOKEN =
  /(\/\/.*)|("(?:[^"\\]|\\.)*")|(#[ \t]*\w+)|\b(int|void|float|char|static|const|volatile|enum|struct|typedef|return|if|else|while|for|switch|case|break|uint8_t|uint16_t|uint32_t|int32_t|size_t|bool|true|false|NULL)\b|\b(\d+\.?\d*[fFuUxX]*)\b|([A-Za-z_]\w*)(?=\s*\()/g;

function renderLine(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  let k = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(<span key={k++} className="text-ink/85">{line.slice(last, m.index)}</span>);
    const cls = m[1]
      ? "italic text-fnt"
      : m[2]
        ? "text-ok"
        : m[3]
          ? "text-cy"
          : m[4]
            ? "text-haz"
            : m[5]
              ? "text-[#ff8a5c]"
              : "text-cy";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<span key={k++} className="text-ink/85">{line.slice(last)}</span>);
  return out;
}

function hexDump(seed: string, rows: number): string[] {
  let h = 7;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const lines: string[] = [];
  for (let i = 0; i < rows; i++) {
    const bytes: string[] = [];
    for (let b = 0; b < 8; b++) {
      h = (h * 1103515245 + 12345) >>> 0;
      bytes.push(((h >>> 16) & 0xff).toString(16).padStart(2, "0"));
    }
    lines.push(`${(i * 8).toString(16).padStart(8, "0")}  ${bytes.join(" ")}`);
  }
  return lines;
}

export default function ModuleTarget({ breach, onBreach }: { breach: boolean; onBreach: () => void }) {
  const [selected, setSelected] = useState<string>("fcs");
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState(-1);
  const [showVault, setShowVault] = useState(false);
  const [file, setFile] = useState(EXFIL_FILES[0].path);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (breach) setPhase(BREACH_STEPS.length - 1);
  }, [breach]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const sys = useMemo(() => SUBSYSTEMS.find((s) => s.id === selected) ?? SUBSYSTEMS[0], [selected]);
  const granted = breach || phase >= BREACH_STEPS.length - 1;
  const running = phase >= 0 && !granted;

  const runBreach = () => {
    if (running || granted) return;
    setPhase(0);
    let acc = 0;
    BREACH_STEPS.forEach((_, i) => {
      acc += i === 0 ? 350 : 620 + Math.random() * 420;
      const t = window.setTimeout(() => {
        setPhase(i);
        if (i === BREACH_STEPS.length - 1) onBreach();
      }, acc);
      timers.current.push(t);
    });
  };

  const exploit = (id: string) => {
    setOwned((o) => new Set(o).add(id));
  };

  const isMainFile = file === EXFIL_FILES[0].path;
  const lines = isMainFile ? SOURCE_CODE.split("\n") : null;
  const stub = useMemo(
    () => [
      `// ${file} — EXFILTRATED PARTIAL`,
      "// CHECKSUM OK · DECRYPTION PENDING KEYRING SHARD 3/9",
      "",
      ...hexDump(file, 10),
    ],
    [file]
  );
  const shown = lines ?? stub;

  return (
    <div>
      <SectionHead
        kicker="Target Dossier // Priority-Alpha"
        title="K-71 “Watson”"
        right={
          <>
            <Tag tone="al">TS//SCI//NOFORN</Tag>
            <Tag tone={granted ? "ok" : "haz"}>
              <Led tone={granted ? "ok" : "haz"} blink={!granted} />
              {granted ? "Compromised" : "Hardened"}
            </Tag>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-12">
        {/* blueprint */}
        <Panel title="Structural Blueprint" code="DWG 7711-C · REV 11.3" className="anim-rise xl:col-span-8" tone="cy">
          <JetBlueprint selected={selected} owned={owned} onSelect={setSelected} />

          {/* subsystem interrogator */}
          <div className="mt-4 border-t border-line pt-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-disp text-sm font-bold tracking-[0.15em] text-haz">{sys.code}</span>
              <span className="font-disp text-sm font-semibold tracking-wide text-ink">{sys.name}</span>
              {owned.has(sys.id) && <Tag tone="ok">Exploited ✓</Tag>}
            </div>
            <p className="mb-3 max-w-3xl text-xs leading-relaxed text-dim">{sys.desc}</p>
            <div className="grid gap-2 border border-line bg-panel/70 p-3 md:grid-cols-[auto_auto_1fr_auto] md:items-center">
              <Tag tone={SEV_TONE[sys.vuln.sev]}>{sys.vuln.sev}</Tag>
              <span className="text-[11px] font-semibold text-al">{sys.vuln.cve}</span>
              <span className="text-[11px] text-dim">
                <span className="text-cy">{sys.vuln.name}</span> — {sys.vuln.vec}
              </span>
              <button onClick={() => exploit(sys.id)} disabled={owned.has(sys.id)} className="btn-tac btn-haz !py-1.5 text-[10px]">
                {owned.has(sys.id) ? "✓ Owned" : "▸ Run Exploit"}
              </button>
            </div>
          </div>
        </Panel>

        {/* right column */}
        <div className="anim-rise flex flex-col gap-4 xl:col-span-4" style={{ animationDelay: "90ms" }}>
          <Panel title="Optical Recon" code="KH-11 · FRAME 0719" noPad bodyClass="p-0">
            <div className="relative">
              <img src="img/jet-hangar.jpg" alt="K-71 hangar reconnaissance" className="crt h-44 w-full object-cover opacity-85" />
              <div className="scanlines pointer-events-none absolute inset-0 opacity-70" />
              <div className="absolute left-2.5 top-2.5 text-[9px] tracking-[0.25em] text-ok">● REC 03:41Z</div>
              <div className="absolute bottom-2.5 right-2.5 text-[9px] tracking-[0.25em] text-dim">HANGAR 9 · IR GAIN 0.7</div>
            </div>
          </Panel>

          <Panel title="Specifications" code="EST. — FICTIONAL" noPad bodyClass="p-0">
            <div className="divide-y divide-line/70">
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 px-4 py-1.5 text-[10.5px]">
                  <span className="flex-none tracking-[0.18em] text-fnt">{k}</span>
                  <span className="text-right text-dim">{v}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Breach Protocol" code="EXP-77" tone={granted ? "cy" : "haz"}>
            <div className="min-h-[172px] space-y-1 text-[11px] leading-relaxed">
              {phase < 0 && (
                <div className="text-fnt">
                  &gt; maintenance port 4431/tcp detected on K71-MAINFRAME.
                  <br />
                  &gt; awaiting operator command…
                </div>
              )}
              {BREACH_STEPS.slice(0, Math.max(0, phase + 1)).map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    i === BREACH_STEPS.length - 1 ? "font-semibold text-ok" : s.startsWith("[4/6]") || s.includes("CRITICAL") ? "text-al" : s.startsWith(">") ? "text-haz" : "text-dim"
                  )}
                >
                  {s}
                </div>
              ))}
              {running && <span className="blinkc inline-block h-3.5 w-2 bg-haz align-middle" />}
            </div>
            {running && <Meter value={((phase + 1) / BREACH_STEPS.length) * 100} tone="haz" striped className="mt-3" />}
            <div className="mt-4">
              {!granted ? (
                <button onClick={runBreach} disabled={running} className="btn-tac btn-haz clip-cut w-full justify-center !py-3">
                  {running ? "◈ Breach In Progress…" : "▸ Initiate Breach Protocol"}
                </button>
              ) : (
                <button onClick={() => setShowVault((v) => !v)} className="btn-tac w-full justify-center !py-3 !border-ok/60 !text-ok hover:!shadow-[0_0_18px_rgba(95,221,138,0.25)]">
                  {showVault ? "❚❚ Seal Source Vault" : "▸ Open Source Vault"}
                </button>
              )}
            </div>
          </Panel>
        </div>

        {/* source vault */}
        <div className="anim-rise xl:col-span-12" style={{ animationDelay: "140ms" }}>
          {!granted ? (
            <div className="panel relative overflow-hidden p-8 text-center">
              <div className="hazard-tape absolute inset-x-0 top-0 h-2 opacity-70" />
              <div className="hazard-tape absolute inset-x-0 bottom-0 h-2 opacity-70" />
              <div className="font-disp text-lg font-bold uppercase tracking-[0.3em] text-al">⛔ Source Vault Locked</div>
              <div className="mt-2 text-xs tracking-[0.2em] text-fnt">
                RUN BREACH PROTOCOL TO UNSEAL · KEYRING REQUIRES ROOT ON K71-MAINFRAME
              </div>
            </div>
          ) : (
            <Panel
              title="Source Vault — Exfiltrated Code"
              code="DEC-09 · XCHACHA20"
              tone="cy"
              noPad
              bodyClass="p-0"
              right={<Tag tone="ok">Decrypted</Tag>}
            >
              <div className={cn("grid transition-opacity", showVault ? "opacity-100" : "max-h-0 overflow-hidden opacity-0")} style={showVault ? undefined : { padding: 0 }}>
                <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                  {/* file tree */}
                  <div className="border-b border-line md:border-b-0 md:border-r">
                    <div className="border-b border-line px-3 py-2 text-[9px] uppercase tracking-[0.3em] text-fnt">
                      vault/ · {EXFIL_FILES.length} objects
                    </div>
                    <div className="max-h-[460px] overflow-auto">
                      {EXFIL_FILES.map((f) => (
                        <button
                          key={f.path}
                          onClick={() => setFile(f.path)}
                          className={cn(
                            "flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left text-[10.5px] transition-colors",
                            file === f.path ? "border-haz bg-haz/10 text-hazlt" : "border-transparent text-dim hover:bg-lift/60 hover:text-ink"
                          )}
                        >
                          <span className="text-fnt">{f.kind}</span>
                          <span className="truncate">{f.path.split("/").pop()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* code */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
                      <span className="truncate text-[11px] text-cy">{file}</span>
                      <span className="text-[9px] tracking-[0.2em] text-fnt">{isMainFile ? "REV 9.4.1 · BUILD 7711" : "PARTIAL DUMP"}</span>
                      <Tag tone="al" className="ml-auto">TS//SCI</Tag>
                    </div>
                    <div className="max-h-[460px] overflow-auto bg-[#0b1017]">
                      <div className="min-w-max px-2 py-3 text-[11.5px] leading-[1.55]">
                        {shown.map((ln, i) => (
                          <div key={i} className="flex">
                            <span className="w-10 flex-none select-none border-r border-line/60 pr-3 text-right text-[10px] leading-[1.8] text-fnt">
                              {i + 1}
                            </span>
                            <span className="whitespace-pre pl-3">
                              {isMainFile ? renderLine(ln) : <span className="text-dim">{ln}</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-line px-4 py-2 text-[9.5px] tracking-[0.2em] text-fnt">
                      ⚠ FICTIONAL SOURCE — EDUCATIONAL SIMULATION · REAL K-71 SOURCE IS CLASSIFIED AND NOWHERE NEAR A WEB BROWSER
                    </div>
                  </div>
                </div>
              </div>
              {!showVault && (
                <div className="p-6 text-center text-[11px] tracking-[0.25em] text-fnt">
                  VAULT UNSEALED — PRESS “OPEN SOURCE VAULT” TO READ THE CROWN JEWELS
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
