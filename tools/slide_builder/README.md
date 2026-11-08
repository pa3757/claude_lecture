# 슬라이드 생성 도구

`slides/`의 주제별 PPT를 만드는 스크립트입니다. 레퍼런스 템플릿(`template.pptx`)의 슬라이드를 복제해서 텍스트와 이미지만 바꿉니다.

- `t01_basics.py` ~ `t07_team.py`: 주제별 슬라이드 내용 (여기를 고치면 됩니다)
- `layouts.py`: 템플릿 레이아웃별 채우기 함수
- `engine.py`: 슬라이드 복제·텍스트 교체 엔진
- `make_images.js`: 카드 이미지, Before/After 화면, 설명 그림 생성 (`img/`)

```bash
cd tools/slide_builder && mkdir -p out && python3 build.py t01_basics t02_instructions t03_mcp t04_automation t05_code t06_motion t07_team
```

필요 패키지: python-pptx (이미지 재생성 시 Node.js, playwright, lucide-static)
