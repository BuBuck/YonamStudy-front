# YonamStudy-front

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
    git clone https://github.com/bubuck/YonamStudy-front.git
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
    VITE_BACKEND_URL=http://localhost:5000
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    서버가 실행되면 `http://localhost:5173` (Vite 기본 포트)에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
YonamStudy-front/
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

## 🧑‍💻 사용자 흐름 (User Flow)

1.  **초기 접속 및 인증:**
    *   사용자는 웹사이트에 접속하여 `MainPage`를 보게 되며, 여기에는 스터디 그룹 목록이 표시됩니다 (`GET ${VITE_BACKEND_URL}/api/study-groups/`).
    *   사용자는 로그인 페이지 (`/auth/login`)로 이동합니다.
    *   **로그인**: `POST ${VITE_BACKEND_URL}/api/auth/login` 엔드포인트로 자격 증명을 제출합니다.
    *   **회원가입**: `POST ${VITE_BACKEND_URL}/api/auth/signup` 엔드포인트로 세부 정보를 제출합니다.
    *   **비밀번호 찾기**: `POST ${VITE_BACKEND_URL}/api/auth/forgot-password` 엔드포인트를 통해 비밀번호 재설정 링크를 요청합니다.
    *   **비밀번호 재설정**: `POST ${VITE_BACKEND_URL}/api/auth/reset-password` 엔드포인트를 통해 새 비밀번호를 제출합니다.
    *   인증 성공 시, 사용자 인증 상태는 `AuthContext`와 `localStorage`를 통해 저장되며, 사용자는 리디렉션됩니다.

2.  **스터디 그룹 흐름:**
    *   **그룹 검색/탐색**: 사용자는 `GET ${VITE_BACKEND_URL}/api/study-groups/`에서 데이터를 가져와 `/search` 페이지에서 스터디 그룹을 보고 필터링할 수 있습니다.
    *   **그룹 상세 보기**: 그룹을 클릭하면 `/group/:groupId`로 이동하며, `GET ${VITE_BACKEND_URL}/api/study-groups/${groupId}`에서 세부 정보를 가져옵니다.
    *   **그룹 생성**: 인증된 사용자는 `/group/create`에서 양식을 작성하여 `POST ${VITE_BACKEND_URL}/api/study-groups/`로 요청을 보내 그룹을 생성합니다.
    *   **그룹 가입 (신청)**: 그룹 페이지에서 비회원은 `POST ${VITE_BACKEND_URL}/api/study-groups/${groupId}/applications` 엔드포인트로 신청서를 제출하여 가입할 수 있습니다.
    *   **신청 관리 (그룹장)**: 그룹장은 `GET ${VITE_BACKEND_URL}/api/study-groups/${groupId}/applications`를 통해 신청서를 가져올 수 있으며, `PATCH ${VITE_BACKEND_URL}/api/study-groups/${groupId}/applications/${applicationId}`를 통해 승인/거절할 수 있습니다.
    *   **그룹 정보 업데이트 (그룹장)**: 그룹장은 `PUT ${VITE_BACKEND_URL}/api/study-groups/${groupId}`를 통해 그룹 세부 정보를 업데이트할 수 있습니다.
    *   **그룹 이미지 업데이트 (그룹장)**: 그룹장은 `PUT ${VITE_BACKEND_URL}/api/study-groups/update-groupImage`를 통해 그룹 이미지를 업데이트할 수 있습니다.
    *   **그룹 삭제 (그룹장)**: 그룹장은 `DELETE ${VITE_BACKEND_URL}/api/study-groups/${groupId}`를 통해 그룹을 삭제할 수 있습니다.
    *   **그룹 탈퇴/멤버 강퇴**: 멤버는 `DELETE ${VITE_BACKEND_URL}/api/study-groups/${groupId}/members`를 통해 그룹을 탈퇴할 수 있으며, 그룹장은 멤버를 강퇴할 수 있습니다.
    *   **신청 양식 질문 관리 (그룹장)**: 그룹장은 `PUT ${VITE_BACKEND_URL}/api/study-groups/${groupId}/questions`를 통해 신청 양식 질문을 저장할 수 있습니다.

3.  **채팅 및 알림:**
    *   그룹 멤버는 실시간 채팅에 접근할 수 있습니다.
    *   애플리케이션은 `GET ${VITE_BACKEND_URL}/api/study-groups/notification`에서 채팅 알림을, `GET ${VITE_BACKEND_URL}/api/study-groups/lastMessages`에서 마지막 메시지를 가져옵니다.
    *   실시간 통신은 Socket.IO를 통해 처리됩니다.

4.  **대시보드 및 사용자 프로필:**
    *   사용자는 대시보드 (`/dashboard`)에 접속할 수 있습니다.
    *   **사용자 정보 업데이트**: 사용자는 `PUT ${VITE_BACKEND_URL}/api/users/${userId}`를 통해 정보를 업데이트할 수 있습니다.
    *   **사용자 프로필 이미지 업데이트**: 사용자는 `PUT ${VITE_BACKEND_URL}/api/users/update-userProfile`를 통해 프로필 사진을 업데이트할 수 있습니다.

5.  **댓글:**
    *   **댓글 가져오기**: `GET ${VITE_BACKEND_URL}/api/study-groups/${groupId}/comments`
    *   **댓글 작성**: `POST ${VITE_BACKEND_URL}/api/study-groups/${groupId}/comments`
    *   **댓글 수정**: `PUT ${VITE_BACKEND_URL}/api/study-groups/${groupId}/comments/${commentId}`
    *   **댓글 삭제**: `DELETE ${VITE_BACKEND_URL}/api/study-groups/${groupId}/comments/${commentId}`
