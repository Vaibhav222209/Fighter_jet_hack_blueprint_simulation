import { useEffect, useRef, useState } from "react";

export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function useInterval(cb: () => void, ms: number | null): void {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (ms === null) return;
    const t = setInterval(() => ref.current(), ms);
    return () => clearInterval(t);
  }, [ms]);
}

export function useCountUp(target: number, speed = 0.08): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setVal((v) => {
        const next = v + (target - v) * speed;
        if (Math.abs(target - next) < 0.01) return target;
        raf = requestAnimationFrame(tick);
        return next;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return val;
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function utc(d: Date): string {
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`;
}

export function stamp(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${utc(d)}Z`;
}
