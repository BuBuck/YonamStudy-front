import React from "react";

function Main(props) {
    return (
        <>
            <main id="main" role="main" style={{ width: "vw", height: "vh" }}>
                {props.children}
            </main>
        </>
    );
}

export default Main;
