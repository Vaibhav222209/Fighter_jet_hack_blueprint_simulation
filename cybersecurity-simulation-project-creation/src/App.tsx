import { useState } from "react";
import Boot, { LogoMark } from "./components/Boot";
import ModuleExfil from "./components/ModuleExfil";
import ModuleOverview from "./components/ModuleOverview";
import ModuleSurveillance from "./components/ModuleSurveillance";
import ModuleTarget from "./components/ModuleTarget";
import ModuleTerminal from "./components/ModuleTerminal";
import { Meter } from "./components/ui";
import { LOG_POOL, OPERATOR } from "./data";
import { utc, useClock, useInterval } from "./hooks";
import { cn } from "./utils/cn";

type ModuleId = "overview" | "target" | "exfil" | "surveillance" | "terminal";

const NAV: { id: ModuleId; label: string; code: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Ops Overview",
    code: "00",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" /><rect x="9" y="1.5" width="5.5" height="5.5" />
        <rect x="1.5" y="9" width="5.5" height="5.5" /><rect x="9" y="9" width="5.5" height="5.5" />
      </svg>
    ),
  },
  {
    id: "target",
    label: "Target K-71",
    code: "71",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="5.5" /><path d="M8 0.5v3M8 12.5v3M0.5 8h3M12.5 8h3" />
        <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "exfil",
    label: "Exfiltration",
    code: "XF",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 5h9M8.5 2.5 11 5l-2.5 2.5M14 11H5M7.5 8.5 5 11l2.5 2.5" />
      </svg>
    ),
  },
  {
    id: "surveillance",
    label: "Surveillance",
    code: "SR",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M1 8s2.6-4.5 7-4.5S15 8 15 8s-2.6 4.5-7 4.5S1 8 1 8Z" /><circle cx="8" cy="8" r="2" />
      </svg>
    ),
  },
  {
    id: "terminal",
    label: "Terminal",
    code: "SH",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="m2 3.5 4 4.5-4 4.5M8.5 12.5H14" />
      </svg>
    ),
  },
];

function TopBar({ onLogout }: { onLogout: () => void }) {
  const now = useClock();
  const [ping, setPing] = useState(14);
  useInterval(() => setPing(8 + Math.floor(Math.random() * 26)), 2000);

  return (
    <header className="relative z-20 flex h-[54px] flex-none items-center gap-4 border-b border-line bg-panel/85 px-4 backdrop-blur">
      <button onClick={onLogout} className="flex items-center gap-3 text-left" title="Return to boot screen">
        <LogoMark className="h-8 w-8" />
        <div className="hidden sm:block">
          <div className="font-disp text-[15px] font-bold uppercase leading-none tracking-[0.14em] text-ink">
            Arthur <span className="text-haz">Weapons Factory</span>
          </div>
          <div className="mt-0.5 text-[8.5px] uppercase tracking-[0.4em] text-fnt">Tactical Ops Console v4.7.1</div>
        </div>
      </button>

      <div className="mx-auto hidden items-center gap-2 border border-al/40 bg-al/5 px-3 py-1 lg:flex">
        <span className="led led-al blinkc" />
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.3em] text-al">
          Top Secret // Arthur-71 // Exercise — Fictional Data
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="hidden text-[10px] tracking-[0.2em] text-fnt md:inline">
          PING <span className="text-cy">{ping} ms</span>
        </span>
        <span className="font-disp text-lg font-bold tracking-wider text-haz tabular-nums">{utc(now)}Z</span>
        <span className="hidden h-5 w-px bg-line md:block" />
        <span className="hidden items-center gap-2 md:flex">
          <span className="led led-ok" />
          <span className="text-[10px] tracking-[0.2em] text-dim">
            V. THAKUR // <span className="text-ink">COMMANDER</span>
          </span>
        </span>
      </div>
    </header>
  );
}

