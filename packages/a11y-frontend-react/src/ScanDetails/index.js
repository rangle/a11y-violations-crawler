import React from 'react';

const ScanDetails = () => {
    return (
        <>
            <a className="text-blue-600 mb-3 block" href="./">Go Back</a>
            <h1 className="text-3xl">A11Y POC</h1>

            {/* <p className="text-xl">Total violations for <%=results.url %>: <%=results.violations.length %></p> */}

            <h2 className="text-2xl mb-3">Violation Details</h2>
            {/* <% results.violations.forEach(function(violation, index){ %>
            <div className="mt-4 p-4 border border-gray-400 rounded">
                <h3 className="text-xl mb-3"><%=index+1 %>. <%=violation.description%></h3>
                <h4 className="text-lg mb-3">Severity: <span style="color:<%=violation.impact == 'minor' ? 'green': 'red'%>;" ><%=violation.impact %></span></h4>
                <h5 className="text-base mb-3">Tags: 
                <% violation.tags.forEach(function(tag){ %>
                  <% if( tag === 'wcag2a') { %>
                    <a className="text-blue-600" href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank"><span style="margin-right:10px"><%=tag%></span></a>
                  <% } else { %>
                    <span style="margin-right:10px"><%=tag%></span>
                    <% } %>
                <% }); %> 
                </h5>
                <h5 className="text-base mb-3"><a className="text-blue-600" href="<%=violation.helpUrl %>" target="_blank">More Information About Failure</a></h5>
                <ol type="a" className="ml-4" style="list-style:lower-alpha !important;">
                <% violation.nodes.forEach(function(node, idx){ %>
                    <li className="mb-3"><p className="mb-3"><%=node.failureSummary %></p>
                    <button className="mb-3 rounded p-2 border-2 border-yellow-500 hover:border-gray-500" id="btn-<%=index%>-<%=idx %>" type="button" onClick="toggle('code-<%=index%>-<%=idx %>')">Show Target Markup</button>
                    <pre className="bg-blue-100 border border-gray-400 rounded p-3" id="code-<%=index%>-<%=idx %>" style="display:none;white-space:break-spaces;overflow-x:auto;"><%=node.html %></pre>
                    </li>
                <% }); %>
                </ol>
            </div>
        <% }); %> */}
        </>
    );
}

export default ScanDetails;