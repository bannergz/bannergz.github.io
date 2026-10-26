"use client";

import { WORK } from "@/data/c4-diagram";
import { useC4 } from "./C4Split";
import styles from "./home.module.css";

/** Pointing at a name zooms the diagram to level 3 and lights its component. */
export function WorkIndex() {
  const { lit, setLevel, setLit } = useC4();
  const point = (key: string) => {
    setLevel(3);
    setLit(key);
  };

  return (
    <ul className={styles.index}>
      {WORK.map((w) => (
        <li key={w.key}>
          <a
            href="#work"
            className={w.key === lit ? styles.lit : undefined}
            aria-current={w.key === lit ? "true" : undefined}
            onMouseEnter={() => point(w.key)}
            onFocus={() => point(w.key)}
            onClick={(e) => {
              e.preventDefault();
              point(w.key);
            }}
          >
            <b>{w.title}</b>
            <span>{w.meta}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
