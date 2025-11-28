import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../server";

import MessageContainer from "../components/chat/MessageContainer";
import InputField from "../components/chat/InputField";

function ChatPage({ selectGroup, user }) {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");

    const [isReady, setIsReady] = useState(false);
    const messagesEndRef = useRef(null);

    // const { groupId } = useParams();

    useEffect(() => {
        if (!selectGroup._id) return;

        const fetchHistory = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/chat/messages/${selectGroup._id}`
                );
                setMessageList(res.data);
            } catch (error) {
                console.error("채팅 내역 로드 실패", error);
            }
        };

        fetchHistory();

        socket.on("receivedMessage", (res) => {
            setMessageList((prevState) => [...prevState, res]);
        });

        socket.emit("joinGroup", selectGroup._id, (res) => {
            if (res && res.ok) {
                console.log("입장 성공", res);
            } else {
                console.log("입장 실패", res);
            }
        });

        setIsReady(false);

        return () => socket.off("receivedMessage");
    }, [selectGroup._id]);

    useLayoutEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        window.requestAnimationFrame(() => {
            setIsReady(true);
        });
    }, [messageList]);

    const sendMessage = (event) => {
        event.preventDefault();
        socket.emit("sendMessage", message, user.userId, selectGroup._id, (res) => {
            if (!res.ok) {
                console.log("Error Message", res.error);
            }
            setMessage("");
        });
    };

    return (
        <div>
            {selectGroup._id ? (
                <div>
                    <div
                        style={{
                            height: "386px",
                            overflowY: "auto",
                            opacity: isReady ? 1 : 0,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {messageList.length > 0 && (
                            <MessageContainer messageList={messageList} user={user} />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {isReady && (
                        <InputField
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                        />
                    )}
                </div>
            ) : (
                <div>디폴트 채팅 화면임</div>
            )}
        </div>
    );
}

export default ChatPage;
