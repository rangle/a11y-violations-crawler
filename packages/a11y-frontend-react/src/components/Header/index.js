import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header`
    background-color: lightgrey;
    display: flex;
`;

const Nav = styled.nav`
    display: flex;
`

const H1 = styled.h1`
    font-size: 2rem;
    margin: 1rem;
`;

const List = styled.ul`
    display: flex;
`;

const ListItem = styled.li`
    display: flex;
    align-items: stretch;
`;

const NavLink = styled(Link)`
    padding: 5px 10px;
    display: flex;
    align-items: center;


  &:hover {
    background-color: skyblue;
    text-decoration: underline;
  }
`;

const Header = () => {
    return (
        <StyledHeader>
            <H1>A11Y POC</H1>
            <Nav>
                <List>
                    <ListItem><NavLink to="/">View Site Listing</NavLink></ListItem>
                    <ListItem><NavLink to="/launcher">Start a New Scan</NavLink></ListItem>
                </List>
            </Nav>
        </StyledHeader>
    )
}

export default Header;
