# POC - a11y crawler/scanner
The goal is to provide the client and/or developers a tool where they can access a website's accessibility issues so that they can be addressed.
Create a tool that involves:
- crawling a website
- gathering the interal urls
- generating an accessibility report for each url
- generating an accessibility summary report for the whole website 

## Installation
POC is using npm
Created using node v13.8

## Running the crawler
node crawler.js --siteUrl `<URL>` [--saveFile <string>]

- if no saveFile is provided, it will default to the url's hostname.
- folder/file creation:  `./crawls/<hostname>/<timestamp>/<saveFile>.txt`

Example call: `node crawler.js --siteUrl https://www.yahoo.ca`

## Running the Puppeteer checker
node checker.js --crawlFilePath `<string>` --filePrefix `<string>`

Example: `node checker.js --crawlFilePath /Users/magalibautista/workspace/rangle/a11y-crawler-poc/src/crawls/www.yahoo.ca/2021-01-15T18-44-23.571Z/www.yahoo.ca.txt --filePrefix yahoo`

## TODOs
- cleanup the existing code
- ensure the node-crawler is properly setup and works reliably
- allow more parameters to be passed to the axe core library for different kinds of scans
- update the script so that puppeteer does both the crawling and scanning at the same time?
- move out the HTML template
- create a master scan file to be able to access individual url scans
- decide on a frontend framework to display the results?
