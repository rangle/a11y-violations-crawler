import React from 'react';

const CrawlAndScanLauncher = () => {
    return (
        <div className="container flex flex-col">
            <h2 className="mb-5 text-2xl">Run a New Crawl and Scan</h2>
            <form className="flex flex-col">
                <label htmlFor="site-url" className="mb-4">Site Url (Without ending slash "/")
                        <input className="border border-green-500 rounded-sm p-2 block mt-2" name="site-url" id="site-url" type="url" placeholder="https://example.com" pattern="(http|https)://.*" required></input>
                </label>
                <input className="cursor-pointer block bg-green-500 p-3 rounded-sm max-w-xs" id="crawl-launch-btn" type="submit" value="Launch Crawler" />
            </form>
            <p id="progress-message" className="mt-3 progress hidden">Your Crawl will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</p>
            <p id="success-message" className="mt-3 success hidden green">The scan has completed. Please refresh the page to see the results.</p>
        </div>
    );
}

export default CrawlAndScanLauncher;
