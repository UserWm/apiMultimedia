import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Alink = styled(Link)`
    color: black;
    text-decoration: none;
`;

const NavbarAdmin = () => {
    return (
        <nav>
            <Alink to="/dashboard">Dashboard</Alink>
            <Alink to="/manage-musics">Manage Musics</Alink>
            <Alink to="/manage-artists">Manage Artists</Alink>
        </nav>
    );
};

export default NavbarAdmin;
