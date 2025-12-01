import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../server";

import MessageContainer from "./MessageContainer";
import InputField from "./InputField";

function Chat({ selectGroup = {}, user }) {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");

    const [isReady, setIsReady] = useState(false);
    const messagesEndRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!selectGroup?._id) return;

        const fetchHistory = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${
                        selectGroup._id
                    }/messages`,
                    {
                        headers: {
                            userId: user.userId,
                        },
                    }
                );

                setMessageList(res.data);
            } catch (error) {
                if (error.status === 403) return navigate("/404NF");

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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
        window.requestAnimationFrame(() => {
            setIsReady(true);
        });
    }, [messageList]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (!selectGroup?._id) return;

        socket.emit("sendMessage", message, user.userId, selectGroup._id, (res) => {
            if (!res.ok) {
                console.log("Error Message", res.error);
            }
            setMessage("");
        });
    };

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
            {selectGroup._id ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            flex: 1,
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
                        <div style={{ flexShrink: 0 }}>
                            <InputField
                                message={message}
                                setMessage={setMessage}
                                sendMessage={sendMessage}
                            />
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default Chat;
