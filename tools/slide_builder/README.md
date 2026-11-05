# 슬라이드 생성 도구

`slides/`의 회차별 PPT를 만드는 스크립트입니다. 레퍼런스 템플릿(`template.pptx`)의 슬라이드를 복제해서 텍스트와 이미지만 바꿉니다.

- `deck1.py` ~ `deck4.py`: 회차별 슬라이드 내용 (여기를 고치면 됩니다)
- `layouts.py`: 템플릿 레이아웃별 채우기 함수
- `engine.py`: 슬라이드 복제·텍스트 교체 엔진
- `make_images.js`: 카드 이미지, Before/After 화면, 설명 그림 생성 (`img/`)

```bash
cd tools/slide_builder && mkdir -p out && python3 build.py deck1 deck2 deck3 deck4
```

필요 패키지: python-pptx (이미지 재생성 시 Node.js, playwright, lucide-static)
