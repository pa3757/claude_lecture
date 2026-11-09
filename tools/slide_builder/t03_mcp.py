import layouts as L

H = 'claude_class · topic 03'
SUB = 'Claude 업무 자동화 클래스 · 주제 03'


def build(d):
    L.cover(d, SUB, 'MCP와 커넥터', header=H,
            notes='복습: 지침과 스킬의 차이는? 과제로 만든 견적서 3건에서 고칠 점 공유 → 스킬 수정.')
    L.index(d, [('01', 'MCP란 무엇인가 · AI용 USB-C'),
                ('02', 'MCP는 어떻게 동작하나'),
                ('03', '연결할 수 있는 커넥터 · 앱과 Claude Code'),
                ('04', '새 MCP 찾고, 무슨 일을 하는지 알아보기'),
                ('실습', 'Notion · Gmail 연결하고 테스트하기')],
            big='목차', small='TOPIC 03', header=H)

    L.divider(d, '01', ['Claude에게', '손과 발 달아주기'], ['MCP는 Claude가 Notion, Gmail 같은', '외부 도구를 직접 쓰게 해주는', '연결 규격입니다.'], header=H)
    L.photo(d, 'MCP란?', 'MCP = AI용 USB-C', [
        'Model Context Protocol의 약자입니다.', '',
        '예전에는 도구마다 연결 방법을', '따로 만들어야 했습니다.', '',
        'MCP라는 공통 규격 덕분에 한 번 만든 연결을', 'Claude 앱과 Claude Code 등에서 똑같이 씁니다.', '',
        'Anthropic이 공개한 개방형 표준입니다.'],
        'i_mcp', header=H)
    L.transform(d, 'MCP 연결 전과 후', [
        'Notion에서 복사 → Claude에 붙여넣기', '→ 결과 복사 → 다시 Notion에 붙여넣기', '사람이 데이터를 나르는 구조'], [
        '"Notion 견적 DB에서 이번 주 요청 건 찾아서', '견적서 페이지 만들어줘"', '→ Claude가 직접 검색·작성·저장'],
        'p_mcp_before', 'p_mcp_after', header=H)
    L.steps(d, 'MCP는 이렇게 동작합니다', [
        ('나', ['자연어로 요청', '"이번 주 견적 요청', '정리해줘"']),
        ('Claude', ['어떤 도구가 필요한지', '판단 (MCP 클라이언트)']),
        ('MCP 서버', ['Notion, Gmail과', 'Claude 사이의 통역사', '(커넥터)']),
        ('외부 서비스', ['실제 데이터 조회·생성·', '수정 후 결과 반환'])], header=H,
        notes='Claude가 도구를 쓸 때 권한 확인을 요청할 수 있음. 읽기 권한과 쓰기 권한(발송, 삭제)의 차이를 설명.')

    L.divider(d, '02', ['어떤 도구를', '연결할 수 있을까'], ['자주 쓰는 커넥터와', '새 MCP를 찾는 방법을 알아봅니다.'], header=H)
    L.grid4(d, '연결할 수 있는 커넥터', [
        ('Notion', ['페이지·DB 검색, 생성, 수정', '고객 DB, 견적서 페이지'], 't_notion'),
        ('Gmail', ['메일 검색과 요약,', '답장 초안 작성'], 't_gmail'),
        ('Drive · Calendar', ['문서·시트 읽기,', '일정 조회와 등록'], 't_drive'),
        ('디자인 도구', ['Figma, Canva 등', '지원 범위는 커넥터마다 다름'], 't_figma')], header=H,
        notes='연결은 Customize > Connectors에서 계정 로그인으로. 회사 계정은 관리자 허용이 필요할 수 있음. 쓰기 작업은 항상 확인 후 실행.')
    L.versus(d, '앱 커넥터 vs Claude Code MCP', '앱 커넥터', 'Claude Code', [
        ['**연결**  설정 화면에서 클릭 + 로그인'],
        ['**난이도**  쉬움'],
        ['**장점**  바로 사용'],
        ['**추천**  대부분의 업무']], [
        ['**연결**  claude mcp add 명령어나 설정 파일'],
        ['**난이도**  중간'],
        ['**장점**  내 컴퓨터 파일 작업과 결합'],
        ['**추천**  파일을 대량으로 다루는 자동화']],
        pills=('claude_app', 'claude_code'))
    L.steps(d, '새 커넥터, 무슨 일을 하는지 알아보기', [
        ('디렉터리 검색', ['Customize > Connectors', '카테고리·이름으로 검색']),
        ('소개 확인', ['설명, 제공 도구 목록,', 'Verified·Community 표시']),
        ('Claude에게 질문', ['"이 커넥터로 할 수 있는', '일을 알려줘"']),
        ('작게 테스트', ['읽기 작업부터 해보고', '쓰기·발송은 확인 후'])], header=H,
        notes='주제 01의 "너 이런 작업 가능해?"를 커넥터에도 그대로 적용. 디렉터리 주소: claude.ai/customize/connectors. Verified 표시는 보안 감사가 아님(공식 문서). 연결 후 대화창 도구 메뉴에서 커넥터별 도구 목록과 권한 확인. Claude Code에서는 /mcp로 확인.')
    L.table(d, 'MCP·커넥터를 찾을 수 있는 곳', ['어디서', '주소', '특징'], [
        ['Claude 커넥터 디렉터리', 'claude.ai/customize/connectors', '공식. Claude 앱·Claude Code 공통 목록'],
        ['공식 MCP Registry', 'registry.modelcontextprotocol.io', 'MCP 표준 공식 목록 (개발자용 정보)'],
        ['MCP 공식 GitHub', 'github.com/modelcontextprotocol', '참고용 서버와 문서 모음'],
        ['Claude Code', '/mcp 명령어', '연결된 서버와 도구 목록 확인'],
        ['카카오 PlayMCP', 'playmcp.kakao.com', '카카오톡 나에게 보내기 등 국내 서비스'],
        ['서비스 공식 문서', '예) Notion·Figma 도움말', '그 서비스가 MCP를 직접 제공하는지']],
        [('우선', '공식 목록', '디렉터리에서 먼저 찾기'), ('확인', '권한', '읽기·쓰기 범위 보고 연결'), ('주의', '비공식', '출처 모르는 서버는 피하기')],
        col_widths=[1.2, 1.5, 1.8], header=H, row_h=0.55,
        notes='출처가 불분명한 MCP 서버는 내 계정 권한으로 데이터를 읽고 쓸 수 있으니 주의. 회사 계정은 관리자(Owner)가 허용한 커넥터만 쓸 수 있음. 카카오 PlayMCP 연결: PlayMCP에 카카오 로그인 → 도구함에 쓸 도구(예: 카카오톡 나와의 채팅) 담기 → Claude의 Customize > Connectors에서 커스텀 커넥터로 https://playmcp.kakao.com/mcp 추가 → 카카오 로그인·동의. 도구함이 비어 있으면 연결돼도 쓸 도구가 없음. 로그인 화면 주소가 kakao.com인지 확인.')
    L.text(d, '실습', '약 45분 · 가상 견적 요청 메일 3개를 사용합니다', [
        '**1**  커넥터 디렉터리에서 Notion, Gmail 찾아 소개와 도구 목록 읽어보기',
        '**2**  Notion, Gmail 연결 → "내 Notion에서 최근 수정된 페이지 알려줘"',
        '**3**  "Gmail 커넥터로 할 수 있는 일과 없는 일을 알려줘" 물어보기',
        '**4**  가상 견적 요청 메일을 내게 보내고 "견적 요청 메일 찾아서 요약해줘"',
        '**5**  디렉터리에서 회사에 쓸 만한 커넥터 1개 더 찾아보기 (Figma, Canva 등)'], header=H,
        notes='Gmail 실습은 practice_materials의 가상 메일을 자기 자신에게 보내서 사용.')
    L.objective(d, '정리', ['복사·붙여넣기 없이', '도구와 연결된 Claude'], [
        '새 커넥터는 먼저 묻고,', '읽기부터 작게 테스트하세요.'],
        ('배운 것', ['MCP 개념과 동작 방식', 'Notion·Gmail 커넥터 연결, 앱 vs Claude Code', '새 MCP 찾기와 권한 확인']),
        ('다음 주제', ['배운 것을 엮어서 실제 업무 자동화', '견적서 · 메일 · 예약 작업 · 브리프', '연결해 둔 Notion·Gmail을 그대로 사용']),
        header=H)
