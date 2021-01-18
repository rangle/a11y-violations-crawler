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
node crawler.js -siteUrl <url> [-saveFile <path>]

if no saveFile is provided, it will default to the url's hostname.

Example: `node crawler.js -siteUrl https://www.yahoo.ca`

## Running the Puppeteer scanner
node puppeteer.js -crawlFile `<path of the url file>` -filePrefix `<string>`

Example: `node puppeteer.js -crawlFile /Users/magalibautista/workspace/rangle/a11y-crawler-poc/src/crawls/www.yahoo.ca/2021-01-15T18-44-23.571Z/www.yahoo.ca.txt -filePrefix yahoo`

## TODOs
- cleanup the existing code
- ensure the node-crawler is properly setup and works reliably
- allow more parameters to be passed to the axe core library for different kinds of scans
- update the script so that puppeteer does both the crawling and scanning at the same time?
- move out the HTML template
- create a master scan file to be able to access individual url scans
- decide on a frontend framework to display the results?