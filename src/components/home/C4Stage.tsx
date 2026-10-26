"use client";

import {
  COMPONENTS,
  CONTAINERS,
  CONTEXT,
  CONTEXT_RELATIONS,
  LEVELS,
  type C4Box,
  type Level,
} from "@/data/c4-diagram";
import { useC4 } from "./C4Split";
import styles from "./home.module.css";

const FILL: Record<C4Box["kind"], string> = {
  person: "var(--color-c4-person)",
  system: "var(--color-c4-system)",
  container: "var(--color-c4-container)",
  component: "var(--color-c4-component)",
  ext: "var(--color-c4-ext)",
};

/** Text sits at fixed offsets from the box top; descriptions start lower in taller boxes. */
function Box({ box, big = false }: { box: C4Box; big?: boolean }) {
  const descTop = big ? 90 : box.h > 150 ? 92 : box.h > 100 ? 82 : 78;
  return (
    <>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill={FILL[box.kind]} />
      <text x={box.x + 20} y={box.y + 34} className={styles.t} style={big ? { fontSize: 21 } : undefined}>
        {box.title}
      </text>
      <text x={box.x + 20} y={box.y + 56} className={styles.k}>
        {box.tag}
      </text>
      {box.lines.map((line, i) => (
        <text key={line} x={box.x + 20} y={box.y + descTop + i * 20} className={styles.d}>
          {line}
        </text>
      ))}
    </>
  );
}

function Arrow({ d }: { d: string }) {
  return <path d={d} className={styles.arrow} markerEnd="url(#c4-tip)" />;
}

export function C4Stage() {
  const { level, setLevel, lit } = useC4();

  const layer = (l: Level) => ({
    className: `${styles.lv} ${l === level ? styles.on : ""} ${l < level ? styles.past : ""}`,
    "aria-hidden": l !== level,
  });

  return (
    <aside className={styles.stage} aria-label="Career as a C4 diagram">
      <div className={styles.readout}>
        <span aria-live="polite">
          <b>Level {level}</b> · {LEVELS[level].name}
        </span>
        <div className={styles.levels} role="group" aria-label="Zoom level">
          {([1, 2, 3, 4] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={l === level}
              aria-label={`Level ${l}, ${LEVELS[l].name}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.diagram}>
        <svg viewBox="0 0 600 700" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="c4-title">
          <title id="c4-title">A C4 diagram of Banner Gonzales&apos;s work, zooming from system context to code.</title>
          <defs>
            <marker id="c4-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" fill="#7fa4cc" />
            </marker>
          </defs>

          <g {...layer(1)}>
            {CONTEXT.map((box) => (
              <g key={box.title}>
                <Box box={box} big={box.kind === "system"} />
              </g>
            ))}
            {CONTEXT_RELATIONS.map((r) => (
              <g key={r.label}>
                <Arrow d={r.d} />
                <text x={r.x} y={r.y} className={styles.rel}>
                  {r.label}
                </text>
              </g>
            ))}
          </g>

          <g {...layer(2)}>
            <rect className={styles.bound} x={20} y={20} width={560} height={660} rx={10} />
            <text x={40} y={50} className={styles.k}>
              [Career boundary] 2019 to now
            </text>
            {CONTAINERS.map((box) => (
              <g key={box.title}>
                <Box box={box} />
              </g>
            ))}
            {CONTAINERS.slice(1).map((box) => (
              <Arrow key={box.title} d={`M300 ${box.y - 2} V${box.y - 26}`} />
            ))}
          </g>

          <g {...layer(3)}>
            <rect className={styles.bound} x={20} y={20} width={560} height={660} rx={10} />
            <text x={40} y={50} className={styles.k}>
              [Built at YaVendio and Yape]
            </text>
            {COMPONENTS.map((box) => (
              <g key={box.key} className={`${styles.comp} ${styles.dark} ${box.key === lit ? styles.hi : ""}`}>
                <Box box={box} />
              </g>
            ))}
          </g>

          <g {...layer(4)}>
            <foreignObject x={20} y={80} width={560} height={560}>
              <div className={styles.codeBox}>
                <pre>
                  <code>
                    <span className={styles.cm}>{"// The domain owns the contract."}</span>
                    {"\n"}
                    <span className={styles.kw}>pub trait</span>
                    {" PaymentGateway {\n    "}
                    <span className={styles.kw}>async fn</span>
                    {" charge(&self, order: &Order)\n        -> Result<Receipt, PaymentError>;\n}\n\n"}
                    <span className={styles.cm}>{"// Infrastructure plugs in from outside."}</span>
                    {"\n"}
                    <span className={styles.kw}>impl</span>
                    {" PaymentGateway "}
                    <span className={styles.kw}>for</span>
                    {" BankAdapter {\n    "}
                    <span className={styles.cm}>{"// retries, idempotency keys, tracing"}</span>
                    {"\n}"}
                  </code>
                </pre>
                <p>
                  Level 4 is code. Ports and adapters, the way the Rust scaffold is built: the business rule
                  never imports the bank.
                </p>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>
      <p className={styles.legend}>{level === 1 ? "Scroll, or pick a level, to zoom in." : LEVELS[level].legend}</p>
    </aside>
  );
}
