import React from "react";

import "../../style/chat/InputField.css";

const InputField = ({ message, setMessage, sendMessage }) => {
    return (
        <div
            style={{
                width: "360px",
                height: "78px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="input-area">
                <div className="input-container">
                    <form onSubmit={sendMessage}>
                        <input
                            placeholder="Type in here…"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            multiline={"true"}
                            rows={1}
                        />

                        <button disabled={message === ""} type="submit" className="send-button">
                            전송
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InputField;
