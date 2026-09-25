import { hashHue, initials } from "../mockData";

const WARM = [
  "#7a4a1f",
  "#a6592e",
  "#6b6b2f",
  "#9c6b3b",
  "#94452f",
  "#b07d45",
  "#5d3a1a",
  "#8a6a3d",
  "#7d4a3a",
  "#9a6a1f",
];

export function Avatar({
  name,
  src,
  size = 40,
  style,
}: {
  name: string;
  src?: string | null;
  size?: number;
  style?: React.CSSProperties;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", ...style }}
      />
    );
  }
  const bg = WARM[hashHue(name) % WARM.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: 0.5,
        flexShrink: 0,
        ...style,
      }}
    >
      {initials(name)}
    </div>
  );
}