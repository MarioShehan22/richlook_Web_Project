import React from "react";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ChatWidget from "../components/ChatWidget.jsx";

const Layout = () => {
    return (
        <>
            <Navbar/>
            <main>
                <Outlet />
            </main>
            <ChatWidget />
            <Footer />
        </>
    );
};

export default Layout;
