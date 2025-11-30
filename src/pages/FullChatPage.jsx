import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../server";

import ChatHeader from "../components/chat/ChatHeader";
import ChatList from "../components/chat/ChatList";
import Chat from "../components/chat/Chat";

import { onGroupCreated } from "../utils/groupSignal";

import "../style/pages/FullChatPage.css";

function FullChatPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [notification, setNotification] = useState(0);
    const [unreadMap, setUnreadMap] = useState({});
    const [lastMessageMap, setLastMessageMap] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    const selectedGroup = groups.find((g) => g._id === groupId) || null;

    useEffect(() => {
        if (!user) return;

        if (user.group && user.group.length > 0) {
            socket.emit("joinGroups", user.group, (res) => {
                if (res.ok) console.log("FullChat: 모든 그룹 소켓 입장 완료");
            });
        }
        socket.emit("groups");

        const fetchData = async () => {
            try {
                const [notiRes, lastMsgRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/notification`, {
                        params: { userId: user.userId || user._id, group: user.group.join(",") },
                    }),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/lastMessages`, {
                        params: { userId: user.userId || user._id, group: user.group.join(",") },
                    }),
                ]);

                setNotification(notiRes.data.total);
                if (notiRes.data.groupCounts) setUnreadMap(notiRes.data.groupCounts);
                setLastMessageMap(lastMsgRes.data);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        fetchData();

        const removeListener = onGroupCreated((newGroup) => {
            setGroups((prev) => [...prev, newGroup]);
            socket.emit("joinGroup", newGroup._id);
            setUnreadMap((prev) => ({ ...prev, [newGroup._id]: 0 }));
            setLastMessageMap((prev) => ({
                ...prev,
                [newGroup._id]: { message: "새로운 대화방이 생성되었습니다.", time: new Date() },
            }));
        });

        return () => {
            removeListener();
        };
    }, []);

    useEffect(() => {
        const handleGroups = (res) => {
            setGroups(res);
        };

        const handleReceivedMessage = (newMessage) => {
            setLastMessageMap((prev) => ({
                ...prev,
                [newMessage.group]: {
                    message: newMessage.message,
                    time: newMessage.createdAt || new Date().toISOString(),
                },
            }));

            if (newMessage.sender._id === user._id) return;
            if (selectedGroup && selectedGroup._id === newMessage.group) return;

            setUnreadMap((prev) => ({
                ...prev,
                [newMessage.group]: (prev[newMessage.group] || 0) + 1,
            }));
        };

        socket.on("groups", handleGroups);
        socket.on("receivedMessage", handleReceivedMessage);

        return () => {
            socket.off("groups", handleGroups);
            socket.off("receivedMessage", handleReceivedMessage);
        };
    }, [selectedGroup]);

    const handleSelectGroup = async (group) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/read`, {
                groupId: group._id,
                userId: user.userId,
            });

            setUnreadMap((prev) => ({ ...prev, [group._id]: 0 }));
        } catch (e) {
            console.error(e);
        }

        navigate(`/chat/${group._id}`);
    };

    return (
        <div className="fullChat-container">
            <div className="fullChat-sidebar">
                <div className="fullChat-sidebar-header">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        스터디 그룹 채팅방
                        {notification > 0 ? (
                            <div className="notification">
                                <div className="notification-num">{notification}</div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="fullChat-list-area">
                    <ChatList
                        onSelectGroup={handleSelectGroup}
                        groups={groups}
                        user={user}
                        unreadMap={unreadMap}
                        lastMessageMap={lastMessageMap}
                    />
                </div>
            </div>

            <div className="fullChat-main">
                {selectedGroup ? (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <ChatHeader selectGroup={selectedGroup} />
                        <div style={{ width: "100%", height: "100%" }}>
                            <Chat selectGroup={selectedGroup} user={user} />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <ChatHeader />
                        <div className="fullChat-empty">
                            <p>채팅할 그룹을 선택해주세요.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FullChatPage;
