# 📚 늘푸른 도서관 도서 예약 웹앱 (Evergreen Library Reservation)

Google Apps Script(Google Sheets) API와 통신하여 실시간 도서 목록 조회 및 도서 예약을 처리하는 모던 프론트엔드 웹 애플리케이션입니다.

---

## 🚀 빠른 시작 및 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
```

---

## 🌐 GitHub 업로드 및 Vercel 배포 가이드

### 1단계: GitHub에 코드 올리기

터미널에서 아래 명령어를 순서대로 실행하여 깃허브 저장소에 코드를 푸시합니다:

```bash
# 1. Git 저장소 초기화 (아직 안 되어 있는 경우)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 첫 커밋 작성
git commit -m "feat: 늘푸른 도서관 예약 웹앱 초기 구축 및 Vercel 배포 설정"

# 4. 기본 브랜치를 main으로 설정
git branch -M main

# 5. GitHub 원격 저장소 연결 (GitHub에서 생성한 본인의 Repository URL 입력)
git remote add origin https://github.com/사용자이름/저장소이름.git

# 6. 푸시
git push -u origin main
```

---

### 2단계: Vercel에서 배포하기

1. **[Vercel](https://vercel.com)**에 로그인합니다 (GitHub 계정 연동 추천).
2. 대시보드 우측 상단의 **[Add New...]** ➔ **[Project]**를 클릭합니다.
3. 방금 푸시한 **GitHub Repository**를 찾아 **[Import]**를 클릭합니다.
4. **Project Settings**:
   - **Framework Preset**: `Vite` (자동 감지됨)
   - **Build Command**: `npm run build` (자동 감지됨)
   - **Output Directory**: `dist` (자동 감지됨)
5. **(선택 사항) Environment Variables (환경 변수)**:
   - 만약 본인의 Google Apps Script 배포 URL을 전역 기본값으로 지정하고 싶다면 추가하세요:
     - **Key**: `VITE_GAS_ENDPOINT`
     - **Value**: `https://script.google.com/macros/s/AKfycb.../exec`
   - *환경 변수를 넣지 않아도 웹앱 화면 내의 [연동 설정(⚙️)] 메뉴에서 언제든 URL을 자유롭게 변경할 수 있습니다.*
6. **[Deploy]** 버튼을 클릭하면 약 1분 이내에 글로벌 라이브 URL이 생성됩니다! 🎉

---

## ⚙️ Google Apps Script (GAS) 연동

프로젝트 루트의 `gas/Code.gs` 파일을 참고하세요:

1. **Google Sheets** 생성 후 URL의 스프레드시트 ID 확인:
   - 예: `https://docs.google.com/spreadsheets/d/1aBcDeFgHiJk.../edit` ➔ `1aBcDeFgHiJk...`
2. Google Apps Script 편집기에 `gas/Code.gs` 코드 복사 후 `SPREADSHEET_ID`에 ID 붙여넣기
3. **[배포]** ➔ **[새 배포]** ➔ 유형: **웹 앱(Web App)**
   - **다음 사용자 권한으로 실행**: `나(내 계정)`
   - **액세스 권한이 있는 사용자**: **`모든 사용자(Anyone)`** *(로그인 없이 요청받기 위해 필수)*
4. 생성된 Web App URL을 웹앱 상단 톱니바퀴 [연동 설정]에 등록하면 실시간 구글 시트와 연동 완료!

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Backend/DB**: Google Apps Script (Web App) + Google Sheets
- **Deployment**: Vercel (`vercel.json` SPA rewrite 지원)
