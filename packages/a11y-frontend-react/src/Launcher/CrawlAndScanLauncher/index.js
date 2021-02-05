import React from 'react';
import { FormContainer, FormHeader, FormLabel, FormButton, FormTextInput, FormMessage } from '../../styles/form';

const CrawlAndScanLauncher = () => {
    return (
        <FormContainer>
            <FormHeader>Run a New Crawl and Scan</FormHeader>
            <form className="flex flex-col">
                <FormLabel htmlFor="site-url">Site Url (Without ending slash "/")
                        <FormTextInput name="site-url" id="site-url" type="url" placeholder="https://example.com" pattern="(http|https)://.*" required />
                </FormLabel>
                <FormButton id="crawl-launch-btn" type="submit">Launch Crawler</FormButton>
            </form>
            <FormMessage id="progress-message" className="mt-3 progress hidden">Your Crawl will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</FormMessage>
            <FormMessage id="success-message" className="mt-3 success hidden green">The scan has completed. Please refresh the page to see the results.</FormMessage>
        </FormContainer>
    );
}

export default CrawlAndScanLauncher;
