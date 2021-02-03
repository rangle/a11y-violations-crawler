const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');
const readline = require('readline');
const minimist = require('minimist');

const DEFAULT_SAVE_PATH = './src/public/scans/';

const summaryData = {
  siteUrl: '',
  totalViolations: 0,
  violationSummary: {
    minor: 0,
    moderate: 0,
    serious: 0,
    critical: 0
  },
  urlList: []
};
const getSiteSummary = true;
const appArgumentsDesc = `
  Usage: node checker.js --crawlFilePath <string> --filePrefix <string> --saveFilePath <string> --hostName <string>
  
  Arguments:
  
  crawlFilePath <string>  (path of the file containing urls to scan)
  filePrefix    <string>  prefix for the generated json files
  saveFilePath  <string>  path where to create the timestamped folder
  hostName      <string>  hostname of the website that will be scanned
`;

const launchScan = async (crawlFilePath, resultFolderPath, filePrefix) => {
  let urlCounter = 0;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0); // temporary for now.
    // Get the url from the crawl file
    const readStream = fs.createReadStream(crawlFilePath, {
      encoding: 'utf-8',
    });
    const readLine = readline.createInterface(readStream);

    for await (const line of readLine) {
      console.log('line is: ', line);
      await runScan(page, line, resultFolderPath, filePrefix, urlCounter);
      urlCounter++;
    }

    // after looping through all the urls in the file, close the browser
    await browser.close();
    console.log('scan completed.');

    if (getSiteSummary) {
      generateSiteSummary(resultFolderPath);
    }
  } catch (err) {
    console.log('error: ', err);
  }
}

// Keep track of the violations and 
// violation types
// Create JSON with violation count, and url -> json result mapping
const generateSiteSummary = (resultFolderPath) => {
  const summaryFile = `${resultFolderPath}summary.json`;
  const data = JSON.stringify(summaryData);
  fs.writeFileSync(summaryFile, data);
};

const updateSummaryViolations = (resultJSON) => {
  resultJSON.violations.forEach((violation) => {
    violation.nodes.forEach((node) => {
      summaryData.totalViolations++;
      summaryData.violationSummary[node.impact]++;
    });
  });
}

const runScan = async (page, urlFromFile, resultFolderPath, filePrefix, urlCounter) => {
  await page.goto(urlFromFile, { waitUntil: 'networkidle2' });
  console.log('inject axe core');

  // Inject and run axe-core
  const handle = await injectAxe(page);
  console.log('injected. get results');

  // Get the results from `axe.run()`.
  const results = await handle.jsonValue();
  console.log('write results to file');

  const resultFile = `${resultFolderPath}${filePrefix}_${urlCounter}.json`;
  console.log(`Writing to file: ${resultFile}`);

  summaryData.urlList.push({ siteUrl: urlFromFile, resultFile: `${filePrefix}_${urlCounter}.json` });
  updateSummaryViolations(results);

  const data = JSON.stringify(results);
  fs.writeFileSync(resultFile, data);

  await handle.dispose();
};

const injectAxe = (page) => {
  return page.evaluateHandle(`
    // Inject axe source code
    ${axeCore.source}
    // Run axe
    // axe.run({
    //   runOnly: {
    //     type: 'tag',
    //     values: ['wcag2a']
    //   }
    // })
    axe.run()
  `);
};

// TODO: Rename this function
const createFoldersAndRunChecker = (crawlFilePath, filePrefix, saveFilePath, siteHostName) => {
  try {

    const hostName = siteHostName ? siteHostName.replace('.txt', '') : crawlFilePath.split('/').slice(-1)[0].replace('.txt', '');
    const pathToResultsFolder = saveFilePath ? `${saveFilePath}${hostName}` : `${DEFAULT_SAVE_PATH}${hostName}`;
    summaryData.siteUrl = hostName; // TODO: this may not always be the hostname

    // create a folder that is timestamped
    const tstamp = new Date().toISOString().replace(/:/g, '-');
    const resultFolderPath = `${pathToResultsFolder}/${tstamp}/`;
    fs.promises
      .mkdir(resultFolderPath, { recursive: true })
      .then(async () => {
        // Queue just one URL, with default callback
        launchScan(crawlFilePath, resultFolderPath, filePrefix);
      })
      .catch((err) => {
        throw err;
      });
  } catch (e) {
    console.error(e);
  }
};

const areArgsValid = (crawlFilePath, filePrefix) => {
  return crawlFilePath !== undefined &&
    filePrefix !== undefined;
}

exports.launch = (passedCrawlFilePath, passedFilePrefix) => {
  const crawlFilePath = passedCrawlFilePath;
  const filePrefix = passedFilePrefix;

  if (areArgsValid(crawlFilePath, filePrefix)) {
    createFoldersAndRunChecker(crawlFilePath, filePrefix);
  } else {
    console.log(appArgumentsDesc);
  }
};

(() => {
  const argv = minimist(process.argv.slice(2));

  const crawlFilePath = argv.crawlFilePath;
  const filePrefix = argv.filePrefix;
  const saveFilePath = argv.saveFilePath;
  const hostName = argv.hostName;

  if (areArgsValid(crawlFilePath, filePrefix)) {
    createFoldersAndRunChecker(crawlFilePath, filePrefix, saveFilePath, hostName);
  } else {
    console.log(appArgumentsDesc);
  }
})();
