import React from 'react';
import styled from 'styled-components';
import CrawlAndScanLauncher from './CrawlAndScanLauncher';
import ScanLauncher from './ScanLauncher';

const LauncherContainer = styled.div`
  padding: 50px 15px;
`;

const Hr = styled.hr`
  margin: 1rem 0;
`;

const Launcher = () => {
  return (
    <LauncherContainer>
      <CrawlAndScanLauncher />
      <Hr />
      <ScanLauncher />
    </LauncherContainer>
  );
};

export default Launcher;
