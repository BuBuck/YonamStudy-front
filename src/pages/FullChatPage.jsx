import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../server"; // socket 인스턴스 경로
import { onGroupCreated } from "../utils/groupSignal"; // 그룹 생성 시그널 유틸 경로
import { formatTime } from "../utils/timeUtils";

// 아이콘 및 스타일
import { GoPlus } from "react-icons/go";
import { GoScreenNormal } from "react-icons/go";
import "./FullChatPage.css"; // 앞서 제공된 CSS 파일

function FullChatPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // 로컬 스토리지 유저 정보 파싱
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || user?._id; // 백엔드와 통일된 ID 사용

    // --- State ---
    const [groups, setGroups] = useState([]); // 전체 그룹 목록 (Socket에서 수신)
    const [myGroups, setMyGroups] = useState([]); // 내가 속한 그룹 (필터링됨)
    const [unreadMap, setUnreadMap] = useState({}); // { groupId: count }
    const [lastMessageMap, setLastMessageMap] = useState({}); // { groupId: { message, time } }

    const [currentMessages, setCurrentMessages] = useState([]); // 현재 선택된 방의 메시지들
    const [inputMessage, setInputMessage] = useState(""); // 입력창 상태

    // 현재 선택된 그룹 객체 찾기
    const selectedGroup = groups.find((g) => g._id === groupId) || null;

    // -----------------------------------------------------------------------
    // 1. 초기 데이터 로드 & 소켓 그룹 관리 (통합됨)
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!user) return;

        // [수정 1] 리스너 함수 정의 (그룹 목록 처리)
        const handleGroups = (allGroups) => {
            setGroups(allGroups);
            if (user.group) {
                const myGroupIds = user.group.map((g) => g._id);
                const filtered = allGroups.filter((g) => myGroupIds.includes(g._id));
                setMyGroups(filtered);
            }
        };

        // [수정 2] 리스너 먼저 등록!
        socket.on("groups", handleGroups);

        // [수정 3] 리스너 등록 후 데이터 요청 (순서 중요)
        socket.emit("groups");

        // 1-1. 소켓 Room 입장
        const myGroupIds = user.group.map((g) => g._id);
        if (myGroupIds.length > 0) {
            socket.emit("joinGroups", myGroupIds);
        }

        // 1-2. REST API: 안 읽은 메시지 & 마지막 메시지 가져오기
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

                // 지난번 수정했던 isMe 로직 포함
                if (lastMsgRes.data) {
                    const rawData = lastMsgRes.data;
                    const processedData = {};
                    Object.keys(rawData).forEach((gid) => {
                        const msgObj = rawData[gid];
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

        // 1-3. 그룹 생성 시그널
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

        // clean-up
        return () => {
            socket.off("groups", handleGroups); // 리스너 해제
            removeListener();
        };
    }, [userId]); // 의존성: userId만 있으면 됨

    // -----------------------------------------------------------------------
    // 2. 메시지 수신 전용 useEffect (그룹 목록 로직 제거됨)
    // -----------------------------------------------------------------------
    useEffect(() => {
        // [수정 4] 여기서는 메시지 수신만 담당 (그룹 목록 수신 로직은 위로 이동했으므로 삭제)

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
                scrollToBottom(); // 인자 없이 호출해도 되도록 수정하거나 기존 함수 유지
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

        return () => {
            socket.off("receivedMessage", handleReceivedMessage);
        };
    }, [groupId, userId]);

    // -----------------------------------------------------------------------
    // 4. 이벤트 핸들러 및 유틸
    // -----------------------------------------------------------------------

    // 스크롤 하단 이동
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    };

    // 그룹 선택 이동
    const handleSelectGroup = (id) => {
        navigate(`/chat/${id}`, { replace: true });
    };

    // 메시지 전송
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedGroup) return;

        // 백엔드: socket.on("sendMessage", async (receivedMessage, userId, groupId) => ...)
        // 인자 순서: (메시지내용, 유저ID, 그룹ID)
        socket.emit("sendMessage", inputMessage, userId, selectedGroup._id);

        setInputMessage("");
    };

    // 시간 포맷팅
    const chatFormatTime = (timeString) => {
        if (!timeString) return "";
        const date = new Date(timeString);
        return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    };

    // -----------------------------------------------------------------------
    // 5. 렌더링
    // -----------------------------------------------------------------------
    return (
        <div className="chat-page">
            <div className="chat-container">
                {/* === 왼쪽 사이드바 (채팅 목록) === */}
                <aside className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h2>스터디 그룹 채팅방</h2>
                    </div>
                    <div className="chat-list">
                        {/* 내가 속한 그룹만 렌더링 */}
                        {myGroups.map((group) => {
                            const lastMsgData = lastMessageMap[group._id];
                            const unreadCount = unreadMap[group._id] || 0;
                            const isActive = group._id === groupId;

                            // 이미지 경로 처리
                            const imgUrl = group.groupImage
                                ? `${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`
                                : ""; // 기본 이미지 처리 필요시 추가

                            return (
                                <button
                                    key={group._id}
                                    className={`chat-item ${isActive ? "active" : ""}`}
                                    onClick={() => handleSelectGroup(group._id)}
                                >
                                    <img src={imgUrl} alt="그룹 이미지" className="chat-avatar" />

                                    <div className="chat-info">
                                        <div className="chat-header">
                                            {/* group.group이 이름 필드라고 가정 */}
                                            <span className="chat-name">
                                                {group.group || "이름 없음"}
                                            </span>
                                            <span className="chat-time">
                                                {lastMsgData ? formatTime(lastMsgData.time) : ""}
                                            </span>
                                        </div>
                                        <div className="chat-preview">
                                            {lastMsgData
                                                ? `${lastMsgData.isMe ? "나: " : ""}${
                                                      lastMsgData.message
                                                  }`
                                                : "대화 내용 없음"}
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

                {/* === 오른쪽 메인 (채팅 내용) === */}
                <main className="chat-main">
                    {selectedGroup ? (
                        <>
                            {/* 채팅방 헤더 */}
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
                                        <p>
                                            멤버{" "}
                                            {selectedGroup.groupMembers
                                                ? selectedGroup.groupMembers.length + 1
                                                : 1}
                                            명
                                        </p>
                                    </div>
                                </div>
                                <div className="chat-header-actions">
                                    <button
                                        className="icon-button"
                                        title="최소화"
                                        onClick={() => navigate(-1)}
                                    >
                                        <GoScreenNormal size={20} stroke="currentColor" />
                                    </button>
                                </div>
                            </div>

                            {/* 메시지 리스트 */}
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
                                                    {/* sender가 populate 되어 name이 있다고 가정 */}
                                                    {msg.sender?.name
                                                        ? msg.sender.name.charAt(0)
                                                        : "?"}
                                                </div>
                                            )}
                                            <div className="message-content">
                                                {!msg.isMine && (
                                                    <div className="message-sender">
                                                        {msg.sender?.name || "알 수 없음"}
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

                            {/* 메시지 입력창 */}
                            <form className="chat-input-container" onSubmit={handleSendMessage}>
                                <button type="button" className="icon-button">
                                    <GoPlus size={20} stroke="currentColor" />
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
                            <div className="chat-header">
                                <button>
                                    <button
                                        className="icon-button"
                                        title="최소화"
                                        onClick={() => navigate(-1)}
                                    >
                                        <GoScreenNormal size={20} stroke="currentColor" />
                                    </button>
                                </button>
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
