import React from "react";
import { Link } from "react-router-dom";

const NavbarClient = () => {
    return (
        <nav className="flex justify-between bg-gray-800 text-white p-4">
            <Link to="/" className="text-white">Home</Link>
            <Link to="/" className="text-white ml-4">Musics</Link>
            <Link to="/" className="text-white ml-4">Artists</Link>
        </nav>
    );
};

export default NavbarClient;
