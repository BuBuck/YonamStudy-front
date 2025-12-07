import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../server";
import { onGroupCreated } from "../utils/groupSignal";
import { formatTime } from "../utils/timeUtils";

// 아이콘 및 스타일
import { GoPlus, GoScreenNormal } from "react-icons/go";
import "./FullChatPage.css";

function FullChatPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || user?._id;

    // [수정 1] user.group이 객체 배열인지 문자열 배열인지 모를 때 안전하게 ID 추출
    const myGroupIds = user?.group ? user.group.map((g) => g._id || g) : [];

    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [unreadMap, setUnreadMap] = useState({});
    const [lastMessageMap, setLastMessageMap] = useState({});
    const [currentMessages, setCurrentMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    const selectedGroup = groups.find((g) => g._id === groupId) || null;

    // -----------------------------------------------------------------------
    // 1. 초기 데이터 로드 & 소켓 그룹 관리
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!user) return;

        const handleGroups = (allGroups) => {
            setGroups(allGroups);
            if (myGroupIds.length > 0) {
                // 내 그룹 필터링
                const filtered = allGroups.filter((g) => myGroupIds.includes(g._id));
                setMyGroups(filtered);
            }
        };

        // 리스너 등록
        socket.on("groups", handleGroups);

        // 데이터 요청 및 룸 입장
        if (socket.connected) {
            socket.emit("groups");
            if (myGroupIds.length > 0) {
                socket.emit("joinGroups", myGroupIds);
            }
        }

        // REST API: 데이터 가져오기
        const fetchData = async () => {
            try {
                if (myGroupIds.length === 0) return;

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

                if (lastMsgRes.data) {
                    const rawData = lastMsgRes.data;
                    const processedData = {};
                    Object.keys(rawData).forEach((gid) => {
                        const msgObj = rawData[gid];
                        // sender 데이터 안전 처리
                        const senderId = msgObj.sender?._id || msgObj.sender;
                        const isMe = String(senderId) === String(userId);
                        processedData[gid] = { ...msgObj, isMe };
                    });
                    setLastMessageMap(processedData);
                }
            } catch (error) {
                console.error("초기 데이터 로드 실패:", error);
            }
        };

        fetchData();

        // 그룹 생성 시그널
        const removeListener = onGroupCreated((newGroup) => {
            setGroups((prev) => [...prev, newGroup]);
            socket.emit("joinGroup", newGroup._id);
            setUnreadMap((prev) => ({ ...prev, [newGroup._id]: 0 }));
            setLastMessageMap((prev) => ({
                ...prev,
                [newGroup._id]: {
                    message: "새로운 대화방이 생성되었습니다.",
                    time: new Date(),
                },
            }));
        });

        return () => {
            socket.off("groups", handleGroups);
            removeListener();
        };
    }, [userId]);

    // -----------------------------------------------------------------------
    // 2. 메시지 수신 (실시간)
    // -----------------------------------------------------------------------
    useEffect(() => {
        const handleReceivedMessage = (newMessage) => {
            const senderId = newMessage.sender?._id || newMessage.sender;
            const isMe = String(senderId) === String(userId);

            setLastMessageMap((prev) => ({
                ...prev,
                [newMessage.group]: {
                    message: newMessage.message,
                    time: newMessage.createdAt,
                    sender: newMessage.sender,
                    isMe: isMe,
                },
            }));

            if (groupId === newMessage.group) {
                setCurrentMessages((prev) => [...prev, { ...newMessage, isMine: isMe }]);
                scrollToBottom();
            } else {
                if (!isMe) {
                    setUnreadMap((prev) => ({
                        ...prev,
                        [newMessage.group]: (prev[newMessage.group] || 0) + 1,
                    }));
                }
            }
        };

        socket.on("receivedMessage", handleReceivedMessage);
        return () => socket.off("receivedMessage", handleReceivedMessage);
    }, [groupId, userId]);

    // -----------------------------------------------------------------------
    // 3. 채팅방 진입 시 데이터 로드
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!groupId) return;

        const loadMessages = async () => {
            try {
                // 읽음 처리 (에러 무시)
                await axios
                    .put(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/read`, {
                        groupId: groupId,
                        userId: userId,
                    })
                    .catch(() => {});

                setUnreadMap((prev) => ({ ...prev, [groupId]: 0 }));

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/messages`,
                    { headers: { userid: userId } }
                );

                const formattedMessages = res.data.map((msg) => {
                    const senderId = msg.sender?._id || msg.sender;
                    return {
                        ...msg,
                        isMine: String(senderId) === String(userId),
                    };
                });

                setCurrentMessages(formattedMessages);
                scrollToBottom();
            } catch (error) {
                console.error("메시지 로드 실패:", error);
                if (error.response && error.response.status === 403) {
                    alert("해당 스터디 그룹의 멤버가 아닙니다.");
                    navigate("/", { replace: true });
                }
            }
        };

        loadMessages();
    }, [groupId, userId, navigate]);

    // -----------------------------------------------------------------------
    // 4. 이벤트 핸들러 및 유틸
    // -----------------------------------------------------------------------

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    };

    const handleSelectGroup = (id) => navigate(`/chat/${id}`, { replace: true });

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

    return (
        <div className="chat-page">
            <div className="chat-container">
                <aside className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h2>스터디 그룹 채팅방</h2>
                    </div>
                    <div className="chat-list">
                        {myGroups.map((group) => {
                            const lastMsgData = lastMessageMap[group._id];
                            const unreadCount = unreadMap[group._id] || 0;
                            const isActive = group._id === groupId;
                            const imgUrl = group.groupImage
                                ? `${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`
                                : "";

                            return (
                                <button
                                    key={group._id}
                                    className={`chat-item ${isActive ? "active" : ""}`}
                                    onClick={() => handleSelectGroup(group._id)}
                                >
                                    <img src={imgUrl} alt="그룹 이미지" className="chat-avatar" />
                                    <div className="chat-info">
                                        <div className="chat-header">
                                            <span className="chat-name">
                                                {group.group || "이름 없음"}
                                            </span>
                                            <span className="chat-time">
                                                {lastMsgData ? formatTime(lastMsgData.time) : ""}
                                            </span>
                                        </div>
                                        <div className="chat-preview">
                                            {lastMsgData ? (
                                                <>
                                                    {lastMsgData.isMe && "나: "}
                                                    {lastMsgData.message}
                                                </>
                                            ) : (
                                                "대화 내용 없음"
                                            )}
                                            {unreadCount > 0 && (
                                                <span className="chat-unread">{unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="chat-main">
                    {selectedGroup ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-info">
                                    <img
                                        className="chat-avatar-large"
                                        src={`${import.meta.env.VITE_BACKEND_URL}${
                                            selectedGroup.groupImage
                                        }`}
                                    />
                                    <div>
                                        <h3>{selectedGroup.group}</h3>
                                        <p>멤버 {selectedGroup.groupMembers?.length + 1 || 1}명</p>
                                    </div>
                                </div>
                                <div className="chat-header-actions">
                                    <button className="icon-button" onClick={() => navigate(-1)}>
                                        <GoScreenNormal size={20} stroke="currentColor" />
                                    </button>
                                </div>
                            </div>

                            <div className="messages-container">
                                <div className="messages-list">
                                    {currentMessages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`message ${
                                                msg.isMine ? "message-mine" : "message-other"
                                            }`}
                                        >
                                            {!msg.isMine && (
                                                <div className="message-avatar">
                                                    {msg.sender?.name
                                                        ? msg.sender.name.charAt(0)
                                                        : "?"}
                                                </div>
                                            )}
                                            <div className="message-content">
                                                {!msg.isMine && (
                                                    <div className="message-sender">
                                                        {msg.sender?.name}
                                                    </div>
                                                )}
                                                <div className="message-bubble">
                                                    <p>{msg.message}</p>
                                                </div>
                                                <div className="message-time">
                                                    {chatFormatTime(msg.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <form className="chat-input-container" onSubmit={handleSendMessage}>
                                <button type="button" className="icon-button">
                                    <GoPlus size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                    className="chat-input"
                                />
                                <button type="submit" className="send-button">
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
                        </>
                    ) : (
                        <>
                            <div className="header-container">
                                <div className="chat-header-info">
                                    <button className="icon-button" onClick={() => navigate(-1)}>
                                        <GoScreenNormal size={20} stroke="currentColor" />
                                    </button>
                                </div>
                            </div>
                            <div className="no-chat-selected">
                                <p>채팅방을 선택해주세요.</p>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
export default FullChatPage;
