import { SUBSYSTEMS } from "../data";
import { cn } from "../utils/cn";

// Airframe outline (top elevation) — mirrored about x = 390
const HULL =
  "M390,28 L412,120 L428,210 L436,238 L712,438 L694,462 L462,478 L472,502 " +
  "L592,574 L584,596 L446,560 L430,616 L404,606 L390,612 L376,606 L350,616 " +
  "L334,560 L196,596 L188,574 L308,502 L318,478 L86,462 L68,438 L344,238 " +
  "L352,210 L368,120 Z";

export default function JetBlueprint({
  selected,
  owned,
  onSelect,
}: {
  selected: string | null;
  owned: Set<string>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative">
      <svg viewBox="0 0 780 680" className="h-auto w-full select-none" role="img" aria-label="K-71 Watson blueprint">
        <defs>
          <pattern id="bpgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(73,215,232,0.08)" strokeWidth="1" />
          </pattern>
          <pattern id="bpgrid2" width="150" height="150" patternUnits="userSpaceOnUse">
            <path d="M150 0H0V150" fill="none" stroke="rgba(73,215,232,0.14)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="780" height="680" fill="url(#bpgrid)" />
        <rect width="780" height="680" fill="url(#bpgrid2)" />

        {/* centerline */}
        <line x1="390" y1="8" x2="390" y2="668" stroke="rgba(220,228,236,0.16)" strokeDasharray="14 6 2 6" />

        {/* airframe */}
        <path d={HULL} fill="rgba(73,215,232,0.05)" stroke="#49D7E8" strokeWidth="1.6" />
        {/* canopy */}
        <path
          d="M390,142 C404,168 404,196 390,216 C376,196 376,168 390,142 Z"
          fill="rgba(73,215,232,0.14)"
          stroke="#49D7E8"
          strokeWidth="1.2"
        />
        {/* intakes */}
        <path d="M352,248 L368,262 M428,248 L412,262" stroke="#49D7E8" strokeWidth="1.2" opacity="0.8" />
        {/* engine nacelles */}
        <path d="M368,470 L360,600 M412,470 L420,600" stroke="rgba(73,215,232,0.5)" strokeWidth="1.1" />
        <path d="M364,530 L416,530 M362,560 L418,560" stroke="rgba(73,215,232,0.35)" strokeWidth="1" />
        {/* weapons bay */}
        <rect x="372" y="300" width="36" height="168" fill="rgba(242,179,61,0.05)" stroke="rgba(242,179,61,0.6)" strokeDasharray="5 4" strokeWidth="1" />
        {/* canted vertical tails (top projection) */}
        <path d="M446,540 L470,586 L458,592 L438,552 Z" fill="rgba(73,215,232,0.1)" stroke="#49D7E8" strokeWidth="1.1" />
        <path d="M334,540 L310,586 L322,592 L342,552 Z" fill="rgba(73,215,232,0.1)" stroke="#49D7E8" strokeWidth="1.1" />
        {/* panel lines */}
        <path d="M344,238 L436,238 M318,478 L462,478 M308,502 L472,502" stroke="rgba(220,228,236,0.14)" strokeWidth="1" />

        {/* dimensions */}
        <g stroke="rgba(140,160,179,0.55)" strokeWidth="1">
          <line x1="68" y1="452" x2="712" y2="452" strokeDasharray="3 4" />
          <line x1="68" y1="446" x2="68" y2="458" />
          <line x1="712" y1="446" x2="712" y2="458" />
          <line x1="56" y1="28" x2="56" y2="616" strokeDasharray="3 4" />
          <line x1="50" y1="28" x2="62" y2="28" />
          <line x1="50" y1="616" x2="62" y2="616" />
        </g>
        <text x="390" y="446" textAnchor="middle" className="fill-dim" fontSize="11" fontFamily="IBM Plex Mono">
          WINGSPAN 14.63 M
        </text>
        <text x="46" y="330" textAnchor="middle" transform="rotate(-90 46 330)" className="fill-dim" fontSize="11" fontFamily="IBM Plex Mono">
          LENGTH 21.94 M
        </text>

        {/* title block */}
        <g fontFamily="IBM Plex Mono">
          <rect x="566" y="608" width="200" height="58" fill="rgba(15,21,29,0.85)" stroke="rgba(52,72,95,0.9)" />
          <text x="576" y="626" fill="#8CA0B3" fontSize="9.5" letterSpacing="2">ARTHUR WEAPONS FACTORY</text>
          <text x="576" y="642" fill="#DCE4EC" fontSize="11" fontWeight="600" letterSpacing="1">K-71 “WATSON” — DWG 7711-C</text>
          <text x="576" y="658" fill="#F2B33D" fontSize="9.5" letterSpacing="2">REV 11.3 · TOP ELEVATION · TS//SCI</text>
        </g>

        {/* subsystem nodes */}
        {SUBSYSTEMS.map((s) => {
          const active = selected === s.id;
          const done = owned.has(s.id);
          const [x, y] = s.pos;
          const [lx, ly] = s.leader;
          const [tx, ty] = s.label;
          return (
            <g key={s.id} onClick={() => onSelect(s.id)} className="cursor-pointer">
              <line x1={x} y1={y} x2={lx} y2={ly} stroke={active ? "rgba(242,179,61,0.8)" : "rgba(90,111,133,0.5)"} strokeWidth="1" />
              <text
                x={tx}
                y={ty}
                textAnchor={s.anchor}
                fontSize="10"
                fontFamily="IBM Plex Mono"
                letterSpacing="1.5"
                fill={active ? "#F2B33D" : done ? "#5FDD8A" : "#8CA0B3"}
              >
                {s.code} {done ? "✓" : "▸"}
              </text>
              <circle cx={x} cy={y} r="15" fill="transparent" />
              <circle cx={x} cy={y} r="10" fill="none" stroke={active ? "#F2B33D" : done ? "#5FDD8A" : "#49D7E8"} strokeWidth="1" className={cn(!active && "hsring")} opacity="0.8" />
              <circle cx={x} cy={y} r="4" fill={active ? "#F2B33D" : done ? "#5FDD8A" : "#49D7E8"} />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-fnt">
        <span>▸ click a node to interrogate subsystem</span>
        <span>
          <span className="text-cy">●</span> scanned · <span className="text-ok">●</span> exploited ·{" "}
          <span className="text-haz">●</span> selected
        </span>
      </div>
    </div>
  );
}
