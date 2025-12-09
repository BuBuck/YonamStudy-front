# YonamStudy-front (연암스터디-프론트)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

## 프로젝트 개요

YonamStudy-front는 스터디 그룹을 찾고, 생성하며, 관리할 수 있는 웹 애플리케이션의 프론트엔드 파트입니다. 사용자들이 스터디에 참여하고, 그룹원들과 소통할 수 있는 다양한 기능을 제공합니다.

## ✨ 주요 기능

*   **🔐 사용자 인증**: 회원가입, 로그인, 비밀번호 찾기/재설정 기능을 제공하여 안전하게 계정을 관리합니다.
*   **🔍 스터디 그룹 탐색**: 사용자는 개설된 스터디 그룹을 검색하고, 조건에 맞는 그룹을 찾을 수 있습니다.
*   **📝 스터디 그룹 생성 및 관리**: 자신만의 스터디 그룹을 만들고, 신청자를 관리하며, 그룹 정보를 수정할 수 있습니다.
*   **💬 실시간 채팅**: 그룹원들과 실시간으로 소통할 수 있는 채팅 기능을 통해 원활한 스터디 진행을 돕습니다.
*   **📊 대시보드**: 참여 중인 스터디, 내 정보 등 개인화된 활동 내역을 한눈에 확인할 수 있습니다.

## 🛠️ 기술 스택

| 구분 | 기술 |
|---|---|
| **Runtime** | Node.js |
| **Framework** | React |
| **Bundler** | Vite |
| **Routing** | React Router |
| **HTTP Client** | Axios |
| **Real-time** | Socket.IO Client |
| **Styling** | CSS |
| **Linting** | ESLint |

## 🚀 시작하기

### 사전 요구 사항

*   Node.js (v18.x 이상 권장)
*   npm (v9.x 이상 권장)

### 설치 및 실행

1.  **레포지토리 클론**
    ```bash
    git clone https://github.com/your-username/YonamStudy-front.git
    cd YonamStudy-front
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 채워주세요.
    ```env
    # 백엔드 API 서버의 주소
    VITE_API_BASE_URL=http://localhost:8080
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    서버가 실행되면 `http://localhost:5173` (Vite 기본 포트)에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
/Users/sunjeongin/MyProject/YonamStudy-front/
├───.gitignore
├───eslint.config.js      # ESLint 설정 파일
├───index.html            # 애플리케이션의 메인 HTML 파일
├───package.json          # 프로젝트 의존성 및 스크립트 관리
├───README.md             # 프로젝트 안내 문서
├───vite.config.js        # Vite 번들러 설정 파일
└───src/
    ├───App.jsx                   # 최상위 컴포넌트 및 라우팅 설정
    ├───main.jsx                  # React 애플리케이션 진입점
    ├───server.js                 # (아마도) 개발용 목업 서버 또는 유틸리티
    ├───components/               # 재사용 가능한 UI 컴포넌트
    │   ├───auth/                 # 사용자 인증 관련 컴포넌트 (로그인, 회원가입 등)
    │   ├───ChatDock/             # 채팅 위젯 컴포넌트
    │   ├───Comment/              # 댓글 기능 관련 컴포넌트
    │   ├───Dashboard/            # 대시보드 UI 컴포넌트
    │   ├───group/                # 스터디 그룹 관련 컴포넌트
    │   ├───HeroCarousel/         # 메인 페이지 캐러셀 컴포넌트
    │   ├───LoadingSpinner/       # 로딩 상태 표시 스피너
    │   ├───Modal/                # 공용 모달 컴포넌트
    │   ├───section/              # Header, Footer 등 섹션 컴포넌트
    │   └───StudyGroupCard/       # 스터디 그룹 정보 카드 UI
    ├───contexts/                 # React Context API 관리
    │   └───auth/                 # 인증 상태 관리 컨텍스트
    ├───hooks/                    # 커스텀 React 훅
    │   └───useLocalStorage.js    # 로컬 스토리지를 쉽게 사용하기 위한 훅
    ├───pages/                    # 각 페이지 단위의 컴포넌트
    │   ├───AuthPage/             # 인증 페이지
    │   ├───ChatPage/             # 채팅 페이지
    │   ├───CreateGroupPage/      # 스터디 생성 페이지
    │   ├───DashboardPage/        # 사용자 대시보드 페이지
    │   ├───GroupPage/            # 스터디 상세 페이지
    │   ├───MainPage/             # 메인 랜딩 페이지
    │   ├───NotFoundPage/         # 404 에러 페이지
    │   └───SearchPage/           # 스터디 검색 결과 페이지
    ├───styles/                   # 전역 스타일 및 폰트
    └───utils/                    # 유틸리티 함수
        ├───groupSignal.js        # 그룹 관련 시그널링 또는 상태 관리
        └───timeUtils.js          # 시간 포맷팅 등 시간 관련 유틸리티
```