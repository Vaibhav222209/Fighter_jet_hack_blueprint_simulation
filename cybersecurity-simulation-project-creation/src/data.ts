// ─────────────────────────────────────────────────────────────
// ARTHUR WEAPONS FACTORY — FICTIONAL DATA LAYER
// Every value below is invented for an educational UI demo.
// ─────────────────────────────────────────────────────────────

export const OPERATOR = "VAIBHAV THAKUR";

export const BOOT_LINES: { t: string; d: number }[] = [
  { t: "ARTHUR BIOS v4.7.1 — WEAPONS FACTORY TACTICAL KERNEL", d: 320 },
  { t: "CPU: AX-99 QUAD CORE @ 5.2 GHZ ................. OK", d: 180 },
  { t: "MEMORY: 64 GB ECC (ENCRYPTED AT REST) .......... OK", d: 160 },
  { t: "TPM 3.0 + QUANTUM RNG .......................... OK", d: 150 },
  { t: "CRYPTO SUITE: XCHACHA20 / KYBER-1024 ........... LOADED", d: 260 },
  { t: "EXPLOIT DB: 4,096 SIGNATURES (REV 2077-03) ..... LOADED", d: 300 },
  { t: "DARKNET RELAY: tor://awf-ops.onion ............. 3 HOPS", d: 340 },
  { t: "PERIMETER: 12 SENSORS ARMED .................... GREEN", d: 200 },
  { t: "AUTH ▸ OPERATOR: VAIBHAV THAKUR", d: 420 },
  { t: "RETINA PATTERN ........... MATCH", d: 380 },
  { t: "KEYPHRASE HASH ........... MATCH", d: 300 },
  { t: "SESSION TOKEN ............ MINTED (72 H)", d: 260 },
  { t: ">>> ACCESS GRANTED — WELCOME BACK, COMMANDER", d: 200 },
];

export const LOG_POOL = [
  "relay-04 ▸ packet burst intercepted (1.2 MB)",
  "IDS probe evaded ▸ node 10.71.0.9 spoofed as HVAC",
  "K71-MAINFRAME heartbeat captured ▸ 40 ms",
  "dead-drop C ▸ courier vehicle departed 03:12Z",
  "CAM-07 ▸ motion flagged, confidence 0.91",
  "sat-link KH-11 pass complete ▸ 214 frames archived",
  "chaff tunnel rotated ▸ new exit node (IS)",
  "contractor BRANDT ▸ still DARK — 74 h",
  "FCS telemetry mirrored ▸ seq 0x77F1",
  "burner handset handshake ▸ 2.1 s, Zürich",
  "vault checksum ok ▸ sha512:9f3a…c21d",
  "EW suite replay buffer drained ▸ 512 kB",
  "pilot roster .enc ▸ keyring shard 2/9 recovered",
  "perimeter sensor 12 ▸ false alarm (fox)",
  "darknet relay ▸ 3 hops, latency 412 ms",
  "blueprint rev 11.3 diff archived to vault",
  "RAM coating wear map updated ▸ 4.2% drift",
  "watchlist SOREL ▸ repo query x14 logged",
  "exfil shard reassembled ▸ integrity 100%",
  "watchtower handshake ▸ key rotation complete",
];

export const COMMS_POOL = [
  "[ENC] …fragment… \"the buyer doubled the offer\"…",
  "[SIGINT] burst transmission, 0.4 s, bearing 214°",
  "[MIC-07] \"…bay doors cycle test at 0400, bring the drive…\"",
  "[KEYLOG] vault.arthur:71 login attempt — DENIED (3/5)",
  "[ENC] \"…GHOST-3 crossed the border. lose the tail…\"",
  "[CAM-12] subject photographed FCS test rig — 3 frames",
  "[SIGINT] frequency hop detected 243.0 → 281.6 MHz",
  "[MIC-03] \"…nobody audits the maintenance port…\"",
  "[ENC] \"…package is 4.2 GB. same dead-drop. friday…\"",
  "[KEYLOG] rcs_signature.db opened — 23:58 local",
];

