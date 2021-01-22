const Crawler = require('crawler');
const fs = require('fs');
const minimist = require('minimist');

let crawledFileStream = null;
const appArgumentsDesc = `
  Usage: node crawler.js --siteUrl <name> [--saveFile <path>]
  
  Arguments:
  
  siteUrl <URL>  (url provided for the crawling - no trailing slashes ie. https://www.facebook.com)
  saveFile <path>  (optional) (path where the url text file will be saved) defaults to url hostname
`;

const urlsCollected = [];

function launchCrawler(baseUrl, siteDomain) {
    const c = new Crawler({
        rateLimit: 2000,
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                const $ = res.$;
                try {
                    const linksOnPage = $('a');

                    Object.keys(linksOnPage).forEach((item) => {
                        if (linksOnPage[item].type === 'tag') {
                            let href = linksOnPage[item].attribs.href;

                            if (href && !href.startsWith('http')) {
                                if (!href.startsWith('/')) {
                                    href = `/${href}`;
                                }
                                href = `${baseUrl}${href}`;
                            }
                            if (href && (href.indexOf(siteDomain) > -1) && !urlsCollected.includes(href)) {
                                urlsCollected.push(href);
                                writeToFile(href);
                                c.queue(href);

                            }
                        }

                    });

                } catch (e) {
                    console.error(`Encountered an error crawling. Aborting crawl.`);
                    console.log('error: ', e);
                    done();
                }

            }
            done();

        }
    });


    c.on('drain', () => {
        if (c.queueSize == 0) {
            setTimeout(() => {
                if (c.queueSize == 0) {
                    console.log('Closing the filestream...');
                    crawledFileStream.end(() => {
                        console.log('Crawling completed.');
                    });
                }
            }, 10000)
        };
    });
    console.log(`Crawling ${baseUrl}`);
    c.queue(baseUrl);
}

const writeToFile = (data) => {
    console.log('writing data to file...');
    if (crawledFileStream) {
        crawledFileStream.write(`${data}\n`);
    }
};

const runCrawler = (siteUrl, urlSaveFile) => {
    try {
        const siteDomain = new URL(siteUrl).hostname;

        if (urlSaveFile === undefined) {
            urlSaveFile = siteDomain;
        }

        const tstamp = new Date().toISOString().replace(/:/g, '-');
        const resultFolderPath = `./crawls/${siteDomain}/${tstamp}/`;
        fs.promises
            .mkdir(resultFolderPath, { recursive: true })
            .then(async () => {

                crawledFileStream = fs.createWriteStream(`${resultFolderPath + urlSaveFile}.txt`, { flags: 'a' });
                crawledFileStream.on('error', function (err) { throw err; });

                launchCrawler(siteUrl, siteDomain);
            })
            .catch((err) => {
                throw err;
            });
    } catch (e) {
        if (e.code == 'ERR_INVALID_URL') {
            console.log('Invalid URL provided.');
        }
        console.log('Error launching the crawler.');
    }
};

exports.launch = (() => {
    let validArgs = true;
    const argv = minimist(process.argv.slice(2));

    const siteUrl = argv.siteUrl;
    const urlSaveFile = argv.saveFile;

    if (siteUrl === undefined) {
        validArgs = false;
    }
    if (validArgs) {
        runCrawler(siteUrl, urlSaveFile);
    } else {
        console.log(appArgumentsDesc);
    }
})();

