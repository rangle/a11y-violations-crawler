import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GET_DIRECTORIES_API = 'http://localhost:3001/api/site-results';

const ResultContainer = styled.div`
    padding: 50px 15px;
`;

const H2 = styled.h2`
    font-size: 1.5rem;
    line-height: 2rem;
`;

const SiteList = styled.ul`
    margin-top: 0.75rem;
`;

const ListItem = styled.li`
    line-height: 1.5rem;
`;

const BlueLink = styled(Link)`
    color: rgba(37,99,235,1);
`;

const SiteListing = () => {
    const [directories, setDirectories] = useState([]);

    useEffect(() => {
        fetchDirectoriesFromAPI();
    }, []);

    const fetchDirectoriesFromAPI = () => {
        fetch(GET_DIRECTORIES_API).then(res => res.json()).then(results => {
            setDirectories(results.directories);
        }).catch(err => {
            console.log('error on fetch: ', err);
        });
    };

    return (
        <ResultContainer>
            <H2>Available Scan Results</H2>
            <SiteList>
                {directories.map(directory =>
                    <ListItem key={directory.id} aria-label={`View results for ${directory.name}`}><BlueLink to={`./site-results/${directory.name}`}>{directory.name}</BlueLink></ListItem>
                )}
            </SiteList>
        </ResultContainer>
    );
};

export default SiteListing;
