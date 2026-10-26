"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Level } from "@/data/c4-diagram";
import styles from "./home.module.css";

interface C4State {
  level: Level;
  setLevel: (level: Level) => void;
  /** The work item the index points at, lit in the level-3 diagram. */
  lit: string;
  setLit: (key: string) => void;
}

const C4Context = createContext<C4State | null>(null);

export function useC4(): C4State {
  const state = useContext(C4Context);
  if (!state) throw new Error("useC4 must be used inside <C4Split>");
  return state;
}

/**
 * The two-column layout: the diagram on one side, the reading column on the
 * other. On desktop, the `[data-level]` section crossing the middle of the
 * viewport sets the zoom; on a phone the diagram is not sticky, so only its
 * buttons do.
 */
export function C4Split({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<Level>(1);
  const [lit, setLit] = useState("harness");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia?.("(min-width: 901px)").matches) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setLevel(Number((e.target as HTMLElement).dataset.level) as Level);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ref.current?.querySelectorAll("[data-level]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <C4Context.Provider value={{ level, setLevel, lit, setLit }}>
      <div ref={ref} className={styles.split}>
        {children}
      </div>
    </C4Context.Provider>
  );
}
