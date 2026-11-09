<div align="center">

```
 █████╗ ██████╗ ████████╗██╗  ██╗██╗   ██╗██████╗
██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║   ██║██╔══██╗
███████║██████╔╝   ██║   ███████║██║   ██║██████╔╝
██╔══██║██╔══██╗   ██║   ██╔══██║██║   ██║██╔══██╗
██║  ██║██║  ██║   ██║   ██║  ██║╚██████╔╝██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
        W E A P O N S   F A C T O R Y
```

**A fictional offensive-security operations console — built as a portfolio-grade UI simulation.**

[![STATUS](https://img.shields.io/badge/STATUS-SIMULATION-f2b33d?style=for-the-badge)](#)
[![REACT](https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react)](#)
[![TYPESCRIPT](https://img.shields.io/badge/TYPESCRIPT-5.9-3178C6?style=for-the-badge&logo=typescript)](#)
[![VITE](https://img.shields.io/badge/VITE-7-646CFF?style=for-the-badge&logo=vite)](#)
[![LICENSE](https://img.shields.io/badge/LICENSE-MIT-5FDD8A?style=for-the-badge)](#license)
[![OPERATOR](https://img.shields.io/badge/OPERATOR-VAIBHAV_THAKUR-ff5d5d?style=for-the-badge)](#operator)

</div>

---

## ▸ BRIEFING

**Arthur Weapons Factory** is a cinematic, browser-based *tactical ops console*. You play the operator
of a fictional red-team cell tasked with compromising the **K-71 “Watson”** — a dummy 6th-generation
stealth fighter — reading its classified blueprint, unsealing its (entirely invented) source code, and
streaming dummy data from the **target machine** back to the **attacker machine** over a simulated
“chaff tunnel”, all while keeping an eye on four sample defense contractors.

> Every IP address, file, CVE, contractor, coordinate and source-code line in this project is
> **fictional**. The app sends **zero** real network traffic. It is interface theatre — no exploits,
> no payloads, no targets.

---

## ⚠ READ FIRST

```
┌──────────────────────────────────────────────────────────────────────┐
│  THIS IS AN EDUCATIONAL UI / CYBERSECURITY-THEMED FRONTEND PROJECT.  │
│  • No real hacking techniques, tools or payloads are included.       │
│  • No network requests are made to any machine, ever.                │
│  • All “classified” data, source code and personnel are invented.    │
│  • Surveillance personas are fictional, rendered with AI imagery.    │
│  Built to demonstrate React, TypeScript, SVG and motion design.      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## ✦ FEATURES

| Module | What it does |
|---|---|
| 🛰 **Ops Overview** | Live event bus, radar sweep, threatcon board, mission phases, intercepted-packet counters, interdiction route map |
| 🎯 **Target K-71 “Watson”** | Interactive SVG blueprint with 6 interrogable subsystem hotspots, breach protocol terminal (port scan → CVE → root shell), “classified” source vault with a C syntax-highlighter |
| 📡 **Exfiltration Pipeline** | Animated TARGET → ATTACKER data conduit, 8-file transfer queue with live progress, throughput sparkline, Boost / Pause / Abort controls, session SCP log |
| 👁 **Contractor Watchlist** | 4 fictional sample dossiers, CCTV-style live feeds with scanlines + REC overlay, threat indexes, intercepted-comms stream with audio waveform |
| ⌨ **Arthur-Term** | Fully interactive fake shell — `help`, `scan`, `breach`, `exfil`, `watchlist`, `decrypt <file>`, `goto <module>`, history with ↑/↓, easter eggs |
| 🔐 **Boot Sequence** | BIOS-style login with retina-scan drama (skippable), operator: **Vaibhav Thakur** |

Plus: scanline / noise / vignette ambient layers, hazard-tape chrome, corner-bracketed panels,
marquee event ticker, UTC clock, animated system vitals — **no UI frameworks, hand-rolled SVG & CSS.**

---

## 🚀 DEPLOY — RUN IT ON YOUR MACHINE

### Prerequisites
- **Node.js 18+** (20+ recommended)
- **npm** (ships with Node)
- **git**

### Steps

```bash
# 1 ▸ Clone the repository
git clone https://github.com/<your-username>/arthur-weapons-factory.git

# 2 ▸ Step inside
cd arthur-weapons-factory

# 3 ▸ Install dependencies
npm install

# 4 ▸ Start the dev console (hot reload)
npm run dev
#     ➜ open the printed URL — usually http://localhost:5173

# 5 ▸ Production build (optional — emits a static site in /dist)
npm run build

# 6 ▸ Preview the production build locally
npm run preview
```

### Hosting it for free
- **GitHub Pages / Netlify / Vercel:** run `npm run build` and publish the `dist/` folder.
- **Vercel shortcut:** import the repo → framework preset *Vite* → deploy. Done.

---

## 🗂 PROJECT STRUCTURE

```
arthur-weapons-factory/
├── public/img/                  # recon stills & synthetic CCTV frames
├── src/
│   ├── components/
│   │   ├── Boot.tsx             # BIOS login sequence
│   │   ├── JetBlueprint.tsx     # interactive K-71 SVG blueprint
│   │   ├── ModuleOverview.tsx   # ops overview grid
│   │   ├── ModuleTarget.tsx     # dossier, breach protocol, source vault
│   │   ├── ModuleExfil.tsx      # exfiltration pipeline
│   │   ├── ModuleSurveillance.tsx
│   │   ├── ModuleTerminal.tsx   # fake interactive shell
│   │   └── ui.tsx               # panels, tags, meters, LEDs
│   ├── data.ts                  # ALL fictional data lives here
│   ├── hooks.ts                 # clock / interval / count-up hooks
│   ├── App.tsx                  # shell: top bar, sidebar, router, ticker
│   └── index.css                # tactical design system (Chakra Petch + IBM Plex Mono)
├── README.md
└── LICENSE
```

---

## ⌨ TERMINAL CHEAT SHEET

Once inside the console, open the **Terminal** module and try:

```
help          – list everything
scan          – sweep 10.71.0.0/24
breach        – run the breach protocol on K71-MAINFRAME
target        – K-71 “Watson” dossier
exfil         – exfiltration summary
watchlist     – the four contractors
decrypt pilot_roster.enc
goto target   – jump between modules from the shell
whoami        – obviously, you are the Commander
exit          – nice try
```

---

## 🧰 TECH STACK

- **React 19** + **TypeScript** — typed components, zero `any` theatre
- **Vite 7** — instant dev loop, static production build
- **Tailwind CSS 4** — utility layer over a hand-built design system
- **Hand-rolled SVG** — blueprint, radar, conduit diagrams, packet animations (`animateMotion`)
- **Google Fonts** — *Chakra Petch* (display) × *IBM Plex Mono* (terminal body)

---

## 📜 LICENSE

Released under the [MIT License](LICENSE) — remix it, restyle it, learn from it.

## 👤 OPERATOR

<div align="center">

**Designed, built & compromised by Vaibhav Thakur**

*“Built in the shadows. Shipped in the open.”*

— ⚒ ARTHUR WEAPONS FACTORY · K-71 PROGRAM · FICTIONAL DATA ONLY —

</div>