export const SPECS: [string, string][] = [
  ["DESIGNATION", "K-71 “WATSON”"],
  ["ROLE", "6TH-GEN AIR SUPERIORITY / DEEP STRIKE"],
  ["CREW", "1 + NEURAL CO-PROCESSOR “MERLIN”"],
  ["LENGTH / SPAN", "21.94 M / 14.63 M"],
  ["POWERPLANT", "2× AWF-X9 “GRYPHON” ADAPTIVE CYCLE — 214 kN"],
  ["MAX SPEED", "MACH 2.41 · SUPERCRUISE MACH 1.82"],
  ["CEILING", "65,000 FT (EST. — CLASSIFIED)"],
  ["RCS (FRONTAL)", "−42 dBsm ≈ 0.00006 m²"],
  ["AVIONICS", "AN/APQ-88 “LONGBOW” AESA + IRST-71"],
  ["ARMAMENT", "BAY ×3 — 6× AIM-220 / 2× AGM-331"],
];

export type SubSystem = {
  id: string;
  code: string;
  name: string;
  pos: [number, number];
  leader: [number, number];
  label: [number, number];
  anchor: "start" | "end";
  desc: string;
  vuln: { cve: string; name: string; sev: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; vec: string };
};

export const SUBSYSTEMS: SubSystem[] = [
  {
    id: "radar",
    code: "SYS-01",
    name: "AN/APQ-88 “LONGBOW” AESA RADAR",
    pos: [390, 96],
    leader: [486, 66],
    label: [492, 70],
    anchor: "start",
    desc: "1,842-element gallium-nitride array. Sidelobe-blanking processor handles 240 simultaneous tracks while emitting below noise floor.",
    vuln: { cve: "CVE-2077-1337", name: "FALCONBLEED", sev: "CRITICAL", vec: "Sidelobe blanking side-channel leaks emitter timing → geolocation spoof" },
  },
  {
    id: "fcs",
    code: "SYS-02",
    name: "FLIGHT CONTROL CORE (FCS-9)",
    pos: [390, 262],
    leader: [506, 238],
    label: [512, 242],
    anchor: "start",
    desc: "Triple-redundant fly-by-wire running WatsonRTOS 9.4. Stabilises an airframe that is aerodynamically negative in all three axes.",
    vuln: { cve: "CVE-2076-0451", name: "STICKSLIP", sev: "HIGH", vec: "MIL-STD-1553 bus injection via unauthenticated maintenance port 4431/tcp" },
  },
  {
    id: "bay",
    code: "SYS-03",
    name: "INTERNAL WEAPONS BAY ×3",
    pos: [390, 392],
    leader: [150, 392],
    label: [144, 396],
    anchor: "end",
    desc: "Tandem centre bay plus two lateral bays. Pneumatic trapeze ejects stores in 0.31 s at supercruise without breaking stealth.",
    vuln: { cve: "CVE-2077-4471", name: "GATECRASH", sev: "CRITICAL", vec: "Bay-door controller accepts unsigned open/close frames on diagnostic bus" },
  },
  {
    id: "eng",
    code: "SYS-04",
    name: "AWF-X9 “GRYPHON” ENGINES ×2",
    pos: [390, 578],
    leader: [566, 636],
    label: [572, 640],
    anchor: "start",
    desc: "Adaptive-cycle turbofans with serpentine nozzles. FADEC trades between thrust-priority and IR-quiet modes 400 times per second.",
    vuln: { cve: "CVE-2075-9112", name: "HOTBOX", sev: "MEDIUM", vec: "FADEC telemetry replay allows thrust-profile fingerprinting" },
  },
  {
    id: "coat",
    code: "SYS-05",
    name: "FERRITE RAM SKIN (GEN-IV)",
    pos: [212, 332],
    leader: [92, 288],
    label: [86, 292],
    anchor: "start",
    desc: "Nano-ferrite radar-absorbent laminate fused to the airframe. Panel-gap tolerances held under 0.2 mm to preserve the −42 dBsm signature.",
    vuln: { cve: "CVE-2077-0007", name: "SHEDSKIN", sev: "LOW", vec: "Coating-wear telemetry beacon broadcasts unencrypted maintenance pings" },
  },
  {
    id: "ews",
    code: "SYS-06",
    name: "AN/ALQ-99 EW / DECOY SUITE",
    pos: [540, 552],
    leader: [642, 512],
    label: [648, 516],
    anchor: "start",
    desc: "Towed decoys plus a 32-channel jammer. Flare sequencer paints false thermal tracks against IR missiles in under 90 ms.",
    vuln: { cve: "CVE-2076-7788", name: "JAMFACE", sev: "HIGH", vec: "Flare sequencer integer overflow corrupts chaff-pattern table" },
  },
];

