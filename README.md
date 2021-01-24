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

## Running the crawler
- CD into the src/lib folder

node crawler.js --siteUrl `<URL>` [--saveFile <string>]

- if no saveFile is provided, it will default to the url's hostname.
- folder/file creation:  `./crawls/<hostname>/<timestamp>/<saveFile>.txt`

Example call: `node crawler.js --siteUrl https://www.yahoo.ca`

## Running the Puppeteer checker
- CD into the src/lib folder

node checker.js --crawlFilePath `<string>` --filePrefix `<string>`

Example: `node checker.js --crawlFilePath /Users/magalibautista/workspace/rangle/a11y-crawler-poc/src/crawls/www.yahoo.ca/2021-01-15T18-44-23.571Z/www.yahoo.ca.txt --filePrefix yahoo`

- The scans folder will be created in ./src/public/ 
- A folder named with the hostname will be created in /scans

## TODOs
- allow more parameters to be passed to the axe core library for different kinds of scans
- update the script so that puppeteer does both the crawling and scanning at the same time?
- decide on a frontend framework to display the results?
- the category tags ideally should link to their respective rules
- be able to further filter the urls that will be saved in the crawl result file
