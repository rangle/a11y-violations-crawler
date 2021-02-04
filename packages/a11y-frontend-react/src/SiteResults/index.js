import React from 'react';

const SiteResults = () => {
    return (
        <>
            <a className="text-blue-600 mb-3 block" href="../">Go Back</a>
            <h1 className="text-3xl">A11Y POC</h1>
            {/* <h2 className="text-2xl">Available Scan Results for <%=siteName %></h2> */}
            <ul className="mt-3">
                {/* <% dirs.forEach(dir=>{ %>
                <li className="leading-6"><a className="text-blue-600" href="./<%=dir %>"><%=dir %></a></li>
                <%}) %> */}
            </ul>
        </>
    );
}

export default SiteResults;