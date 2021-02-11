import React, { useState, useEffect } from 'react';
import { H2, ResultContainer, BlueLink } from '../styles/common';
import { SITE_RESULTS_API } from '../constants';
import { useParams } from 'react-router-dom';

const ScanListing = () => {
  const [totalViolations, setTotalViolations] = useState(0);
  const [violationSummary, setViolationSummary] = useState({});
  const [urlList, setUrlList] = useState([]);
  let { siteName, scanFolder } = useParams();

  useEffect(() => {
    fetchScanResultsFromAPI();
  }, []);

  const fetchScanResultsFromAPI = () => {
    fetch(`${SITE_RESULTS_API}${siteName}/${scanFolder}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalViolations(data.results.totalViolations);
        setViolationSummary(data.results.violationSummary);
        setUrlList(data.results.urlList);
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
      <H2>
        Total violations for {siteName}: {totalViolations}
      </H2>
      <h3 className="text-xl mt-3">Violations Summary</h3>
      <ul className="mt-3 mb-3">
        <li className="leading-6">Minor: {violationSummary.minor}</li>
        <li className="leading-6">Moderate: {violationSummary.moderate}</li>
        <li className="leading-6">Serious: {violationSummary.serious}</li>
        <li className="leading-6">Critical: {violationSummary.critical}</li>
      </ul>
      <h3 className="text-xl">Scanned Urls</h3>
      <ol className="mt-3 list-decimal list-inside">
        {urlList.map(function (url, index) {
          return (
            <li key={index} className="leading-6">
              <BlueLink
                to={`./${scanFolder}/${url.resultFile.replace('.json', '')}`}
              >
                {url.siteUrl}
              </BlueLink>
            </li>
          );
        })}
      </ol>
    </ResultContainer>
  );
};

export default ScanListing;
