# 연암공과대학교 교내 스터디그룹 매칭 시스템

JavaScript 기말 대체 프로젝트

- 파일 구조(Frontend)
YonamStudy-front/
├── node_modules/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   └── SignupForm.jsx
│   │   │
│   │   ├── ChatDock/
│   │   │   ├── ChatDock.css
│   │   │   └── ChatDock.jsx
│   │   │
│   │   ├── Comment/
│   │   │   ├── Comment.css
│   │   │   ├── Comment.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   ├── CommentItem.jsx
│   │   │   └── CommentUpdateForm.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── UserInfo.css
│   │   │   └── UserInfo.jsx
│   │   │
│   │   ├── group/
│   │   │   ├── ModalForm/
│   │   │   │   ├── ApplicationFormModal.css
│   │   │   │   ├── ApplicationFormModal.jsx
│   │   │   │   ├── ApplicationListModal.css
│   │   │   │   ├── ApplicationListModal.jsx
│   │   │   │   ├── CreateFormModal.css
│   │   │   │   └── CreateFormModal.jsx
│   │   │   ├── MyGroupList.css
│   │   │   └── MyGroupList.jsx
│   │   │
│   │   ├── HeroCarousel/
│   │   │   ├── HeroCarousel.css
│   │   │   └── HeroCarousel.jsx
│   │   │
│   │   ├── LoadingSpinner/
│   │   │   ├── LoadingSpinner.css
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── Modal/
│   │   │   ├── Modal.css
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── section/
│   │   │   ├── Footer.css
│   │   │   │── Footer.jsx
│   │   │   ├── Header.css
│   │   │   │── Header.jsx
│   │   │   └── Main.jsx
│   │   │
│   │   └── ProtectedRoute.jsx
│   │
│   ├── contexts/             
│   │   └── auth/
│   │       ├── AuthContext.js
│   │       └── AuthProvider.jsx
│   │
│   ├── hooks/               
│   │   ├── useLocalStorage.js
│   │   │
│   ├── pages/               
│   │   ├── AuthPage/
│   │   │   ├── AuthPage.css
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── ChatPage/
│   │   │   ├── ChatPage.css
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── CreateGroupPage/
│   │   │   ├── CreateGroupPage.css
│   │   │   └── CreateGroupPage.jsx
│   │   │
│   │   ├── DashboardPage/
│   │   │   ├── DashboardPage.css
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   ├── GroupPage/
│   │   │   ├── GroupPage.css
│   │   │   └── GroupPage.jsx
│   │   │
│   │   ├── MainPage/
│   │   │   ├── MainPage.css
│   │   │   └── MainPage.jsx
│   │   │
│   │   ├── NotFoundPage/
│   │   │   ├── NotFoundPage.css
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   └── SearchPage/
│   │       ├── SearchPage.css
│   │       └── SearchPage.jsx
│   │
│   ├── styles/
│   │   ├── font/
│   │   │   └── font.css
│   │   ├── App.css
│   │   └── globals.css
│   │
│   ├── utils/
│   │   └── timeUtils.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── server.js
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js