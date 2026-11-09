import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, EASE_OUT, INSTRUCTOR, clamp, fontFamily } from "../theme";

const DOTS = [
  { color: COLORS.red, x: 330, y: 230, size: 56, delay: 4 },
  { color: COLORS.green, x: 1440, y: 180, size: 44, delay: 8 },
  { color: COLORS.yellow, x: 1500, y: 700, size: 64, delay: 12 },
  { color: COLORS.black, x: 260, y: 660, size: 28, delay: 16 },
];

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Intro"
      style={{
        backgroundColor: COLORS.content,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {DOTS.map((d, i) => (
        <Interactive.Div
          key={i}
          name={`Dot ${i + 1}`}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            backgroundColor: d.color,
            scale: interpolate(frame, [d.delay, d.delay + 18], [0, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12 }),
            }),
            translate: interpolate(frame, [0, 65], ["0px 0px", `0px ${i % 2 ? -18 : 18}px`], clamp),
          }}
        />
      ))}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Interactive.Div
          name="Label"
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: COLORS.muted,
            letterSpacing: 4,
            opacity: interpolate(frame, [6, 22], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [6, 22], ["0px 24px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
          }}
        >
          {INSTRUCTOR.label}
        </Interactive.Div>

        <div style={{ display: "flex", overflow: "hidden", paddingBottom: 12, marginTop: 8 }}>
          {INSTRUCTOR.name.split("").map((ch, i) => (
            <Interactive.Div
              key={i}
              name={`Name ${ch}`}
              style={{
                fontSize: 220,
                fontWeight: 900,
                color: COLORS.ink,
                lineHeight: 1.1,
                letterSpacing: -6,
                translate: interpolate(frame, [12 + i * 4, 34 + i * 4], ["0px 260px", "0px 0px"], {
                  ...clamp,
                  easing: EASE_OUT,
                }),
              }}
            >
              {ch}
            </Interactive.Div>
          ))}
        </div>

        <Interactive.Div
          name="Underline"
          style={{
            height: 10,
            width: 360,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.yellow}, ${COLORS.green})`,
            scale: interpolate(frame, [28, 48], ["0 1", "1 1"], { ...clamp, easing: EASE_OUT }),
          }}
        />

        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 40,
            fontSize: 44,
            fontWeight: 500,
            color: COLORS.sub,
            opacity: interpolate(frame, [34, 50], [0, 1], { ...clamp, easing: EASE_OUT }),
            translate: interpolate(frame, [34, 50], ["0px 20px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
          }}
        >
          생성형 AI · 데이터 분석 · 프롬프트 엔지니어링
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
