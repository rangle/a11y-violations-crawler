const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');
const readline = require('readline');
const ejs = require('ejs');
const minimist = require('minimist')

let resultFolderPath = '';
let resultFolder = '';
let folderName = '';
let crawlFilePath = '';
let filePrefix = '';
let urlCounter = 0;

const appArgumentsDesc = `
  Usage: node puppeteer.js --crawlFilePath <string> --filePrefix <string>
  
  Arguments:
  
  crawlFilePath <string>  (path of the file containing urls to scan)
  filePrefix    <string>  prefix for the generated json files
`;

const launchScan = async () => {
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
      await runScan(page, line);
    }

    // after looping through all the urls in the file, close the browser
    await browser.close();
    console.log('scan completed.');
  } catch (err) {
    console.log('error: ', err);
  }
}


const runScan = async (page, urlFromFile) => {
  await page.goto(urlFromFile, { waitUntil: 'networkidle2' });
  console.log('inject axe core');

  // Inject and run axe-core
  const handle = await injectAxe(page);
  console.log('injected. get results');

  // Get the results from `axe.run()`.
  results = await handle.jsonValue();
  console.log('write results to file');

  const resultFile = `${resultFolderPath}${filePrefix}_${urlCounter}.json`;
  console.log(`Writing to file: ${resultFile}`);

  const data = JSON.stringify(results);
  fs.writeFileSync(resultFile, data);

  let html = ejs.render(`<html><head>
    <style>
      .show {
        display: block !important;
      }
    </style>
    <script>
      function toggle(id) {
        document.getElementById(id).classList.toggle('show');
      }
    </script>
  </head><body style="font-family:Arial;padding:20px;">
  <h1>Results for <%=url %></h1>
  <p>Total violations for this webpage: <%=results.violations.length %></p>
 
  <h2>Violation Details</h2>
    <% results.violations.forEach(function(violation, index){ %>
        <div style="border:1px solid grey;
        padding:15px;
        border-radius:5px;margin-bottom:15px;">
          <h3><%=index+1 %>. <%=violation.description%></h3>
          <h4>Severity: <span style="color:<%=violation.impact == 'minor' ? 'green': 'red'%>;" ><%=violation.impact %></span></h4>
          <h5>Tags: 
            <% violation.tags.forEach(function(tag){ %>
              <span style="margin-right:10px"><%=tag%></span>
            <% }); %> 
          </h5>
          <ol type="a">
            <% violation.nodes.forEach(function(node, idx){ %>
              <li><p><%=node.failureSummary %></p>
                <button id="btn-<%=index%>-<%=idx %>" type="button" onClick="toggle('code-<%=index%>-<%=idx %>')">Show Target Markup</button>
                <pre id="code-<%=index%>-<%=idx %>" style="display:none;white-space:break-spaces;overflow-x:auto;"><%=node.html %></pre>
              </li>
            <% }); %>
          </ol>
        </div>
    <% }); %>
 
</body></html>`, { results: results, url: urlFromFile });

  fs.writeFileSync(`${resultFolderPath}${filePrefix}_${urlCounter}.html`, html);

  urlCounter++;
  await handle.dispose();
};

const injectAxe = (page) => {
  return page.evaluateHandle(`
    // Inject axe source code
    ${axeCore.source}
    // Run axe
    // axe.configure({
    //   rules: [{
    //     id: 'tagRule',
    //     tags: ['wcag2a']
    //   }]
    // })
    axe.run()
  `);
};

(() => {
  let validArgs = true;
  let argv = minimist(process.argv.slice(2));

  crawlFilePath = argv.crawlFilePath;
  filePrefix = argv.filePrefix;

  if (
    crawlFilePath === undefined ||
    filePrefix === undefined
  ) {
    validArgs = false;
  }

  if (validArgs) {

    try {
      const pathParts = crawlFilePath.split('/');
      const fileName = pathParts.slice(-1);
      folderName = fileName[0].replace('.txt', '');

      console.log('folderName: ', folderName);
      // create a folder that is timestamped
      const tstamp = new Date().toISOString().replace(/:/g, '-');
      resultFolder = `${folderName}/${tstamp}`;
      resultFolderPath = `./scans/${resultFolder}/`;
      fs.promises
        .mkdir(resultFolderPath, { recursive: true })
        .then(async () => {
          // Queue just one URL, with default callback
          launchScan();
        })
        .catch((err) => {
          throw err;
        });
    } catch (e) {
      console.error(e);
    }

  } else {
    console.log(appArgumentsDesc);
  }
})();