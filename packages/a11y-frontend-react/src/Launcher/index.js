import React from 'react';

const Launcher = () => {
    return (
        <>
            <div className="container flex flex-col">
                <h2 className="mb-5 text-2xl">Run a New Crawl and Scan</h2>
                <form className="flex flex-col">
                    <label className="mb-4">Site Url (Without ending slash "/")
                        <input className="border border-green-500 rounded-sm p-2 block mt-2" name="site-url" id="site-url" type="url" placeholder="https://example.com" pattern="(http|https)://.*" required></input>
                    </label>
                    <label className="mb-4 flex items-center">After crawl completes, start the scan
                    <input className="ml-2 border-green-500" type="checkbox" id="auto-scan" />
                    </label>
                    <input className="cursor-pointer block bg-green-500 p-3 rounded-sm max-w-xs" id="crawl-launch-btn" type="submit" value="Launch Crawler" />
                </form>
                <p id="progress-message" className="mt-3 progress hidden">Your Crawl will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</p>
                <p id="success-message" className="mt-3 success hidden green">The scan has completed. Please refresh the page to see the results.</p>
            </div>

            <hr className="my-4" />
            <div className="container flex flex-col">
                <h2 className="mb-5 text-2xl">Run a New Scan Only</h2>
                <form className="flex flex-col" id="scan-form">
                    <label className="mb-4">Upload Your Url Results Text File<br />(Filename should contain the hostname. IE: www.yahoo.ca.txt)
                    <input className="border border-green-500 rounded-sm p-2 block mt-2" name="results-file" id="results-file" type="file" accept=".txt" required></input>
                    </label>
                    <label className="mb-4">File Prefix for Your Scan Files
                    <input className="border border-green-500 rounded-sm p-2 block mt-2" name="filePrefix" id="filePrefix" type="text" placeholder="example.com" required></input>
                    </label>
                    <input className="cursor-pointer block bg-green-500 p-3 rounded-sm max-w-xs" id="scan-launch-btn" type="submit" value="Launch Scan" />
                </form>
                <p id="scan-progress-message" className="mt-3 progress hidden">Your Scan will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</p>
                <p id="scan-success-message" className="mt-3 success hidden green">The scan has completed. Please refresh the page to see the results.</p>
            </div>
        </>
    );
}

export default Launcher;