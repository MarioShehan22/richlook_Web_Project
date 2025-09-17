import React from "react";
import EnhancedNavbar from "../components/EnhancedNavbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
    return (
        <>
            <Navbar/>
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
