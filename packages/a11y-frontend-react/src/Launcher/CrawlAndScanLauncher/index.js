import React, { useState } from 'react';
import {
  FormContainer,
  FormHeader,
  FormLabel,
  FormButton,
  FormTextInput,
  FormMessage,
} from '../../styles/form';
import postData from '../../utils/http-post';
import Spinner from '../../components/Spinner';

const LAUNCH_CRAWL_API_URL = 'http://localhost:3001/api/launch-crawler';

const CrawlAndScanLauncher = () => {
  const [siteUrl, setSiteUrl] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (siteUrl === '') {
      return;
    }

    postData(
      LAUNCH_CRAWL_API_URL,
      JSON.stringify({ siteUrl: siteUrl, autoScan: true })
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      if (data && data.result === 'success') {
        setShowProgress(false);
        setShowSuccess(true);
      }
    });

    setShowProgress(true);
    setSiteUrl('');
  };

  const handleSiteUrlChange = (event) => {
    setSiteUrl(event.target.value);
  };

  return (
    <FormContainer>
      <FormHeader>Run a New Crawl and Scan</FormHeader>
      <form className="flex flex-col" onSubmit={handleFormSubmit}>
        <FormLabel htmlFor="site-url">
          Site Url (Without ending slash "/")
          <FormTextInput
            onChange={handleSiteUrlChange}
            value={siteUrl}
            name="siteUrl"
            id="siteUrl"
            type="url"
            placeholder="https://example.com"
            pattern="(http|https)://.*"
            required
          />
        </FormLabel>
        <FormButton id="crawl-launch-btn" type="submit">
          Launch Crawler
        </FormButton>
      </form>
      {showProgress ? (
        <FormMessage id="progress-message" margin="0.75rem 0 0 0">
          Your Crawl will now begin. It may take up to 30 minutes. Come back and
          refresh the page for results.
        </FormMessage>
      ) : (
          ''
        )}
      {showProgress ? <Spinner /> : ''}
      {showSuccess ? (
        <FormMessage
          id="success-message"
          textColour="green"
          margin="0.75rem 0 0 0"
        >
          The scan has completed. Please check the Site Listing page to see the
          results.
        </FormMessage>
      ) : (
          ''
        )}
    </FormContainer>
  );
};

export default CrawlAndScanLauncher;
