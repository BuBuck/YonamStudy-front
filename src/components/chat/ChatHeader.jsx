import React from "react";
import { useNavigate } from "react-router-dom";

import { GoChevronLeft } from "react-icons/go";
import { GoScreenFull } from "react-icons/go";
import { GoX } from "react-icons/go";

import "../../style/chat/chatHeader.css";
import "../../style/chat/chatDock.css";

function ChatHeader({ onDockClick, onSelectGroup, selectGroup, groups, notification }) {
    const navigate = useNavigate();

    const moveToChat = () => {
        navigate("/chat");
    };

    return (
        <div className="chatDock_Header">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {selectGroup && (
                    <div
                        className="icon"
                        role="button"
                        onClick={() => {
                            onSelectGroup(null);
                        }}
                    >
                        <GoChevronLeft
                            size={20}
                            style={{ padding: "8px 8px 8px 0px", cursor: "pointer" }}
                        />
                    </div>
                )}
                <h3
                    style={{
                        fontSize: "14px",
                        width: "auto",
                        height: "14px",
                        margin: "0px",
                    }}
                >
                    {selectGroup ? groups.group : "스터디 그룹 채팅방"}
                </h3>
                {!selectGroup &&
                    (notification > 0 ? (
                        <div className="notification">
                            <div className="notification-num">{notification}</div>
                        </div>
                    ) : null)}
            </div>
            <div className="chatDock_button">
                <div
                    className="icon"
                    role="button"
                    onClick={() => {
                        moveToChat();
                        onDockClick();
                    }}
                >
                    <GoScreenFull size={20} style={{ padding: "8px", cursor: "pointer" }} />
                </div>
                <div
                    className="icon"
                    role="button"
                    onClick={() => {
                        onSelectGroup(null);
                        onDockClick();
                    }}
                >
                    <GoX size={20} style={{ padding: "8px", cursor: "pointer" }} />
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
