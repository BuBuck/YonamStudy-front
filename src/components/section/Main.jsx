import React from "react";
import ChatDock from "../chat/ChatDock";

function Main(props) {
    return (
        <main id="main" role="main">
            {props.children}
        </main>
    );
}

export default Main;
