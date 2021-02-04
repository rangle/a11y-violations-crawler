import React from 'react';

const ScanListing = () => {
    return (
        <>
            <a className="text-blue-600 mb-3 block" href="../">Go Back</a>
            <h1 className="text-3xl">A11Y POC</h1>
            {/* <h2 className="text-2xl">Total violations for <%=siteUrl %>: <%=results.totalViolations %></h2> */}
            <h3 className="text-xl mt-3">Violations Summary</h3>
            <ul className="mt-3 mb-3">
                {/* <li className="leading-6">Minor: <%=results.violationSummary.minor %></li>
                <li className="leading-6">Moderate: <%=results.violationSummary.moderate %></li>
                <li className="leading-6">Serious: <%=results.violationSummary.serious %></li>
                <li className="leading-6">Critical: <%=results.violationSummary.critical %></li> */}
            </ul>

            <h3 className="text-xl">Scanned Urls</h3>
            <ol className="mt-3 list-decimal list-inside">
                {/* <% results.urlList.forEach(function(url){ %>
                <li className="leading-6"><a className="text-blue-600" href="./<%=url.resultFile.replace('.json','') %>"><%=url.siteUrl%></a></li>
                <% }); %> */}
            </ol>
        </>
    );
}

export default ScanListing;