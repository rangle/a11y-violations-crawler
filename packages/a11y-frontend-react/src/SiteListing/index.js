import React, { useState, useEffect } from 'react';
import { SITE_RESULTS_API } from '../constants';
import {
  H2,
  ListItem,
  SiteList,
  ResultContainer,
  BlueLink,
} from '../styles/common';

const SiteListing = () => {
  const [directories, setDirectories] = useState([]);

  useEffect(() => {
    fetchDirectoriesFromAPI();
  }, []);

  const fetchDirectoriesFromAPI = () => {
    fetch(SITE_RESULTS_API)
      .then((res) => res.json())
      .then((results) => {
        setDirectories(results.directories);
      })
      .catch((err) => {
        console.log('error on fetch: ', err);
      });
  };

  return (
    <ResultContainer>
      <H2>Available Scan Results</H2>
      <SiteList>
        {directories.map((directory) => (
          <ListItem
            key={directory.id}
            aria-label={`View results for ${directory.name}`}
          >
            <BlueLink to={`./site-results/${directory.name}`}>
              {directory.name}
            </BlueLink>
          </ListItem>
        ))}
      </SiteList>
    </ResultContainer>
  );
};

export default SiteListing;
