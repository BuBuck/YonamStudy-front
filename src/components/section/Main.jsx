import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Main(props) {
    return (
        <>
            <Header />
            <main id="main" role="main">
                {props.children}
            </main>
            <Footer />
        </>
    );
}

export default Main;
