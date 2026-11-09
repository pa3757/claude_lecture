import { Composition, AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { IntroScene } from "./scenes/IntroScene";
import { ProfileScene } from "./scenes/ProfileScene";
import { COLORS, EASE_OUT, clamp, fontFamily } from "./theme";

const FPS = 30;
const INTRO = 65;
const PROFILE = 105;
const TRANSITION = 20;
const DURATION = INTRO + PROFILE - TRANSITION; // 150 frames = 5s

export const MyComposition = () => {
  return (
    <Composition
      id="InstructorIntro"
      component={InstructorIntro}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

export const InstructorIntro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.stage, fontFamily }}>
      <Interactive.Div
        name="Browser window"
        style={{
          position: "absolute",
          left: 50,
          top: 40,
          width: 1820,
          height: 1000,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: COLORS.content,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          opacity: interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: EASE_OUT }),
          scale: interpolate(frame, [0, 20], [0.94, 1], { ...clamp, easing: EASE_OUT, output: "perceptual-scale" }),
          translate: interpolate(frame, [0, 20], ["0px 40px", "0px 0px"], { ...clamp, easing: EASE_OUT }),
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 92,
            backgroundColor: COLORS.chrome,
            display: "flex",
            alignItems: "center",
            padding: "0 46px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {[COLORS.red, COLORS.yellow, COLORS.green].map((c) => (
              <div key={c} style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: c }} />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              translate: "-50% 0",
              width: 760,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.urlBar,
              color: "#f2f2f2",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                clipPath: `inset(0 ${interpolate(frame, [8, 30], [100, 0], clamp)}% 0 0)`,
              }}
            >
              kpx-academy / day1 / instructor
            </span>
          </div>
        </div>

        {/* Content area with scene transition */}
        <div style={{ position: "absolute", top: 92, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={INTRO}>
              <IntroScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={slide({ direction: "from-bottom" })}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={PROFILE}>
              <ProfileScene />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
