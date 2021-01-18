const Crawler = require('crawler');
const fs = require('fs');

let siteUrl = '';
let saveFile = '';
let siteDomain = '';
let resultFolderPath = './crawls/';
let crawledFileStream = null;
const appArgumentsDesc = `
  Usage: node crawler.js -siteUrl <name> [-saveFile <path>]
  
  Arguments:
  
  siteUrl <url>  (url provided for the crawling - no trailing slashes ie. https://www.facebook.com)
  saveFile <path>  (optional) (path where the url text file will be saved) defaults to url hostname
`;

const urlsCollected = [];

function launchCrawler(url) {
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
                                href = `${siteUrl}${href}`;
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
                    console.log('closing the filestream...');
                    crawledFileStream.end(() => {
                        console.log('crawling completed.');
                    });
                }
            }, 10000)
        };
    });
    console.log(`Crawling ${url}`);
    c.queue(url);
}

const writeToFile = (data) => {
    console.log('writing data to file...');
    if (crawledFileStream) {
        crawledFileStream.write(`${data}\n`);
    }
};



(() => {
    let validArgs = true;
    process.argv.forEach((val, index) => {
        const getValue = () => {
            if (index + 1 < process.argv.length) {
                return process.argv[index + 1];
            }
            throw 'Arguments provided are not valid.';
        };

        try {
            switch (val) {
                case '-siteUrl':
                    siteUrl = getValue();
                    break;
                case '-saveFile':
                    saveFile = getValue();
                    break;
            }
        } catch (err) {
            console.log('Error: ', err);
            return;
        }
    });

    if (
        siteUrl === ''
    ) {
        validArgs = false;
    }
    if (validArgs) {
        siteDomain = new URL(siteUrl).hostname;

        if (saveFile === '') {
            saveFile = siteDomain;
        }
        // create a folder that is timestamped
        const tstamp = new Date().toISOString().replace(/:/g, '-');
        resultFolder = tstamp;
        resultFolderPath = `./crawls/${siteDomain}/${tstamp}/`;
        fs.promises
            .mkdir(resultFolderPath, { recursive: true })
            .then(async () => {

                crawledFileStream = fs.createWriteStream(`${resultFolderPath + saveFile}.txt`, { flags: 'a' });
                crawledFileStream.on('error', function (err) { console.error(`file writing error: ${err}`) });

                launchCrawler(siteUrl);
            })
            .catch((err) => {
                throw err;
            });
    } else {
        console.log(appArgumentsDesc);
    }
})();

