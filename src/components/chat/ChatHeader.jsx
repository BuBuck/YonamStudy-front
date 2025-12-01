import React from "react";
import { useNavigate } from "react-router-dom";

import { GoScreenNormal } from "react-icons/go";

import "../../style/chat/ChatHeader.css";

function ChatHeader({ selectGroup }) {
    const navigate = useNavigate();

    const leaveChat = () => {
        navigate(-1, { replace: true });
    };

    return (
        <div>
            {selectGroup ? (
                <div className="chat-header">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <img
                            className="study-group-img"
                            src={`${import.meta.env.VITE_BACKEND_URL}${selectGroup.groupImage}`}
                        />
                        <div className="study-group-name">{selectGroup.group}</div>
                    </div>

                    <div
                        className="icon"
                        role="button"
                        onClick={() => {
                            leaveChat();
                        }}
                    >
                        <GoScreenNormal size={20} style={{ padding: "8px", cursor: "pointer" }} />
                    </div>
                </div>
            ) : (
                <div className="chat-header">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div className="study-group-img" style={{ visibility: "false" }} />
                    </div>

                    <div
                        className="icon"
                        role="button"
                        onClick={() => {
                            leaveChat();
                        }}
                    >
                        <GoScreenNormal size={20} style={{ padding: "8px", cursor: "pointer" }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatHeader;
