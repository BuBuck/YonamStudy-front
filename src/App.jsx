import React, { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter, useLocation } from "react-router-dom";

import Header from "./components/section/Header";
import Main from "./components/section/Main";
import Footer from "./components/section/Footer";

import ChatDock from "./components/chat/ChatDock";

import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import GroupPage from "./pages/GroupPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import DashboardPage from "./pages/DashboardPage";
import FullChatPage from "./pages/FullChatPage";
import Not from "./pages/Not";

import { AuthContext } from "./contexts/auth/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
    const data = useContext(AuthContext);

    const location = useLocation();
    const isChatPage = location.pathname.startsWith("/chat");

    return (
        <>
            <Main>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <div>
                                <Header />
                                <MainPage />
                                <Footer />
                            </div>
                        }
                    />
                    <Route
                        exact
                        path="/auth"
                        element={!data.isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />}
                    />
                    <Route exact path="/search/:searchId" element={<SearchPage />} />
                    <Route exact path="/study-groups/:groupId" element={<GroupPage />} />
                    <Route
                        exact
                        path="/createGroup"
                        element={
                            <ProtectedRoute>
                                <CreateGroupPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        exact
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        exact
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <FullChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        exact
                        path="/chat/:groupId"
                        element={
                            <ProtectedRoute>
                                <FullChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route exact path="*" element={<Not />} />
                </Routes>
            </Main>
            {data.isAuthenticated && !isChatPage && <ChatDock />}
        </>
    );
}

export default App;
