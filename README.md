# 📌 PinWord — 핀터레스트 스타일 영단어 학습 플랫폼

> 이미지 기반 영단어 학습 + AI 이미지 자동 생성 + 퀴즈까지, 핀터레스트 감성으로

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📖 **단어 학습** | 전체 단어를 Pinterest Masonry 카드 형태로 학습 |
| 🖼️ **이미지 학습** | 이미지 카드를 클릭하면 3D 플립 애니메이션으로 단어·뜻 확인 |
| 🤖 **AI 이미지 생성** | 단어 입력 시 Pollinations.ai API로 이미지 자동 생성 |
| 📝 **단어 퀴즈** | 4지선다 단어 뜻 맞추기 퀴즈 + 점수 기록 |
| 🎨 **이미지 퀴즈** | 이미지를 보고 영단어 맞추기 |
| 👑 **관리자 패널** | 단어 추가/수정/삭제, 이미지 업로드, AI 이미지 생성 |
| 📊 **마이페이지** | 퀴즈 누적 횟수·평균 점수·최근 5회 추이 그래프 |
| 🔐 **JWT 인증** | 로그인/회원가입, ADMIN/USER 역할 기반 접근 제어 |

---

## 🛠️ 기술 스택

### Backend
- **Java 25** + **Spring Boot 4.0.6**
- **Spring Security** + **JWT** (JJWT)
- **Spring Data JPA** + **Hibernate**
- **MySQL** (로컬 / Aiven Cloud)
- **Pollinations.ai** — 무료 AI 이미지 생성 API

### Frontend
- **React 19** + **Vite**
- **React Router v7**
- **Axios**
- **Recharts** (통계 그래프)
- **CSS (Pinterest Masonry, 3D Flip Card)**

---

## 📂 프로젝트 구조

```
SW_PinWord/
├── src/main/java/pinword/
│   ├── controller/      # REST API 엔드포인트
│   ├── service/         # 비즈니스 로직
│   ├── repository/      # JPA 인터페이스
│   ├── entity/          # DB 테이블 매핑
│   ├── dto/             # 요청/응답 데이터 객체
│   └── security/        # JWT 필터, 유틸, Security 설정
├── src/main/resources/
│   ├── application.yml  # 환경변수 기반 설정
│   └── default-images/  # 기본 단어 이미지
├── uploads/             # AI 생성 및 업로드 이미지 저장 (로컬)
└── frontend/
    ├── src/
    │   ├── api/         # Axios 설정
    │   ├── pages/       # 각 페이지 컴포넌트 + CSS
    │   └── App.jsx      # 라우팅 + 네비게이션
    ├── .env.example     # 환경변수 예시
    └── netlify.toml     # Netlify 배포 설정
```

---

## ⚙️ 로컬 개발 환경 설정

### 사전 요구사항
- Java 25+
- Node.js 18+
- MySQL 8.0+

### 1. 저장소 클론
```bash
git clone https://github.com/obiwankwon/SW_PinWord.git
cd SW_PinWord
git checkout develop
```

### 2. MySQL DB 생성
```sql
CREATE DATABASE pinword CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 백엔드 환경변수 설정
`src/main/resources/application.yml`에서 DB 비밀번호 수정:
```yaml
password: ${DB_PASSWORD:여기에_본인_MySQL_비밀번호}
```
또는 환경변수로 설정:
```bash
set DB_PASSWORD=본인비밀번호   # Windows
export DB_PASSWORD=본인비밀번호 # Mac/Linux
```

### 4. 백엔드 실행
```bash
./gradlew bootRun
# 서버: http://localhost:8080
```

### 5. 프론트엔드 환경변수 설정
```bash
cd frontend
cp .env.example .env.local
# .env.local 내용 (기본값 그대로 사용 가능)
```

### 6. 프론트엔드 실행
```bash
npm install
npm run dev
# 앱: http://localhost:5173
```

### 기본 관리자 계정
서버 최초 실행 시 `admins.csv`에서 자동 생성됩니다.

---

## 🌐 배포 구조

```
Netlify (프론트)  ──→  Render (Spring Boot)  ──→  Aiven (MySQL)
     React               8080 포트                 Cloud DB
```

### Render (백엔드) 환경변수
| 변수명 | 설명 |
|--------|------|
| `DB_URL` | Aiven MySQL JDBC URL |
| `DB_USERNAME` | DB 사용자명 |
| `DB_PASSWORD` | DB 비밀번호 |
| `JWT_SECRET` | JWT 서명 키 (32자 이상) |

### Netlify (프론트엔드) 환경변수
| 변수명 | 설명 |
|--------|------|
| `VITE_BACKEND_URL` | Render 백엔드 URL (예: `https://pinword.onrender.com`) |
| `VITE_API_BASE_URL` | `https://pinword.onrender.com/api` |

---

## 🤖 AI 이미지 생성 흐름

```
관리자 [AI 이미지 생성 버튼 클릭]
    → POST /api/admin/words/generate-image { englishWord: "apple" }
    → GeminiImageService.generateAndSaveImage("apple")
    → GET https://image.pollinations.ai/prompt/Generate+an+image+of+"apple"...
    → 이미지 바이트 수신 → uploads/ai_apple.png 저장
    → /uploads/ai_apple.png 경로 반환
    → 단어 등록 시 해당 경로 자동 연결
```

---

## 📋 Git 브랜치 전략

```
main        ← 최종 릴리즈
  └── develop  ← 통합 개발
        └── feature/*  ← 기능 단위 개발
```

- `main` / `develop` 직접 커밋 금지 → Pull Request 필수
- `feature/` 브랜치에서 자유롭게 작업 후 PR

---

## 👥 팀원

상명대학교 스마트정보통신공학과 SW 프로젝트

---

## 📄 라이선스

MIT License