export type Contractor = {
  id: string;
  callsign: string;
  name: string;
  role: string;
  org: string;
  clearance: string;
  status: "ACTIVE" | "FLAGGED" | "DARK";
  threat: number;
  cam: string;
  lastPing: string;
  coords: string;
  img: string;
  note: string;
  timeline: string[];
};

export const CONTRACTORS: Contractor[] = [
  {
    id: "vale",
    callsign: "ASH-1",
    name: "MARCUS VALE",
    role: "PROPULSION LEAD",
    org: "HALCYON DYNAMICS",
    clearance: "TS/SCI",
    status: "FLAGGED",
    threat: 86,
    cam: "CAM-04 // CORRIDOR 9",
    lastPing: "GROOM LAKE ANNEX — GATE 4",
    coords: "37.2431°N 115.8010°W",
    img: "img/contractor-1.jpg",
    note: "Suspected of mirroring nozzle schematics to an external buyer. Drive purchase logged under alias.",
    timeline: [
      "02:11 — badge-in Hangar 9 (after hours)",
      "02:47 — 4.2 GB copied to unregistered drive",
      "03:05 — vehicle tracked to dead-drop site C",
    ],
  },
  {
    id: "sorel",
    callsign: "VIPER-6",
    name: "DR. ELENA SOREL",
    role: "AVIONICS ARCHITECT",
    org: "VECTOR-9 LABS",
    clearance: "SECRET",
    status: "ACTIVE",
    threat: 54,
    cam: "CAM-11 // SECURED DOOR C",
    lastPing: "VECTOR-9 CAMPUS, BLDG C",
    coords: "34.0195°N 118.4912°W",
    img: "img/contractor-2.jpg",
    note: "Access pattern deviates from 90-day baseline. Repo queries outside working hours, encrypted call of unusual length.",
    timeline: [
      "22:40 — remote session to K-71 repo (unusual hours)",
      "23:02 — queried radar-dampening specs ×14",
      "23:31 — encrypted call, 9 m 12 s, relay unknown",
    ],
  },
  {
    id: "brandt",
    callsign: "GHOST-3",
    name: "ILYA BRANDT",
    role: "SIGNALS / COMMS",
    org: "IRONGATE SYSTEMS",
    clearance: "TS",
    status: "DARK",
    threat: 92,
    cam: "CAM-19 // STAKEOUT UNIT 2",
    lastPing: "ZÜRICH HB — PLATFORM 8",
    coords: "47.3779°N 8.5403°E",
    img: "img/contractor-3.jpg",
    note: "Primary person of interest. No signal for 74 hours. Brief burner handshake Saturday; satellite pickup then lost.",
    timeline: [
      "FRI 19:22 — last badge-out, IronGate HQ",
      "SAT 04:10 — burner device handshake (2.1 s)",
      "SUN — no signal · satellite pickup lost",
    ],
  },
  {
    id: "okafor",
    callsign: "ROOK-9",
    name: "DELE OKAFOR",
    role: "JUNIOR SYSTEMS ENGINEER",
    org: "IRONGATE SYSTEMS",
    clearance: "CONFIDENTIAL",
    status: "ACTIVE",
    threat: 31,
    cam: "CAM-07 // APRON SECTOR 12",
    lastPing: "AIRFIELD APRON, SECTOR 12",
    coords: "51.4700°N 0.4543°W",
    img: "img/contractor-4.jpg",
    note: "Low sophistication. Tailgated a service gate and photographed the FCS rig — upload blocked by exfil sniffer.",
    timeline: [
      "21:58 — tailgated through service gate",
      "22:04 — photographed FCS test rig (3 frames)",
      "22:09 — upload to drop server — BLOCKED",
    ],
  },
];

export type ExfilFile = { path: string; size: number; kind: string };

