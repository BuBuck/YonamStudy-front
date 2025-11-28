import React, { lazy, Suspense, useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import Header from "./components/section/Header";
import Main from "./components/section/Main";
import Footer from "./components/section/Footer";

const MainPage = lazy(() => import("./pages/MainPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const GroupPage = lazy(() => import("./pages/GroupPage"));
const CreateGroupPage = lazy(() => import("./pages/CreateGroupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Not = lazy(() => import("./pages/Not"));

import { AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import ChatDock from "./components/chat/ChatDock";

import "./App.css";

function App() {
    const data = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Header />
            <Suspense fallback={<Main />}>
                <Routes>
                    <Route exact path="/" element={<MainPage />} />
                    <Route
                        exact
                        path="/auth"
                        element={!data.isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />}
                    />
                    <Route exact path="/search/:searchId" element={<SearchPage />} />
                    <Route exact path="/group/:groupId" element={<GroupPage />} />
                    <Route exact path="/createGroup" element={<CreateGroupPage />} />
                    <Route exact path="/dashboard" element={<DashboardPage />} />
                    <Route
                        exact
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        exact
                        path="/chat/:groupId"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route exact path="*" element={<Not />} />
                </Routes>
            </Suspense>
            {data.isAuthenticated && <ChatDock />}
            <Footer />
        </BrowserRouter>
    );
}

export default App;
