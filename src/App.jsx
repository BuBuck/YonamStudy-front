import React, { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import Header from "./components/section/Header";
import Main from "./components/section/Main";
import Footer from "./components/section/Footer";

import ChatDock from "./components/ChatDock/ChatDock";

import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import GroupPage from "./pages/GroupPage/GroupPage";
import CreateGroupPage from "./pages/CreateGroupPage/CreateGroupPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import { AuthContext } from "./contexts/auth/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import useLocalStorage from "./hooks/useLocalStorage";

import "./styles/App.css";

function App() {
    const { isAuthenticated } = useContext(AuthContext);

    const [user, _] = useLocalStorage("user", null);

    return (
        <BrowserRouter>
            <Main>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <>
                                <Header isAuthenticated={isAuthenticated} user={user} />
                                <MainPage />
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        exact
                        path="/auth"
                        element={
                            !isAuthenticated ? (
                                <Navigate to="/auth/login" replace />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/auth/:category"
                        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />}
                    />

                    <Route exact path="/search/:searchId" element={<SearchPage />} />

                    <Route
                        exact
                        path="/study-groups/:groupId"
                        element={
                            <>
                                <Header isAuthenticated={isAuthenticated} user={user} />
                                <GroupPage />
                            </>
                        }
                    />
                    <Route
                        exact
                        path="/createGroup"
                        element={
                            <ProtectedRoute>
                                <Header isAuthenticated={isAuthenticated} user={user} />
                                <CreateGroupPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        exact
                        path="/dashboard/:studentId"
                        element={
                            <ProtectedRoute>
                                <Header isAuthenticated={isAuthenticated} user={user} />
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
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
                    <Route
                        exact
                        path="/search"
                        element={
                            <>
                                <Header isAuthenticated={isAuthenticated} user={user} />
                                <SearchPage />
                            </>
                        }
                    />
                    <Route exact path="/*" element={<NotFoundPage />} />
                </Routes>
                {isAuthenticated && <ChatDock />}
            </Main>
        </BrowserRouter>
    );
}

export default App;