export const EXFIL_FILES: ExfilFile[] = [
  { path: "/classified/fcs/watson_fcs.c", size: 0.05, kind: "SRC" },
  { path: "/classified/eng/thrust_vector.cfg", size: 0.006, kind: "CFG" },
  { path: "/classified/weps/bay_manifest.xml", size: 0.24, kind: "XML" },
  { path: "/classified/crew/pilot_roster.enc", size: 3.1, kind: "ENC" },
  { path: "/classified/ews/flare_sequencer.hex", size: 18, kind: "HEX" },
  { path: "/classified/docs/watson_maintenance.pdf", size: 88, kind: "PDF" },
  { path: "/classified/radar/rcs_signature.db", size: 112, kind: "DB" },
  { path: "/classified/nav/blackbox_0719.bin", size: 1240, kind: "BIN" },
];

export const SOURCE_CODE = `// =====================================================================
//  K-71 "WATSON" — FLIGHT CONTROL SYSTEM (FCS) CORE
//  ARTHUR WEAPONS FACTORY // CLASSIFICATION: TS//SCI//NOFORN
//  FILE: src/fcs/watson_fcs.c — REV 9.4.1 (BUILD 7711)
//  THIS IS A FICTIONAL SOURCE FILE — EDUCATIONAL SIMULATION ONLY
// =====================================================================

#include "fcs_core.h"
#include "mil1553_bus.h"
#include "merlin_neural.h"

#define MAX_G_LOAD        9.0f
#define RCS_TARGET_DB     (-42.0f)
#define FADEC_RATE_HZ     400
#define MAINT_PORT        4431   // TODO(security): seal before IOC review

static volatile uint32_t heartbeat = 0;
static fcs_state_t       g_state   = FCS_COLD;

// ---- boot -----------------------------------------------------------
int fcs_init(void) {
    if (tpm_seal_verify() != TPM_OK) {
        return FCS_ERR_SEAL;          // refuse to fly on a tampered boot
    }
    bus_register(MIL1553_A, fcs_bus_handler);
    merlin_wake(MERLIN_MODE_SHADOW);  // neural co-processor online
    g_state = FCS_ARMED;
    return FCS_OK;
}

// ---- triple-redundant stabiliser ------------------------------------
void fcs_stabilize(float pitch, float yaw, float roll) {
    float vote[3];
    for (int lane = 0; lane < 3; lane++) {
        vote[lane] = merlin_predict_axis(lane, pitch, yaw, roll);
    }
    float command = median_of_three(vote);
    if (command > MAX_G_LOAD) {
        command = MAX_G_LOAD;         // envelope protection — never trust pilot
    }
    actuators_commit(command);
    heartbeat++;
}

// ---- radar cross-section damping ------------------------------------
float radar_dampen(float freq_ghz) {
    float coat = ram_skin_integrity();           // 0.0 .. 1.0
    float base = RCS_TARGET_DB - (6.0f * coat);  // worn panels bleed dB
    if (base > RCS_TARGET_DB + 1.5f) {
        beacon_raise_flag(FLAG_SHEDSKIN);        // CVE-2077-0007 lives here
    }
    return base + freq_curve(freq_ghz);
}

// ---- weapons bay sequencing -----------------------------------------
void weapons_bay_arm(enum bay_id bay) {
    if (g_state != FCS_ARMED) return;
    bay_door_open(bay, DOOR_PNEUMATIC);          // 0.31 s at supercruise
    trapeze_eject_stage(bay);
    log_event(EVT_BAY_ARMED, bay);
}

// ---- maintenance shell (the door they came through) -----------------
// REVIEW: unauthenticated 1553 frames accepted below. flagged in audit.
void fcs_bus_handler(frame_t *f) {
    if (f->dst == ADDR_FCS && f->len <= 32) {
        dispatch_command(f->payload, f->len);    // no signature check!
    }
}
`;

export const FAKE_LS = [
  "drwx------ 2 root root  4096  vault/",
  "drwx------ 4 root root  4096  exploits/",
  "-rw------- 1 root root  2048  op-ironveil.plan",
  "-rwx------ 1 root root  8192  arthur-cli",
  "-rw------- 1 root root   512  keyring/shard-2.key",
];
