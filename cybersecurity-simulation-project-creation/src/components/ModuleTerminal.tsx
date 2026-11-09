import { useEffect, useRef, useState } from "react";
import { CONTRACTORS, FAKE_LS, OPERATOR } from "../data";
import { cn } from "../utils/cn";

type Tone = "in" | "out" | "err" | "ok" | "sys";
type Line = { text: string; tone: Tone };

const TONE_CLS: Record<Tone, string> = {
  in: "text-haz",
  out: "text-dim",
  err: "text-al",
  ok: "text-ok",
  sys: "text-cy",
};

const BANNER: Line[] = [
  { text: "ARTHUR-TERM v4.7 — secure shell over chaff tunnel (3 hops)", tone: "sys" },
  { text: `(c) Arthur Weapons Factory · operator ${OPERATOR} · clearance COMMANDER`, tone: "sys" },
  { text: "Type 'help' for the command list. Every byte in here is fictional.", tone: "out" },
];

export default function ModuleTerminal({
  breach,
  onBreach,
  goto,
}: {
  breach: boolean;
  onBreach: () => void;
  goto: (m: "overview" | "target" | "exfil" | "surveillance") => void;
}) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const say = (out: Line[], echo?: string) => {
    setLines((l) => [...l, ...(echo !== undefined ? [{ text: `arthur@ops:~$ ${echo}`, tone: "in" as Tone }] : []), ...out]);
  };

  const exec = (raw: string) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    setHist((h) => [...h, raw]);
    setHistIdx(-1);
    const arg = args.join(" ");

    switch (cmd) {
      case "clear":
        setLines([]);
        return;
      case "help":
        say(
          [
            { text: "  help                 this list", tone: "out" },
            { text: "  status               operation status board", tone: "out" },
            { text: "  scan                 sweep the target subnet", tone: "out" },
            { text: "  breach               run the breach protocol on K71-MAINFRAME", tone: "out" },
            { text: "  exfil                exfiltration summary", tone: "out" },
            { text: "  target               K-71 “WATSON” dossier", tone: "out" },
            { text: "  watchlist            contractor surveillance roster", tone: "out" },
            { text: "  decrypt <file>       attempt vault decryption", tone: "out" },
            { text: "  goto <module>        overview | target | exfil | surveillance", tone: "out" },
            { text: "  whoami / uname / date / ls / history / about / exit", tone: "out" },
          ],
          raw
        );
        return;
      case "about":
        say(
          [
            { text: "ARTHUR WEAPONS FACTORY — tactical ops console (simulation)", tone: "sys" },
            { text: `Designed & built by ${OPERATOR} as a portfolio-grade UI exercise.`, tone: "out" },
            { text: "No real systems are touched. No real data exists. It's all theatre.", tone: "out" },
          ],
          raw
        );
        return;
      case "status":
        say(
          [
            { text: `  K71-MAINFRAME ..... ${breach ? "OWNED (root shell cached)" : "HARDENED — breach pending"}`, tone: breach ? "ok" : "err" },
            { text: "  chaff tunnel ...... UP · 3 hops · 412 ms", tone: "out" },
            { text: "  exfiltration ...... STREAMING (see 'goto exfil')", tone: "out" },
            { text: "  watchlist ......... 4 subjects · 1 DARK", tone: "out" },
            { text: "  IDS ............... blind", tone: "ok" },
          ],
          raw
        );
        return;
      case "scan":
        say(
          [
            { text: "Starting SYN sweep on 10.71.0.0/24 …", tone: "sys" },
            { text: "  10.71.0.1    GATEWAY        up (0.002 s)", tone: "out" },
            { text: "  10.71.0.7    K71-MAINFRAME  up — 4431/tcp WATSON-MAINT", tone: "ok" },
            { text: "  10.71.0.9    IDS-NODE       up — will spoof as HVAC", tone: "out" },
            { text: "  10.71.0.21   BAY-CTRL       up — 9090/tcp DIAG", tone: "out" },
            { text: "4 hosts up · fingerprint cache updated · 0 packets lost", tone: "sys" },
          ],
          raw
        );
        return;
      case "breach":
        if (breach) {
          say([{ text: "K71-MAINFRAME already owned — root shell cached. try 'exfil'.", tone: "ok" }], raw);
          return;
        }
        onBreach();
        say(
          [
            { text: "[1/6] SYN sweep ............ 4 hosts up", tone: "out" },
            { text: "[2/6] 4431/tcp OPEN — WATSON-MAINT", tone: "out" },
            { text: "[3/6] fingerprint: WatsonRTOS 9.4 (build 7711)", tone: "out" },
            { text: "[4/6] CVE-2077-1337 “FALCONBLEED” — CRITICAL", tone: "err" },
            { text: "[5/6] payload staged → 0x7FFE1140", tone: "out" },
            { text: "[6/6] maint → root ......... OK", tone: "out" },
            { text: "ROOT SHELL ACQUIRED. open the Source Vault in 'goto target'.", tone: "ok" },
          ],
          raw
        );
        return;
      case "exfil":
        say(
          [
            { text: "pipeline: TARGET 10.71.0.7 ▸▸▸ ATTACKER 192.168.7.7 (vault)", tone: "sys" },
            { text: "queue: 8 objects /classified/** — 1.46 GB total", tone: "out" },
            { text: "integrity: sha-512 per shard · reassembly verified", tone: "ok" },
            { text: "full controls → 'goto exfil'", tone: "out" },
          ],
          raw
        );
        return;
      case "target":
        say(
          [
            { text: "K-71 “WATSON” — 6th-gen stealth demonstrator (FICTIONAL)", tone: "sys" },
            { text: "  RCS −42 dBsm · Mach 2.41 · 2× AWF-X9 GRYPHON · bays ×3", tone: "out" },
            { text: "  avionics: AN/APQ-88 LONGBOW AESA + IRST-71", tone: "out" },
            { text: "  dossier + blueprint → 'goto target'", tone: "out" },
          ],
          raw
        );
        return;
      case "watchlist":
      case "contractors":
        say(
          CONTRACTORS.map((c) => ({
            text: `  ${c.callsign.padEnd(9)} ${c.name.padEnd(16)} ${c.status.padEnd(8)} threat ${String(c.threat).padStart(2)} — ${c.org}`,
            tone: c.status === "DARK" ? "err" : c.status === "FLAGGED" ? "in" : "out",
          })),
          raw
        );
        return;
      case "decrypt": {
        if (!arg) {
          say([{ text: "usage: decrypt <file>   e.g. decrypt pilot_roster.enc", tone: "err" }], raw);
          return;
        }
        say(
          [
            { text: `pulling ${arg} from vault …`, tone: "sys" },
            { text: "  keyring shards 2/9 … 5/9 … 9/9 assembled", tone: "out" },
            { text: "  xchacha20-poly1305 verified · plaintext dump:", tone: "out" },
            { text: "  00000000  4b 37 31 20 57 41 54 53  4f 4e 20 2d 20 46 49 43", tone: "ok" },
            { text: "  00000010  54 49 4f 4e 41 4c 20 44  41 54 41 20 3a 29", tone: "ok" },
            { text: "  …it's all zeroes and good intentions, Commander.", tone: "sys" },
          ],
          raw
        );
        return;
      }
      case "goto": {
        const map = ["overview", "target", "exfil", "surveillance"] as const;
        const dest = map.find((m) => m === arg);
        if (!dest) {
          say([{ text: "usage: goto overview | target | exfil | surveillance", tone: "err" }], raw);
          return;
        }
        goto(dest);
        say([{ text: `routing console → ${dest} …`, tone: "sys" }], raw);
        return;
      }
      case "whoami":
        say([{ text: `${OPERATOR.toLowerCase().replace(" ", ".")} — COMMANDER · clearance TS//SCI`, tone: "ok" }], raw);
        return;
      case "uname":
        say([{ text: "ArthurOS arthur-ops 4.7.1-ironveil #7711 SMP PREEMPT x86_64 GNU/Linux", tone: "out" }], raw);
        return;
      case "date":
        say([{ text: new Date().toUTCString(), tone: "out" }], raw);
        return;
      case "ls":
        say(FAKE_LS.map((f) => ({ text: f, tone: "out" })), raw);
        return;
      case "history":
        say(hist.map((h, i) => ({ text: `  ${String(i + 1).padStart(3)}  ${h}`, tone: "out" })), raw);
        return;
      case "exit":
        say([{ text: "Nice try, Commander. The console does not let go.", tone: "err" }], raw);
        return;
      case "coffee":
        say([{ text: "brewing… ☕ denied — rations are synthetic up here.", tone: "sys" }], raw);
        return;
      case "":
        return;
      default:
        say([{ text: `arthur: command not found: ${cmd} — try 'help'`, tone: "err" }], raw);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = histIdx === -1 ? hist.length - 1 : Math.max(0, histIdx - 1);
      if (hist[next]) {
        setHistIdx(next);
        setInput(hist[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx + 1;
      if (next >= hist.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(hist[next]);
      }
    }
  };

  return (
    <div
      className="anim-rise panel corners flex h-[calc(100vh-190px)] min-h-[420px] flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="flex items-center gap-2.5 border-b border-line px-4 py-2.5">
        <span className="led led-ok" />
        <h3 className="font-disp text-[11px] font-semibold uppercase tracking-[0.28em] text-dim">
          Arthur-Term // Secure Shell
        </h3>
        <span className="text-[9px] tracking-[0.2em] text-fnt">TTY-0 · XCHACHA20</span>
        <span className="ml-auto text-[9px] tracking-[0.2em] text-fnt">↑/↓ history · try 'help'</span>
      </header>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4 text-[12px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={cn("whitespace-pre-wrap", TONE_CLS[l.tone])}>
            {l.text}
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <span className="flex-none text-ok">arthur@ops:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="w-full bg-transparent text-ink caret-transparent outline-none"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal input"
          />
          <span className="blinkc -ml-2 inline-block h-4 w-2 flex-none bg-ok" style={{ marginLeft: "-0.5ch" }} />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
