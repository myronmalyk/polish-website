import React from "react";

export type EmblemStyle = "rings" | "monogram" | "crest";

interface EmblemProps {
  size: number;
  style?: EmblemStyle;
  ghost?: boolean;
  detail?: boolean;
}

/**
 * Chrome roundel emblem — a faithful port of the original design's emblem() helper.
 * All strokes reference the shared #agChrome gradient defined once in <VantaPolish>.
 */
export default function Emblem({
  size,
  style = "rings",
  ghost = false,
  detail = false,
}: EmblemProps) {
  const stroke = "url(#agChrome)";

  const wrap = (children: React.ReactNode) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display: "block",
        opacity: ghost ? 0.055 : 1,
        overflow: "visible",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );

  const badge = [
    <circle key="b1" cx={50} cy={50} r={46} fill="none" stroke={stroke} strokeWidth={1.3} />,
    <circle key="b2" cx={50} cy={50} r={40.5} fill="none" stroke={stroke} strokeWidth={0.6} opacity={0.45} />,
  ];

  if (style === "monogram") {
    return wrap(
      <>
        {badge}
        <text
          x={50}
          y={51}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Archivo, sans-serif"
          fontWeight={800}
          fontSize={33}
          letterSpacing="-1.5"
          fill="url(#agChrome)"
        >
          VP
        </text>
      </>
    );
  }

  if (style === "crest") {
    return wrap(
      <>
        <path d="M50 8 L86 20 L86 50 Q86 78 50 92 Q14 78 14 50 L14 20 Z" fill="none" stroke={stroke} strokeWidth={1.6} />
        <path d="M50 16 L79 26 L79 49 Q79 70 50 83 Q21 70 21 49 L21 26 Z" fill="none" stroke={stroke} strokeWidth={0.6} opacity={0.5} />
        <circle cx={50} cy={37} r={10} fill="none" stroke={stroke} strokeWidth={2.4} />
        <circle cx={41} cy={51} r={10} fill="none" stroke={stroke} strokeWidth={2.4} />
        <circle cx={59} cy={51} r={10} fill="none" stroke={stroke} strokeWidth={2.4} />
        <text x={50} y={75} textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize={5.5} letterSpacing="1.5" fill="#cfd3d6" opacity={0.8}>
          MMXXVI
        </text>
      </>
    );
  }

  // rings (default) — four interlocking chrome rings
  const ring = (k: string, cx: number) => (
    <circle key={k} cx={cx} cy={50} r={13.5} fill="none" stroke={stroke} strokeWidth={3.4} />
  );

  return wrap(
    <>
      {badge}
      {ring("r1", 28)}
      {ring("r2", 43)}
      {ring("r3", 57)}
      {ring("r4", 72)}
      <path d="M21 45 A13.5 13.5 0 0 1 34 42" fill="none" stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      {detail && (
        <text x={50} y={85} textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize={5.2} letterSpacing="2" fill="#cfd3d6" opacity={0.7}>
          VANTA · POLISH
        </text>
      )}
    </>
  );
}
