import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansKR";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["korean", "latin"],
});

export const COLORS = {
  stage: "#6e6f74",
  chrome: "#242528",
  urlBar: "#3a3b3f",
  content: "#ffffff",
  ink: "#141414",
  muted: "#9a9a9a",
  sub: "#5a5a5a",
  chip: "#f0f0f0",
  card: "#efefef",
  red: "#ff4f2e",
  yellow: "#ffd23f",
  green: "#5cb946",
  black: "#1f1f1f",
};

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const INSTRUCTOR = {
  name: "손준수",
  label: "강사 소개",
  expertise: [
    { text: "생성형 AI 실무 활용", color: COLORS.red },
    { text: "공공데이터 분석·시각화", color: COLORS.yellow },
    { text: "프롬프트 엔지니어링", color: COLORS.green },
    { text: "Python 프로그래밍", color: COLORS.black },
    { text: "머신러닝 · 딥러닝", color: COLORS.red },
    { text: "군집화를 활용한 AI 서비스 기획", color: COLORS.green },
  ],
  careerLeft: [
    "전남대학교 산업공학과 졸업",
    "고용노동부 직업능력개발훈련교사 3급",
    "고용노동부 K-Digital Training 강사",
    "고용노동부 산업구조변화대응 등 특화훈련 강사",
    "과학기술정보통신부 채용연계형 SW 전문인재양성사업 강사",
    "광주인공지능사관학교 강사",
  ],
  careerRight: [
    "LG전자 AX·DX School 강사",
    "동아일보 MX School 강사",
    "이스트소프트 이스트캠프 공인 강사",
    "광주교통공사 생성형 AI 실무활용 교육",
    "광주동구청 생성형 AI 실무활용 교육",
    "SM Universe K-뉴딜 강사",
  ],
};
