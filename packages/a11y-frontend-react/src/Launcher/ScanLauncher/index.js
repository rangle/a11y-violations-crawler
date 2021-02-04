import React from 'react';
import styled from 'styled-components';

const FormButton = styled.button`
    padding: 0.75rem;
    max-width: 20rem;
    display: block;
    cursor: pointer;
    border-radius: 0.125rem;
    background-color: skyblue;
`;

const FormTextInput = styled.input`
    display: block;
    border: 1px solid skyblue;
    border-radius: 0.125rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
`;

const FormFileInput = styled.input`
    display: block;
    border: 1px solid skyblue;
    border-radius: 0.125rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
`;

const FormLabel = styled.label`
    margin-bottom: 1rem;
`;

const ScanMessage = styled.p`
    margin-top: 0.75rem;
    color: ${props => props.textColour}
`;

const ScanFormContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const FormHeader = styled.h2`
    margin-bottom: 1.25rem;
    font-size: 1.5rem;
    line-height: 2rem;
`;


const ScanLauncher = () => {
    let showProgress = false;
    let showSuccess = false;
    return (
        <ScanFormContainer>
            <FormHeader>Run a New Scan Only</FormHeader>
            <form className="flex flex-col" id="scan-form">
                <FormLabel htmlFor="results-file">Upload Your Url Results Text File<br />(Filename should contain the hostname. IE: www.yahoo.ca.txt)
                    <FormFileInput name="results-file" id="results-file" type="file" accept=".txt" required />
                </FormLabel>
                <FormLabel htmlFor="filePrefix">File Prefix for Your Scan Files
                    <FormTextInput name="filePrefix" id="filePrefix" type="text" placeholder="example.com" required />
                </FormLabel>
                <FormButton id="scan-launch-btn" type="submit">Launch Scan</FormButton>
            </form>
            {showProgress ? <ScanMessage id="scan-progress-message">Your Scan will now begin. It may take up to 30 minutes. Come back and refresh the page for results.</ScanMessage> : ''}
            {showSuccess ? <ScanMessage textColour="green" id="scan-success-message">The scan has completed. Please refresh the page to see the results.</ScanMessage> : ''}
        </ScanFormContainer>
    );
};

export default ScanLauncher;
