const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');
const readline = require('readline');
const ejs = require('ejs');
const minimist = require('minimist');
const template = require('./templates/scan-result');


const appArgumentsDesc = `
  Usage: node checker.js --crawlFilePath <string> --filePrefix <string>
  
  Arguments:
  
  crawlFilePath <string>  (path of the file containing urls to scan)
  filePrefix    <string>  prefix for the generated json files
`;

const launchScan = async (crawlFilePath, resultFolderPath, filePrefix) => {
  let urlCounter = 0;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

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
  } catch (err) {
    console.log('error: ', err);
  }
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

  const data = JSON.stringify(results);
  fs.writeFileSync(resultFile, data);

  const html = ejs.render(template.resultTemplate, { results: results, url: urlFromFile });

  fs.writeFileSync(`${resultFolderPath}${filePrefix}_${urlCounter}.html`, html);

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

const runChecker = (crawlFilePath, filePrefix) => {
  try {
    const pathParts = crawlFilePath.split('/');
    const fileName = pathParts.slice(-1);
    const folderName = fileName[0].replace('.txt', '');

    console.log('folderName: ', folderName);
    // create a folder that is timestamped
    const tstamp = new Date().toISOString().replace(/:/g, '-');
    const resultFolder = `${folderName}/${tstamp}`;
    const resultFolderPath = `./scans/${resultFolder}/`;
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

exports.launch = (() => {
  let validArgs = true;
  const argv = minimist(process.argv.slice(2));

  const crawlFilePath = argv.crawlFilePath;
  const filePrefix = argv.filePrefix;

  if (
    crawlFilePath === undefined ||
    filePrefix === undefined
  ) {
    validArgs = false;
  }

  if (validArgs) {
    runChecker(crawlFilePath, filePrefix);
  } else {
    console.log(appArgumentsDesc);
  }
})();