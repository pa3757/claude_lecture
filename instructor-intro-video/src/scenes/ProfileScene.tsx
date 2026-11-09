import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, EASE_OUT, INSTRUCTOR, clamp, fontFamily } from "../theme";

const PHOTO_DOTS = [
  { color: COLORS.red, x: 46, y: 46, size: 40, delay: 14 },
  { color: COLORS.green, x: 488, y: 108, size: 38, delay: 18 },
  { color: COLORS.yellow, x: 66, y: 334, size: 32, delay: 22 },
];

const CareerList: React.FC<{ items: string[]; start: number; flex: number }> = ({ items, start, flex }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex }}>
      {items.map((item, i) => (
        <Interactive.Div
          key={item}
          name={item}
          style={{
            display: "flex",
            gap: 18,
            fontSize: 23,
            lineHeight: 1.35,
            wordBreak: "keep-all",
            color: COLORS.ink,
            opacity: interpolate(frame, [start + i * 3, start + i * 3 + 12], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [start + i * 3, start + i * 3 + 12], ["-16px 0px", "0px 0px"], {
              ...clamp,
              easing: EASE_OUT,
            }),
          }}
        >
          <span>•</span>
          <span>{item}</span>
        </Interactive.Div>
      ))}
    </div>
  );
};

export const ProfileScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Profile" style={{ backgroundColor: COLORS.content, fontFamily }}>
      {/* Photo card */}
      <Interactive.Div
        name="Photo card"
        style={{
          position: "absolute",
          left: 62,
          top: 46,
          width: 570,
          height: 788,
          borderRadius: 22,
          overflow: "hidden",
          backgroundColor: COLORS.card,
          clipPath: `inset(${interpolate(frame, [0, 22], [100, 0], { ...clamp, easing: EASE_OUT })}% 0% 0% 0% round 22px)`,
        }}
      >
        <Img
          src={staticFile("instructor.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: interpolate(frame, [0, 105], [1.12, 1], { ...clamp, easing: Easing.out(Easing.quad) }),
          }}
        />
        {PHOTO_DOTS.map((d, i) => (
          <Interactive.Div
            key={i}
            name={`Photo dot ${i + 1}`}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              backgroundColor: d.color,
              scale: interpolate(frame, [d.delay, d.delay + 16], [0, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 12 }),
              }),
            }}
          />
        ))}
      </Interactive.Div>

      {/* Right column */}
      <div style={{ position: "absolute", left: 712, top: 40, width: 1046 }}>
        <Interactive.Div
          name="Label"
          style={{
            fontSize: 34,
            color: "#b5b5b5",
            opacity: interpolate(frame, [8, 20], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [8, 20], ["30px 0px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
          }}
        >
          {INSTRUCTOR.label}
        </Interactive.Div>
        <Interactive.Div
          name="Name"
          style={{
            fontSize: 92,
            fontWeight: 900,
            color: COLORS.ink,
            lineHeight: 1.25,
            letterSpacing: -2,
            opacity: interpolate(frame, [10, 24], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [10, 24], ["40px 0px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
          }}
        >
          {INSTRUCTOR.name}
        </Interactive.Div>

        <Interactive.Div
          name="Expertise title"
          style={{
            marginTop: 26,
            fontSize: 28,
            fontWeight: 700,
            color: "#777",
            opacity: interpolate(frame, [16, 28], [0, 1], { ...clamp, easing: EASE_OUT }),
          }}
        >
          전문 분야
        </Interactive.Div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {INSTRUCTOR.expertise.map((chip, i) => (
            <Interactive.Div
              key={chip.text}
              name={chip.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 54,
                padding: "0 20px",
                borderRadius: 27,
                backgroundColor: COLORS.chip,
                fontSize: 21,
                fontWeight: 700,
                color: COLORS.ink,
                whiteSpace: "nowrap",
                opacity: interpolate(frame, [20 + i * 3, 32 + i * 3], [0, 1], { ...clamp, easing: EASE_OUT }),
                scale: interpolate(frame, [20 + i * 3, 34 + i * 3], [0.85, 1], {
                  ...clamp,
                  easing: Easing.spring({ damping: 14 }),
                  output: "perceptual-scale",
                }),
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: chip.color,
                  flexShrink: 0,
                }}
              />
              {chip.text}
            </Interactive.Div>
          ))}
        </div>

        {/* Career card */}
        <Interactive.Div
          name="Career card"
          style={{
            marginTop: 34,
            padding: "30px 40px 34px",
            borderRadius: 22,
            backgroundColor: COLORS.card,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            opacity: interpolate(frame, [32, 46], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [32, 50], ["0px 50px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#777", marginBottom: 20 }}>주요 약력</div>
          <div style={{ display: "flex", gap: 28 }}>
            <CareerList items={INSTRUCTOR.careerLeft} start={42} flex={1.3} />
            <CareerList items={INSTRUCTOR.careerRight} start={48} flex={1} />
          </div>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
