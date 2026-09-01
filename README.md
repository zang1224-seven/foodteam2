# 주요 산지 기상·특보 브리핑 (foodteam2)

온라인 판매 채널 재고 점검 및 소싱·발주단가 판단을 위한 정적 대시보드입니다.

- **PART 01**: 주요 12개 산지(농·수·축산) 기상특보 브리핑 + 소싱/발주단가 코멘트
- **PART 02**: 식약처 식품 판매중단·회수 리스크 브리핑

두 섹션 모두 "업데이트" 버튼을 누르면 Claude(Anthropic API) 웹검색을 통해
클릭 시점 기준 최신 정보로 갱신됩니다.

## 폴더 구조

```
.
├── index.html                          # 메인 대시보드 (정적 HTML/CSS/JS)
├── netlify.toml                        # Netlify 빌드/함수 설정
├── netlify/functions/anthropic-proxy.js # Anthropic API 프록시 (API 키는 서버에서만 사용)
├── .env.example                        # 필요한 환경변수 예시 (실제 키는 넣지 마세요)
└── .gitignore
```

## 동작 원리

브라우저(`index.html`)는 API 키를 직접 갖고 있지 않습니다. 대신
`netlify/functions/anthropic-proxy.js` (서버리스 함수)를 호출하고,
이 함수가 Netlify 환경변수에 저장된 `ANTHROPIC_API_KEY`로 Anthropic API를
대신 호출합니다. API 키가 브라우저에 노출되지 않는 구조입니다.

## 배포 방법 (Netlify)

이 저장소는 **함수(서버리스)**를 포함하므로, Netlify 대시보드에 파일을
드래그&드롭하는 방식으로는 함수가 배포되지 않습니다. 아래 두 방법 중 하나를 사용하세요.

### 방법 A. GitHub 연동 (권장)

1. 이 저장소를 GitHub에 push
2. Netlify 대시보드 → **Add new site → Import an existing project**
3. GitHub 저장소 선택 (foodteam2)
4. Build settings
   - Build command: 비워둠
   - Publish directory: `.`
   - Functions directory: `netlify/functions` (netlify.toml에 이미 설정되어 있어 자동 인식)
5. **Site settings → Environment variables**에서 `ANTHROPIC_API_KEY` 등록
6. Deploy 실행

이후 GitHub에 push할 때마다 Netlify가 자동으로 재배포합니다.

### 방법 B. Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify link            # 기존 foodteam2 사이트와 연결
netlify env:set ANTHROPIC_API_KEY sk-ant-실제키값
netlify deploy --prod
```

## 로컬에서 함수 테스트

```bash
npm install -g netlify-cli
netlify dev
```

`netlify dev`는 `netlify.toml` 설정을 읽어 `index.html`과 함수를
로컬에서 함께 실행해줍니다 (기본 http://localhost:8888).

## 주의사항

- `ANTHROPIC_API_KEY`는 절대 `index.html`이나 저장소에 직접 커밋하지 마세요.
- 업데이트 버튼은 웹검색 결과를 요약한 것으로, 실제 기상청·식약처 원본 공고와
  100% 일치하지 않을 수 있습니다. 중요한 발주 판단 전에는 원본을 재확인하세요.
