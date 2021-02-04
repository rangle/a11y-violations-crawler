import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DIRECTORIES_API = 'http://localhost:3001/api/site-results';

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

const SiteListing = () => {
    const [directories, setDirectories] = useState([]);

    useEffect(() => {
        fetchDirectoriesFromAPI();
    }, []);

    const fetchDirectoriesFromAPI = () => {
        fetch(DIRECTORIES_API).then(res => res.json()).then(results => {
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
                    <ListItem key={directory.id} aria-label={`View results for ${directory.name}`}><Link className="text-blue-600" to={`./site-results/${directory.name}`}>{directory.name}</Link></ListItem>
                )}
            </SiteList>
        </ResultContainer>
    );
};

export default SiteListing;
