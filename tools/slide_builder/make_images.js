// Generates tiles, before/after panels and illustrations used by the decks.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, 'img');
fs.mkdirSync(OUT, { recursive: true });
const ICON_DIR = path.join(__dirname, 'node_modules/lucide-static/icons');
const C = { O: '#FC5230', Y: '#FFCD4A', G: '#6FB848', K: '#494A4E', card: '#EEEEEE', frame: '#242629' };

function icon(name, size, color, stroke = 1.6) {
  let svg = fs.readFileSync(path.join(ICON_DIR, name + '.svg'), 'utf8');
  svg = svg.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`)
    .replace(/stroke="currentColor"/, `stroke="${color}"`)
    .replace(/stroke-width="2"/, `stroke-width="${stroke}"`);
  return svg;
}

const BASE_CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Pretendard', sans-serif; background: transparent; }
.win { border-radius: 14px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
.bar { background: ${C.frame}; height: 44px; display: flex; align-items: center; padding: 0 18px; gap: 9px; position: relative; }
.dot { width: 13px; height: 13px; border-radius: 50%; }
.pill { position: absolute; left: 50%; transform: translateX(-50%); background: #45484d; color: #e8e8e8; font-size: 15px; padding: 4px 26px; border-radius: 12px; }
.body { flex: 1; padding: 22px 26px; display: flex; flex-direction: column; gap: 14px; }
.u { align-self: flex-end; background: ${C.card}; color: #2a2b2e; border-radius: 16px 16px 4px 16px; padding: 14px 18px; font-size: 21px; line-height: 1.45; max-width: 86%; }
.a { align-self: flex-start; display: flex; gap: 12px; max-width: 92%; }
.a .av { width: 36px; height: 36px; border-radius: 50%; background: ${C.O}; flex: none; display:flex; align-items:center; justify-content:center; }
.a .tx { font-size: 20px; line-height: 1.5; color: #3a3b3f; padding-top: 4px; }
.chip { display: inline-flex; align-items: center; gap: 8px; border-radius: 10px; padding: 9px 14px; font-size: 18px; font-weight: 600; }
.tag { display: inline-block; border-radius: 8px; padding: 6px 12px; font-size: 16px; font-weight: 700; }
.muted { color: #8b8d92; }
`;

function windowHtml(w, h, pill, inner, bodyStyle = '') {
  return `<div class="win" style="width:${w}px;height:${h}px">
  <div class="bar"><span class="dot" style="background:${C.O}"></span><span class="dot" style="background:${C.Y}"></span><span class="dot" style="background:${C.G}"></span><span class="pill">${pill}</span></div>
  <div class="body" style="${bodyStyle}">${inner}</div></div>`;
}
const AV = `<div class="av">${icon('sparkles', 20, '#fff', 2)}</div>`;

// ---------- tiles (391 x 267) ----------
const tiles = {
  // deck 1: four ways to use Claude
  t_app: ['message-square', C.O], t_code: ['terminal', C.K], t_proj: ['folder-open', C.Y], t_api: ['code', C.G],
  // deck 1: mistakes (unused fallback)
  // deck 2: skill design
  t_name: ['tag', C.O], t_steps: ['list-checks', C.Y], t_tmpl: ['file-spreadsheet', C.G], t_ban: ['ban', C.K],
  // deck 3: connectors
  t_notion: ['notebook-pen', C.K], t_gmail: ['mail', C.O], t_drive: ['calendar-clock', C.Y], t_figma: ['figma', C.G],
  // deck 4: Claude Code examples
  t_assets: ['images', C.O], t_sales: ['chart-column-increasing', C.Y], t_proto: ['monitor-smartphone', C.G], t_deck: ['presentation', C.K],
  // deck 4: motion use cases
  t_cloud: ['cloud', C.O], t_remote: ['smartphone', C.Y], t_sync: ['folder-sync', C.G], t_teleport: ['laptop', C.K],
  t_logo: ['wand-sparkles', C.O], t_sns: ['smartphone', C.Y], t_reel: ['film', C.G], t_data: ['chart-line', C.K],
};

function tileHtml(iconName, color) {
  const dark = color === C.Y ? '#3b3418' : '#ffffff';
  return `<div style="width:391px;height:267px;border-radius:10px;background:${color};position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden">
    <div style="position:absolute;right:-40px;bottom:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.13)"></div>
    <div style="position:absolute;left:22px;top:20px;display:flex;gap:7px"><span class="dot" style="background:rgba(255,255,255,.75)"></span><span class="dot" style="background:rgba(255,255,255,.5)"></span><span class="dot" style="background:rgba(255,255,255,.3)"></span></div>
    ${icon(iconName, 112, dark, 1.5)}
  </div>`;
}

// ---------- before / after panels (824 x 453) ----------
const PW = 824, PH = 453;
const panels = {
  p_prompt_before: windowHtml(PW, PH, '새 대화', `
    <div class="u">견적서 만들어줘</div>
    <div class="a">${AV}<div class="tx"><b>[회사명] 견적서</b><br>품목: 디자인 작업 1식<br>금액: 협의 / 일정: 추후 결정</div></div>
    <div style="margin-top:auto"><span class="tag" style="background:#ffe3dc;color:${C.O}">정보가 없어 추측으로 채운 빈 양식</span></div>`),
  p_prompt_after: windowHtml(PW, PH, '새 대화', `
    <div class="u" style="font-size:17.5px;max-width:100%;line-height:1.5">우리는 <b>브랜딩 전문 디자인 회사</b>야. 아래 요청 메일로 견적서를 만들어줘.<br>
    · 항목: 브랜드 전략 / 로고·BI / 응용 디자인 / 가이드북 (첨부 단가표 기준)<br>
    · 수정 2회 포함, 추가 수정은 회당 별도 · 부가세 10% 별도<br>
    · 표 형식 + 고객 안내 문구 3줄 · <b style="color:${C.O}">정보가 부족하면 먼저 질문해줘</b></div>
    <div class="a">${AV}<div class="tx">확인할 점이 2가지 있어요. ① 응용 디자인 범위(명함·서식 외 포함?) ② 희망 납품일은 언제인가요?</div></div>`),

  p_calc_before: windowHtml(PW, PH, '견적 계산', `
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <span class="chip" style="background:${C.card}">${icon('calculator', 22, C.K)} 계산기</span>
      <span class="chip" style="background:${C.card}">${icon('file-spreadsheet', 22, C.K)} 엑셀</span>
      <span class="chip" style="background:${C.card}">${icon('notebook-pen', 22, C.K)} 메모장</span>
      <span class="chip" style="background:${C.card}">${icon('mail', 22, C.K)} 메일</span></div>
    <div style="font-size:22px;line-height:1.7;color:#55575c;margin-top:6px">로고 3,000,000 + 응용 1,200,000 + …<br>부가세는 따로 계산 → 다시 엑셀에 옮겨 적기<br>수정 추가되면 처음부터 다시</div>
    <div style="margin-top:auto"><span class="tag" style="background:#ffe3dc;color:${C.O}">창 4개를 오가며 손으로 계산</span></div>`),
  p_calc_after: windowHtml(PW, PH, '견적 계산기 · 아티팩트', `
    ${[['브랜드 전략', '1', '2,000,000'], ['로고·BI 디자인', '1', '3,000,000'], ['응용 디자인', '4', '1,200,000'], ['추가 수정', '1', '300,000']].map(r => `
    <div style="display:flex;align-items:center;gap:14px;font-size:20px;color:#333">
      <div style="flex:1;background:${C.card};border-radius:8px;padding:9px 14px">${r[0]}</div>
      <div style="width:70px;text-align:center;background:${C.card};border-radius:8px;padding:9px 0">${r[1]}</div>
      <div style="width:170px;text-align:right">${r[2]}</div></div>`).join('')}
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;background:${C.K};color:#fff;border-radius:10px;padding:14px 18px">
      <span style="font-size:19px">합계 (부가세 포함)</span><b style="font-size:28px;color:${C.Y}">₩ 7,150,000</b></div>`, 'gap:11px'),

  p_mcp_before: windowHtml(PW, PH, '복사 · 붙여넣기 반복', `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:19px;margin-top:20px">
      ${['Notion', '복사', 'Claude', '붙여넣기', '결과 복사', 'Notion'].map((s, i) => `<span class="chip" style="background:${i % 2 ? '#fff' : C.card};border:2px solid ${C.card}">${s}</span>${i < 5 ? `<span style="color:#aaa;font-size:26px">→</span>` : ''}`).join('')}
    </div>
    <div style="font-size:22px;line-height:1.7;color:#55575c;margin-top:18px">견적 1건마다 창을 6번 오가기<br>옮기다가 숫자·이름이 틀리기 쉬움</div>
    <div style="margin-top:auto"><span class="tag" style="background:#ffe3dc;color:${C.O}">사람이 데이터를 나르는 구조</span></div>`),
  p_mcp_after: windowHtml(PW, PH, 'Claude + Notion 커넥터', `
    <div class="u">Notion 견적 DB에서 이번 주 요청 건 찾아서 견적서 페이지 만들어줘</div>
    <div class="a">${AV}<div class="tx" style="display:flex;flex-direction:column;gap:10px">
      <span class="chip" style="background:#eef7e9;color:#3f7d22">${icon('search', 20, '#3f7d22', 2)} Notion 검색 · 요청 3건 발견</span>
      <span class="chip" style="background:#eef7e9;color:#3f7d22">${icon('file-plus', 20, '#3f7d22', 2)} 견적서 페이지 3개 생성</span>
      <span>완료했어요. 금액은 단가표 기준이니 한 번 확인해 주세요.</span></div></div>`),

  p_sched_before: windowHtml(PW, PH, '받은편지함 · 읽지 않음 14', `
    ${[['A사', '리브랜딩 견적 문의드립니다'], ['B스튜디오', '2차 시안 피드백 전달드려요'], ['C커머스', '패키지 일정 확인 부탁드립니다'], ['D카페', '로고 수정 요청 (긴급)']].map(r => `
    <div style="display:flex;gap:16px;align-items:center;font-size:20px;border-bottom:1px solid #eee;padding-bottom:10px">
      <span style="width:10px;height:10px;border-radius:50%;background:${C.O}"></span><b style="width:120px">${r[0]}</b><span class="muted">${r[1]}</span></div>`).join('')}
    <div style="margin-top:auto"><span class="tag" style="background:#ffe3dc;color:${C.O}">출근하자마자 30분 메일 정리</span></div>`, 'gap:12px'),
  p_sched_after: windowHtml(PW, PH, 'Notion · 오늘 할 일', `
    <div style="font-size:26px;font-weight:700;color:#222">11월 6일 메일 요약</div>
    ${[[C.O, '견적', 'A사 리브랜딩 견적 요청 → 견적서 초안 준비됨'], [C.Y, '피드백', 'B스튜디오 2차 시안 수정 3건 정리'], [C.G, '일정', 'C커머스 패키지 납품일 확인 필요'], [C.K, '긴급', 'D카페 로고 수정 오늘 회신']].map(r => `
    <div style="display:flex;gap:12px;align-items:center;font-size:19px"><span class="tag" style="background:${r[0]};color:${r[0] === C.Y ? '#3b3418' : '#fff'};width:76px;text-align:center">${r[1]}</span><span style="color:#333">${r[2]}</span></div>`).join('')}
    <div style="margin-top:auto"><span class="tag" style="background:#eef7e9;color:#3f7d22">${'매일 08:30 자동 실행'}</span></div>`, 'gap:13px'),

  p_motion_before: windowHtml(PW, PH, 'Timeline', `
    ${['Logo', 'Slogan', 'Background', 'CTA'].map((l, i) => `
    <div style="display:flex;align-items:center;gap:14px;font-size:18px;color:#444">
      <div style="width:120px">${l}</div>
      <div style="flex:1;height:30px;background:${C.card};border-radius:6px;position:relative">
        ${[0.08 + i * 0.1, 0.3 + i * 0.07, 0.55 + i * 0.05, 0.8].map(p => `<span style="position:absolute;left:${p * 100}%;top:7px;width:15px;height:15px;background:${C.K};transform:rotate(45deg)"></span>`).join('')}
      </div></div>`).join('')}
    <div style="font-size:20px;color:#55575c;line-height:1.6">키프레임 하나하나 조정 · 사이즈별로 다시 작업</div>
    <div style="margin-top:auto"><span class="tag" style="background:#ffe3dc;color:${C.O}">문구가 바뀌면 처음부터 수정</span></div>`, 'gap:13px'),
  p_motion_after: windowHtml(PW, PH, 'Claude Code', `
    <div class="u" style="font-size:19px">로고가 가운데서 커지며 등장하고, 슬로건이 한 글자씩 나타나는 5초 영상. 9:16, 1:1, 16:9 버전으로</div>
    <div class="a">${AV}<div class="tx" style="display:flex;flex-direction:column;gap:9px">
      <span>렌더링을 마쳤어요.</span>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${['logo_9x16.mp4', 'logo_1x1.mp4', 'logo_16x9.mp4'].map(f => `<span class="chip" style="background:${C.K};color:#fff">${icon('film', 20, C.Y, 2)} ${f}</span>`).join('')}</div></div></div>`),
};

// ---------- illustrations for photo layout (823 x 922) ----------
const IW = 823, IH = 922;
function hub() {
  const items = [['Notion', 'notebook-pen', C.K], ['Gmail', 'mail', C.O], ['Drive', 'hard-drive', C.Y], ['Figma', 'figma', C.G], ['Calendar', 'calendar', C.O], ['Slack', 'message-circle', C.K]];
  const cx = IW / 2, cy = IH / 2 + 10, R = 285;
  let lines = '', nodes = '';
  items.forEach((it, i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / items.length);
    const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
    lines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#c9c9cc" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>`;
    const mx = cx + (R * 0.55) * Math.cos(ang), my = cy + (R * 0.55) * Math.sin(ang);
    lines += `<rect x="${mx - 17}" y="${my - 11}" width="34" height="22" rx="7" fill="${C.K}"/>`;
    const dark = it[2] === C.Y ? '#3b3418' : '#fff';
    nodes += `<div style="position:absolute;left:${x - 70}px;top:${y - 70}px;width:140px;height:140px;border-radius:50%;background:${it[2]};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;box-shadow:0 8px 18px rgba(0,0,0,.12)">${icon(it[1], 46, dark, 1.8)}<span style="font-size:20px;font-weight:700;color:${dark}">${it[0]}</span></div>`;
  });
  return `<div style="width:${IW}px;height:${IH}px;border-radius:14px;background:#F6F6F7;position:relative;overflow:hidden">
    <div style="position:absolute;left:34px;top:30px;font-size:24px;font-weight:700;color:${C.K}">MCP = AI용 USB-C</div>
    <div style="position:absolute;left:34px;top:66px;font-size:19px;color:#8b8d92">하나의 규격으로 여러 도구에 연결</div>
    <svg width="${IW}" height="${IH}" style="position:absolute;left:0;top:0">${lines}</svg>
    ${nodes}
    <div style="position:absolute;left:${cx - 95}px;top:${cy - 95}px;width:190px;height:190px;border-radius:50%;background:#fff;border:6px solid ${C.O};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
      ${icon('sparkles', 56, C.O, 1.8)}<span style="font-size:28px;font-weight:800;color:#222">Claude</span></div>
  </div>`;
}
function memory() {
  const cards = [['내 업무', '브랜딩 전문 디자인 회사 대표'], ['선호 말투', '결론부터, 존댓말, 짧게'], ['견적 규칙', '부가세 별도, 수정 2회 포함'], ['진행 중', 'A사 리브랜딩 · 2차 시안 단계']];
  const cols = [C.O, C.Y, C.G, C.K];
  return `<div style="width:${IW}px;height:${IH}px;border-radius:14px;background:#F6F6F7;padding:46px 44px;display:flex;flex-direction:column;gap:22px">
    <div style="display:flex;align-items:center;gap:14px">${icon('brain', 48, C.O, 1.8)}<span style="font-size:30px;font-weight:800;color:#222">Claude가 기억하는 것</span></div>
    <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:12px;padding:16px 22px;font-size:21px;color:#333">메모리 사용
      <span style="width:64px;height:34px;border-radius:17px;background:${C.G};position:relative"><span style="position:absolute;right:4px;top:4px;width:26px;height:26px;border-radius:50%;background:#fff"></span></span></div>
    ${cards.map((c, i) => `<div style="background:#fff;border-radius:14px;padding:22px 24px;display:flex;gap:18px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.05)">
      <span style="width:16px;height:16px;border-radius:50%;background:${cols[i]};flex:none"></span>
      <div><div style="font-size:18px;color:#8b8d92;margin-bottom:6px">${c[0]}</div><div style="font-size:24px;font-weight:700;color:#2a2b2e">${c[1]}</div></div></div>`).join('')}
    <div style="margin-top:auto;font-size:18px;color:#8b8d92">설정에서 기억한 내용을 확인하고 지울 수 있어요</div>
  </div>`;
}
const illus = { i_mcp: hub(), i_memory: memory() };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  async function shot(key, html, w, h) {
    await page.setViewportSize({ width: w + 20, height: h + 20 });
    await page.setContent(`<html><head><style>${BASE_CSS}</style></head><body style="padding:10px"><div id="x" style="width:${w}px;height:${h}px">${html}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#x').screenshot({ path: path.join(OUT, key + '.png'), omitBackground: true });
  }
  for (const [k, [ic, col]] of Object.entries(tiles)) await shot(k, tileHtml(ic, col), 391, 267);
  for (const [k, html] of Object.entries(panels)) await shot(k, html, PW, PH);
  for (const [k, html] of Object.entries(illus)) await shot(k, html, IW, IH);
  await browser.close();
  console.log('done', fs.readdirSync(OUT).length);
})();
