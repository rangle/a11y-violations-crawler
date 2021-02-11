import React, { useState, useEffect } from 'react';
import { SITE_RESULTS_API } from '../constants';
import { useParams } from 'react-router-dom';

import {
  H2,
  ListItem,
  SiteList,
  ResultContainer,
  BlueLink,
} from '../styles/common';

const SiteResults = () => {
  const [siteResults, setSiteResults] = useState([]);
  let { siteName } = useParams();

  useEffect(() => {
    fetchSiteResultsFromAPI();
  }, []);

  const fetchSiteResultsFromAPI = () => {
    fetch(`${SITE_RESULTS_API}${siteName}`)
      .then((res) => res.json())
      .then((results) => {
        setSiteResults(results.dirs);
      })
      .catch((err) => {
        console.log('error on fetch: ', err);
      });
  };

  return (
    <ResultContainer>
      <a className="text-blue-600 mb-3 block" href="../">
        Go Back
      </a>
      <H2>Available Scan Results for {siteName}</H2>
      <SiteList>
        {siteResults.map((result, index) => (
          <ListItem key={index} aria-label={`View results for ${result}`}>
            <BlueLink to={`./${siteName}/${result}`}>{result}</BlueLink>
          </ListItem>
        ))}
      </SiteList>
    </ResultContainer>
  );
};

export default SiteResults;
