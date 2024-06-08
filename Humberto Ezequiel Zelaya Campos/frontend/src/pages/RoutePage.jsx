import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import HomeClient from "./HomeClient";

const RoutePage = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/" element={<HomeClient />} />
            </Routes>
        </Router>
    );
};

export default RoutePage;
