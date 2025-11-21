import React from "react";

function Main(props) {
    return (
        <>
            <main id="main" role="main">
                {props.children}
            </main>
        </>
    );
}

export default Main;
