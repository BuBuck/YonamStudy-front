import React from "react";

import "../../styles/chat/MessageContainer.css";

const MessageContainer = ({ messageList, user }) => {
    return (
        <div>
            {messageList.map((message, index) => {
                return (
                    <div key={message._id} className="message-container">
                        {message.sender.name === "server" ? (
                            <div className="server-message-container">
                                <p className="server-message">{message.message}</p>
                            </div>
                        ) : message.sender.name === user.name ? (
                            <div className="my-message-container">
                                <div
                                    className="my-message"
                                    style={{
                                        borderBottomRightRadius: "4px",
                                    }}
                                >
                                    <div>{message.message}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="your-message-container">
                                <div className="profile-image">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${
                                            message.sender.userProfile
                                        }`}
                                        style={
                                            (index === 0
                                                ? { visibility: "visible" }
                                                : messageList[index - 1].sender.name ===
                                                  user.name) ||
                                            messageList[index - 1].sender.name === "server"
                                                ? { visibility: "visible" }
                                                : { visibility: "hidden" }
                                        }
                                    />
                                </div>
                                <div
                                    className="your-message"
                                    style={{ borderBottomLeftRadius: "4px" }}
                                >
                                    <div>{message.message}</div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MessageContainer;
