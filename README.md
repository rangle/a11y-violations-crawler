# POC - a11y crawler/scanner
The goal is to provide the client and/or developers a tool where they can access a website's accessibility issues so that they can be addressed.
Create a tool that involves:
- crawling a website
- gathering the interal urls
- generating an accessibility report for each url
- generating an accessibility summary report for the whole website 

## Installation
POC is using npm, expressjs
Created using node v13.8

Run npm install from the ./src folder

## Running the crawler/checker from the browser

- `npm run start` from the ./src folder
- navigated to localhost:3000
- on the homepage, there will be a small form to launch a scan
- enter the url and if you want to scan as well, check the box
- press the submit button
- refresh once the scanning is completed

## Running the crawler from the command line
- CD into the src/lib folder

node crawler.js --siteUrl `<URL>` [--saveFile <string>]

- if no saveFile is provided, it will default to the url's hostname.
- folder/file creation:  `./crawls/<hostname>/<timestamp>/<saveFile>.txt`

Example call: `node crawler.js --siteUrl https://www.yahoo.ca`

## Running the Puppeteer checker from the command line
- CD into the src/lib folder

node checker.js --crawlFilePath `<string>` --filePrefix `<string>`

Example: `node checker.js --crawlFilePath /Users/magalibautista/workspace/rangle/a11y-crawler-poc/src/crawls/www.yahoo.ca/2021-01-15T18-44-23.571Z/www.yahoo.ca.txt --filePrefix yahoo`

- The scans folder will be created in ./src/public/ 
- A folder named with the hostname will be created in /scans

## TODOs
- allow more parameters to be passed to the axe core library for different kinds of scans
- decide on a frontend framework to display the results? (Tentative: React)
- allow a user to upload a sitemap-type file to bypass crawling (FUTURE) **
- make the front-end prettier
- ensure there is no timeout when launching scan from the frontend (long polling?)

## Notes
- monorepo, with separate packages
- 1 backend service, 1 frontend service ** (separation of concerns)
- could become mini saas application

- /public should be outside of /src
- make sure ./scans folder exists (or create it) . (use makedirp module)
- files should be stored outside of /src
- add an option to run Puppeteer headless (flag or dev environment var)
- progress bar (via sockets) (or you can notify the user - via email)
- potentially generate partial results right away

- ability to configure which pages to scan (a created/curated list - json file, or xml to be converted) **
-- go through critical pages

- how do we know when a page has loaded? 

- check why google.com keeps looping and if we can prevent that?

- ** FRONT END MUST BE ACCESSIBLE **

- could Cypress replace Puppeteer?