import React, { useState } from 'react';
import { FormContainer, FormHeader, FormLabel, FormFileInput, FormTextInput, FormButton, FormMessage } from '../../styles/form';
import buildFormData from '../../utils/form-data-builder';
import postData from '../../utils/http-post';
import Spinner from '../../components/Spinner';

const LAUNCH_SCAN_API_URL = 'http://localhost:3001/api/launch-scanner';

const ScanLauncher = () => {
    const filePrefixInputName = 'filePrefix';
    const resultsFileInputName = 'resultsFile';
    const fileInputRef = React.createRef();

    const [filePrefix, setFilePrefix] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePrefixChange = (event) => {
        setFilePrefix(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const resultsFile = fileInputRef.current.files[0];
        const formFilePrefix = filePrefix;
        let fileContents = '';
        const reader = new FileReader();

        if (resultsFile) {
            reader.readAsBinaryString(resultsFile);
        }

        reader.addEventListener("load", function () {
            fileContents = reader.result;

            postData(LAUNCH_SCAN_API_URL, buildFormData(resultsFileInputName, resultsFile, filePrefixInputName, formFilePrefix, fileContents), 'multipart/form-data; boundary=blob')
                .then(data => {
                    console.log(data); // JSON data parsed by `data.json()` call
                    if (data && data.result === 'success') {
                        setShowProgress(false);
                        setShowSuccess(true);
                    }
                }).catch(err => {
                    console.log('error launching scanner: ', err);
                });

            setFilePrefix('');
            setShowProgress(true);
        });
    };

    return (
        <FormContainer>
            <FormHeader>Run a New Scan Only</FormHeader>
            <FormMessage margin="0 0 0.75rem 0">If you have a text file containing URLs you would like to scan, you can upload it here.<br />
            The format should be one url per line in the file.</FormMessage>
            <form className="flex flex-col" id="scan-form" onSubmit={handleSubmit}>
                <FormLabel htmlFor="results-file">Upload Your Url Results Text File<br />(Filename should contain the hostname. IE: www.yahoo.ca.txt)
                    <FormFileInput ref={fileInputRef} name="resultsFile" id="resultsFile" type="file" accept=".txt" required />
                </FormLabel>
                <FormLabel htmlFor="filePrefix">File Prefix for Your Scan Files
                    <FormTextInput onChange={handlePrefixChange} value={filePrefix} name="filePrefix" id="filePrefix" type="text" placeholder="example.com" required />
                </FormLabel>
                <FormButton id="scan-launch-btn" type="submit">Launch Scan</FormButton>
            </form>
            {showProgress ? <FormMessage margin="0.75rem 0 0 0" id="scan-progress-message">Your Scan will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</FormMessage> : ''}
            { showProgress ? <Spinner /> : ''}
            {showSuccess ? <FormMessage margin="0.75rem 0 0 0" textColour="green" id="scan-success-message">The scan has completed. Please check the Site Listing page to see the results.</FormMessage> : ''}
        </FormContainer>
    );
};

export default ScanLauncher;
