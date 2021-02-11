import React, { useState, useEffect } from 'react';
import { H2, ResultContainer, BlueExtLink } from '../styles/common';
import { SITE_RESULTS_API } from '../constants';
import {
    useParams
} from "react-router-dom";

const toggleCodeView = (containerId) => {
    console.log('containerId:', containerId);
    document.getElementById(containerId).classList.toggle('show');
}

const ScanDetails = () => {
    const [siteUrl, setSiteUrl] = useState('');
    const [violationList, setViolationList] = useState([]);
    let { siteName, scanFolder, scanDetail } = useParams();

    useEffect(() => {
        fetchScanDetailsFromAPI();
    }, []);

    const fetchScanDetailsFromAPI = () => {
        fetch(`${SITE_RESULTS_API}${siteName}/${scanFolder}/${scanDetail}`).then(res => res.json()).then(data => {
            setSiteUrl(data.results.url);
            setViolationList(data.results.violations);

        }).catch(err => {
            console.log('error on fetch: ', err);
        });
    };

    return (
        <ResultContainer>
            <a className="text-blue-600 mb-3 block" href="./">Go Back</a>
            <H2>Violation Details for: {siteUrl}</H2>
            <h3>Total violations: {violationList.length}</h3>
            { violationList.map((violation, index) => {
                return (<div key={index} className="mt-4 p-4 border border-gray-400 rounded">
                    <h3 className="text-xl mb-3">{index + 1}{'.'} {violation.description}</h3>
                    <h4 className="text-lg mb-3">Severity: <span style={{ color: violation.impact === 'minor' ? 'green' : 'red' }}>{violation.impact}</span></h4>
                    <h5 className="text-base mb-3">Tags:{' '}
                        {violation.tags.map((tag, index) => {
                            if (tag === 'wcag2a') {
                                return <BlueExtLink key={index} href="https://www.w3.org/WAI/WCAG21/quickref/" rel="noreferrer" target="_blank"><span style={{ marginRight: '10px' }}>{tag}</span></BlueExtLink>
                            } else {
                                return <span key={index} style={{ marginRight: '10px' }}>{tag}</span>
                            }
                        })}
                    </h5>
                    <h5 className="text-base mb-3"><BlueExtLink href={violation.helpUrl} rel="noreferrer" target="_blank">More Information About Failure</BlueExtLink></h5>
                    <ol type="a" className="ml-4" style={{ listStyle: 'lower-alpha !important' }}>
                        {violation.nodes.map((node, idx) => {
                            return (<li key={idx} className="mb-3"><p className="mb-3">{node.failureSummary}</p>
                                <button className="mb-3 rounded p-2 border-2 border-yellow-500 hover:border-gray-500" id={`btn-${index}-${idx}`} type="button" onClick={(e) => toggleCodeView(`code-${index}-${idx}`)}>Show Target Markup</button>
                                <pre className="bg-blue-100 border border-gray-400 rounded p-3" id={`code-${index}-${idx}`} style={{ display: 'none', whiteSpace: 'breakSpaces', overflowX: 'auto' }}>{node.html}</pre>
                            </li>)
                        })}
                    </ol>
                </div>)
            })}
        </ResultContainer>
    );
}

export default ScanDetails;
