import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import socket from "../../server";

import ChatHeader from "./ChatHeader";
import ChatList from "./ChatList";
import ChatPage from "../../pages/ChatPage";

import { IoPaperPlaneOutline } from "react-icons/io5";

import "../../style/chat/ChatDock.css";

function ChatDock() {
    const [isOpen, setIsOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectGroup, setSelectGroup] = useState(null);

    const [notification, setNotification] = useState(0);
    const [unreadMap, setUnreadMap] = useState({});
    const [lastMessageMap, setLastMessageMap] = useState({});

    const location = useLocation();
    const currentPath = location.pathname;

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user && user.group && user.group.length > 0) {
            socket.emit("joinGroups", user.group, (res) => {
                if (res.ok) {
                    console.log("모든 그룹 소켓 입장 완료");
                }
            });
        }

        socket.emit("groups");
        socket.on("groups", (res) => {
            setGroups(res);
        });

        const fetchNotification = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/notification`,
                    {
                        params: {
                            userId: user.userId,
                            group: user.group.join(","),
                        },
                    }
                );
                setNotification(data.total);

                if (data.groupCounts) {
                    setUnreadMap(data.groupCounts);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotification();

        const fetchLastMessages = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/lastMessages`,
                    {
                        params: {
                            userId: user.userId || user._id,
                            group: user.group.join(","),
                        },
                    }
                );
                setLastMessageMap(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLastMessages();

        return () => {
            socket.off("groups");
        };
    }, []);

    useEffect(() => {
        const handleReceivedMessage = (newMessage) => {
            setLastMessageMap((prev) => ({
                ...prev,
                [newMessage.group]: {
                    message: newMessage.message,
                    time: newMessage.createdAt || new Date().toISOString(),
                },
            }));

            if (newMessage.sender._id === user._id) return;

            if (selectGroup && selectGroup._id === newMessage.group) return;

            setNotification((prevState) => prevState + 1);

            setUnreadMap((prevState) => ({
                ...prevState,
                [newMessage.group]: (prevState[newMessage.group] || 0) + 1,
            }));
        };

        socket.on("receivedMessage", handleReceivedMessage);

        return () => socket.off("receivedMessage", handleReceivedMessage);
    }, [selectGroup]);

    useEffect(() => {
        if (!isOpen) return;

        const escKeyModalClose = (e) => {
            if (e.keyCode === 27) {
                setIsOpen(false);
                setSelectGroup(null);
            }
        };
        window.addEventListener("keydown", escKeyModalClose);

        return () => window.removeEventListener("keydown", escKeyModalClose);
    }, [isOpen]);

    const openDock = () => {
        setIsOpen(!isOpen);
    };

    if (currentPath === "/chat") {
        return null;
    }

    const handleEnterGroup = async (group) => {
        setSelectGroup(group);

        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/read`, {
                groupId: group._id,
                userId: user.userId,
            });

            const readCount = unreadMap[group._id] || 0;

            setNotification((prevState) => Math.max(0, prevState - readCount));

            setUnreadMap((prevState) => ({
                ...prevState,
                [group._id]: 0,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    if (isOpen) {
        return (
            <div className="chatDockOpened" role="button" tabIndex="0">
                <ChatHeader
                    onDockClick={openDock}
                    onSelectGroup={(back) => {
                        setSelectGroup(back);
                    }}
                    selectGroup={selectGroup}
                    groups={selectGroup}
                    notification={notification}
                />
                <hr
                    style={{
                        border: "none",
                        height: "1px",
                        margin: "0px",
                        backgroundColor: "#303030",
                    }}
                />
                {!selectGroup && (
                    <ChatList
                        onSelectGroup={handleEnterGroup}
                        groups={groups}
                        user={user}
                        unreadMap={unreadMap}
                        lastMessageMap={lastMessageMap}
                    />
                )}
                {selectGroup && <ChatPage selectGroup={selectGroup} user={user} />}
            </div>
        );
    }

    return (
        <div className="chatDockClosed" role="button" tabIndex="0" onClick={openDock}>
            <div className="title">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <IoPaperPlaneOutline size={24} />
                    <div
                        style={{
                            margin: "0px 8px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        스터디 그룹 채팅
                    </div>
                </div>
                {notification > 0 ? (
                    <div className="notification">
                        <div className="notification-num">{notification}</div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default ChatDock;
