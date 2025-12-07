import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import socket from "../../server";
import { onGroupCreated } from "../../utils/groupSignal";
import { formatTime } from "../../utils/timeUtils";

import { GoScreenFull, GoChevronLeft, GoX, GoPlus } from "react-icons/go";
import { IoPaperPlaneOutline } from "react-icons/io5";

import "./ChatDock.css";

function ChatDock() {
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef(null);

    // 채팅 페이지에서는 ChatDock 숨김
    const isChatPage = location.pathname.startsWith("/chat");

    // 로컬 스토리지 유저 정보
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || user?._id;

    // --- State ---
    const [isOpen, setIsOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [unreadMap, setUnreadMap] = useState({});
    const [lastMessageMap, setLastMessageMap] = useState({});
    const [totalUnread, setTotalUnread] = useState(0);

    const [currentMessages, setCurrentMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    // -----------------------------------------------------------------------
    // 1. 초기 데이터 로드 & 소켓 입장
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!user || !user.group) return;

        // 소켓 Room 입장
        const myGroupIds = user.group.map((g) => g._id);
        if (myGroupIds.length > 0 && socket.connected) {
            socket.emit("joinGroups", myGroupIds, (res) => {
                if (res && res.ok) console.log("Socket: 내 스터디 그룹 채팅방 입장 완료");
            });
        }

        // 전체 그룹 리스트 요청
        if (socket.connected) {
            socket.emit("groups");
        }

        // 안 읽은 메시지 & 마지막 메시지 가져오기
        const fetchData = async () => {
            try {
                const groupIdsStr = myGroupIds.join(",");

                const [notiRes, lastMsgRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/notification`, {
                        params: { userId: userId, group: groupIdsStr },
                    }),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/lastMessages`, {
                        params: { userId: userId, group: groupIdsStr },
                    }),
                ]);

                if (notiRes.data.groupCounts) {
                    setUnreadMap(notiRes.data.groupCounts);
                }
                if (notiRes.data.total) {
                    setTotalUnread(notiRes.data.total);
                }
                if (lastMsgRes.data) {
                    setLastMessageMap(lastMsgRes.data);
                }
            } catch (error) {
                console.warn("⚠️ 초기 데이터 로드 실패 (백엔드 연결 필요):", error.message);
            }
        };

        fetchData();

        // 그룹 생성 이벤트
        const removeListener = onGroupCreated((newGroup) => {
            setGroups((prev) => [...prev, newGroup]);
            if (socket.connected) {
                socket.emit("joinGroup", newGroup._id);
            }
            setUnreadMap((prev) => ({ ...prev, [newGroup._id]: 0 }));
            setLastMessageMap((prev) => ({
                ...prev,
                [newGroup._id]: { message: "새로운 대화방이 생성되었습니다.", time: new Date() },
            }));
        });

        return () => removeListener();
    }, [userId]);

    // -----------------------------------------------------------------------
    // 2. 소켓 이벤트 리스너
    // -----------------------------------------------------------------------
    useEffect(() => {
        const handleGroups = (allGroups) => {
            setGroups(allGroups);

            if (user && user.group) {
                const myGroupIds = user.group.map((g) => g._id);
                const filtered = allGroups.filter((g) => myGroupIds.includes(g._id));
                setMyGroups(filtered);
            }
        };

        const handleReceivedMessage = (newMessage) => {
            // 마지막 메시지 갱신
            setLastMessageMap((prev) => ({
                ...prev,
                [newMessage.group]: {
                    message: newMessage.message,
                    time: newMessage.createdAt,
                },
            }));

            // 현재 보고 있는 방이면 메시지 추가
            if (selectedGroup && selectedGroup._id === newMessage.group) {
                setCurrentMessages((prev) => [
                    ...prev,
                    {
                        ...newMessage,
                        isMe: String(newMessage.sender._id) === String(userId),
                    },
                ]);
                scrollToBottom();
            }
            // 다른 방이면 안 읽은 배지 증가
            else {
                if (String(newMessage.sender._id) !== String(userId)) {
                    setUnreadMap((prev) => ({
                        ...prev,
                        [newMessage.group]: (prev[newMessage.group] || 0) + 1,
                    }));
                    setTotalUnread((prev) => prev + 1);
                }
            }
        };

        socket.on("groups", handleGroups);
        socket.on("receivedMessage", handleReceivedMessage);

        return () => {
            socket.off("groups", handleGroups);
            socket.off("receivedMessage", handleReceivedMessage);
        };
    }, [selectedGroup, userId]);

    // -----------------------------------------------------------------------
    // 3. ESC 키로 닫기
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.keyCode === 27) {
                setIsOpen(false);
                setSelectedGroup(null);
            }
        };
        window.addEventListener("keydown", handleEsc);

        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    // -----------------------------------------------------------------------
    // 4. 그룹 선택 시 메시지 로드
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!selectedGroup) return;

        const loadMessages = async () => {
            try {
                // 읽음 처리
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/read`, {
                    groupId: selectedGroup._id,
                    userId: userId,
                });

                const readCount = unreadMap[selectedGroup._id] || 0;
                setTotalUnread((prev) => Math.max(0, prev - readCount));
                setUnreadMap((prev) => ({ ...prev, [selectedGroup._id]: 0 }));

                // 메시지 목록 조회
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${
                        selectedGroup._id
                    }/messages`,
                    {
                        headers: {
                            userid: userId,
                        },
                    }
                );

                const formattedMessages = res.data.map((msg) => ({
                    ...msg,
                    isMe: String(msg.sender._id) === String(userId),
                }));

                setCurrentMessages(formattedMessages);
                scrollToBottom();
            } catch (error) {
                console.error("메시지 로드 실패:", error);
            }
        };

        loadMessages();
    }, [selectedGroup]);

    // -----------------------------------------------------------------------
    // 5. 이벤트 핸들러
    // -----------------------------------------------------------------------
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    };

    const handleToggleDock = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setSelectedGroup(null);
        }
    };

    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
    };

    const handleBackToList = () => {
        setSelectedGroup(null);
    };

    const handleExpandView = () => {
        if (selectedGroup) {
            navigate(`/chat/${selectedGroup._id}`);
        } else {
            navigate("/chat");
        }
        setIsOpen(false);
        setSelectedGroup(null);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedGroup) return;

        socket.emit("sendMessage", inputMessage, userId, selectedGroup._id);
        setInputMessage("");
    };

    const chatFormatTime = (timeString) => {
        if (!timeString) return "";
        const date = new Date(timeString);
        return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    };

    // 채팅 페이지에서는 표시하지 않음
    if (isChatPage) return null;

    // -----------------------------------------------------------------------
    // 6. 렌더링
    // -----------------------------------------------------------------------

    // 닫힌 상태
    if (!isOpen) {
        return (
            <div className="chat-dock-closed" onClick={handleToggleDock}>
                <div className="chat-dock-closed-content">
                    <IoPaperPlaneOutline size={24} />
                    <span>스터디 그룹 채팅</span>
                </div>
                {totalUnread > 0 && <div className="chat-dock-badge">{totalUnread}</div>}
            </div>
        );
    }

    // 열린 상태
    return (
        <div className="chat-dock-opened">
            {/* Header */}
            <div className="chat-dock-header">
                <div className="chat-dock-header-left">
                    {selectedGroup && (
                        <button className="chat-dock-icon-btn" onClick={handleBackToList}>
                            <GoChevronLeft size={20} />
                        </button>
                    )}
                    <h3 className="chat-dock-title">
                        {selectedGroup ? selectedGroup.group : "스터디 그룹 채팅"}
                    </h3>
                    {!selectedGroup && totalUnread > 0 && (
                        <div className="chat-dock-header-badge">{totalUnread}</div>
                    )}
                </div>
                <div className="chat-dock-header-right">
                    <button className="chat-dock-icon-btn" onClick={handleExpandView}>
                        <GoScreenFull size={20} />
                    </button>
                    <button className="chat-dock-icon-btn" onClick={handleToggleDock}>
                        <GoX size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="chat-dock-content">
                {!selectedGroup ? (
                    // 채팅 목록
                    <div className="chat-dock-list">
                        {myGroups.map((group) => {
                            const lastMsgData = lastMessageMap[group._id] || {};
                            const unreadCount = unreadMap[group._id] || 0;

                            const imgUrl = group.groupImage
                                ? `${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`
                                : "";

                            return (
                                <button
                                    key={group._id}
                                    className="chat-dock-item"
                                    onClick={() => handleSelectGroup(group)}
                                >
                                    <img
                                        src={imgUrl}
                                        alt="그룹 이미지"
                                        className="chat-dock-avatar"
                                    />

                                    <div className="chat-dock-info">
                                        <div className="chat-dock-item-header">
                                            <span className="chat-dock-name">
                                                {group.group || "이름 없음"}
                                            </span>
                                            <span className="chat-dock-time">
                                                {lastMsgData ? formatTime(lastMsgData.time) : ""}
                                            </span>
                                        </div>
                                        <div className="chat-dock-preview">
                                            <span className="chat-dock-last-message">
                                                {lastMsgData.message || "대화 내용 없음"}
                                            </span>
                                            {unreadCount > 0 && (
                                                <span className="chat-dock-unread">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    // 채팅방
                    <div className="chat-dock-room">
                        <div className="chat-dock-messages">
                            <div className="chat-dock-messages-list">
                                {currentMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`chat-dock-message ${
                                            msg.isMe
                                                ? "chat-dock-message-mine"
                                                : "chat-dock-message-other"
                                        }`}
                                    >
                                        {!msg.isMe && (
                                            <div className="chat-dock-message-avatar">
                                                {msg.sender?.name ? msg.sender.name.charAt(0) : "?"}
                                            </div>
                                        )}
                                        <div className="chat-dock-message-content">
                                            {!msg.isMe && (
                                                <div className="chat-dock-message-sender">
                                                    {msg.sender?.name || "알 수 없음"}
                                                </div>
                                            )}
                                            <div className="chat-dock-message-bubble">
                                                <p>{msg.message}</p>
                                            </div>
                                            <div className="chat-dock-message-time">
                                                {chatFormatTime(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <form className="chat-dock-input-container" onSubmit={handleSendMessage}>
                            <button type="button" className="chat-dock-add-btn">
                                <GoPlus size={20} />
                            </button>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="chat-dock-input"
                            />
                            <button type="submit" className="chat-dock-send-btn">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatDock;
