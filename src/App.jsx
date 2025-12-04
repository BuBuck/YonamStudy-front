import React, { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

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

    return (
        <BrowserRouter>
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
                        element={
                            !data.isAuthenticated ? (
                                <Navigate to="/auth/login" replace />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route path="/auth/:category" element={<AuthPage />} />

                    <Route exact path="/search/:searchId" element={<SearchPage />} />

                    <Route
                        exact
                        path="/study-groups/:groupId"
                        element={
                            <div>
                                <Header />
                                <GroupPage />
                            </div>
                        }
                    />
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
                        path="/dashboard/:studentId"
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
                    <Route
                        exact
                        path="/bubuck"
                        element={<Navigate to="https://github.com/BuBuck" />}
                    />
                    <Route exact path="/*" element={<Not />} />
                </Routes>
            </Main>
            {data.isAuthenticated && <ChatDock />}
        </BrowserRouter>
    );
}

export default App;