function Sidebar({
  module,
  goto,
  onLogout,
}: {
  module: ModuleId;
  goto: (m: ModuleId) => void;
  onLogout: () => void;
}) {
  const [cpu, setCpu] = useState(42);
  const [mem, setMem] = useState(63);
  const [net, setNet] = useState(28);
  useInterval(() => {
    setCpu(20 + Math.floor(Math.random() * 70));
    setMem(45 + Math.floor(Math.random() * 40));
    setNet(10 + Math.floor(Math.random() * 85));
  }, 1600);

  return (
    <aside className="flex flex-none flex-row items-stretch overflow-x-auto border-b border-line bg-panel/60 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
      <nav className="flex flex-1 flex-row md:flex-none md:flex-col md:py-3">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => goto(n.id)}
            className={cn(
              "flex flex-none items-center gap-3 border-l-2 px-4 py-3 text-left transition-all duration-150 md:w-full",
              module === n.id
                ? "border-haz bg-haz/8 text-haz"
                : "border-transparent text-dim hover:bg-lift/50 hover:text-ink"
            )}
          >
            <span className="flex-none">{n.icon}</span>
            <span className="font-disp text-[11px] font-semibold uppercase tracking-[0.2em]">{n.label}</span>
            <span className="ml-auto hidden text-[9px] tracking-[0.2em] text-fnt md:inline">{n.code}</span>
          </button>
        ))}
      </nav>

      <div className="hidden border-t border-line p-4 md:block">
        <div className="mb-3 text-[9px] uppercase tracking-[0.35em] text-fnt">System Vitals</div>
        {[
          ["CPU", cpu, "cy"],
          ["MEM", mem, "haz"],
          ["NET", net, "ok"],
        ].map(([k, v, t]) => (
          <div key={k as string} className="mb-2.5">
            <div className="mb-1 flex justify-between text-[9px] tracking-[0.25em] text-fnt">
              <span>{k}</span>
              <span className="text-dim">{v}%</span>
            </div>
            <Meter value={v as number} tone={t as "cy" | "haz" | "ok"} />
          </div>
        ))}
        <button onClick={onLogout} className="btn-tac btn-al mt-4 w-full justify-center !py-2 text-[10px]">
          ⏻ Logout
        </button>
        <div className="mt-3 text-center text-[8px] uppercase tracking-[0.3em] text-fnt">
          build by {OPERATOR}
        </div>
      </div>
    </aside>
  );
}

function Ticker() {
  const items = [...LOG_POOL, ...LOG_POOL];
  return (
    <footer className="relative z-20 flex h-[34px] flex-none items-center overflow-hidden border-t border-line bg-panel/85">
      <div className="flex h-full flex-none items-center gap-2 border-r border-line bg-al/10 px-3">
        <span className="led led-al blinkc" />
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-al">Event Bus</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="marq-track flex w-max items-center whitespace-nowrap py-2">
          {items.map((l, i) => (
            <span key={i} className="mx-5 text-[10px] tracking-wider text-dim">
              <span className="mr-2 text-haz">◆</span>
              {l}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [module, setModule] = useState<ModuleId>("overview");
  const [breach, setBreach] = useState(false);
  const [exfilMB, setExfilMB] = useState(0);
  const [packets, setPackets] = useState(48211);

  if (!booted) return <Boot onDone={() => setBooted(true)} />;

  const logout = () => {
    setBooted(false);
    setModule("overview");
  };

  return (
    <div className="bg-rig relative h-screen overflow-hidden">
      {/* ambient layers */}
      <div className="scanlines pointer-events-none fixed inset-0 z-[60] opacity-50" />
      <div className="noise pointer-events-none fixed inset-0 z-[60]" />
      <div className="vignette pointer-events-none fixed inset-0 z-[55]" />
      <div className="sweepband pointer-events-none fixed inset-x-0 z-[55]" />

      <div className="relative z-10 flex h-full flex-col">
        <TopBar onLogout={logout} />
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <Sidebar module={module} goto={setModule} onLogout={logout} />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
            <div key={module} className="anim-rise mx-auto max-w-[1440px]">
              {module === "overview" && (
                <ModuleOverview breach={breach} exfilMB={exfilMB} packets={packets} goto={setModule} />
              )}
              {module === "target" && <ModuleTarget breach={breach} onBreach={() => setBreach(true)} />}
              {module === "exfil" && (
                <ModuleExfil
                  addExfil={(mb) => setExfilMB((v) => v + mb)}
                  addPackets={(n) => setPackets((v) => v + n)}
                />
              )}
              {module === "surveillance" && <ModuleSurveillance />}
              {module === "terminal" && (
                <ModuleTerminal
                  breach={breach}
                  onBreach={() => setBreach(true)}
                  goto={(m) => setModule(m)}
                />
              )}
            </div>
          </main>
        </div>
        <Ticker />
      </div>
    </div>
  );
}
