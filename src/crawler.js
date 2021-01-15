const Crawler = require('crawler');
const fs = require('fs');

let siteUrl = '';
let saveFile = '';
let siteDomain = '';
let resultFolderPath = './crawls/';
const appArgumentsDesc = `
  Usage: node crawler.js -siteUrl <name> [-saveFile <path>]
  
  Arguments:
  
  siteUrl <url>  (url provided for the crawling - no trailing slashes ie. https://www.facebook.com)
  saveFile <path>  (optional) (path where the url text file will be saved) defaults to url hostname
`;

const urlsCollected = [];
const c = new Crawler({ rateLimit: 2000 });

function crawlUrls(url) {
    console.log(`Crawling ${url}`);
    c.queue({
        uri: url,
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                const $ = res.$;
                try {
                    const links = $('a');

                    Object.keys(links).forEach((item) => {
                        if (links[item].type === 'tag') {
                            let href = links[item].attribs.href;

                            if (href && !href.startsWith('http')) {
                                if (!href.startsWith('/')) {
                                    href = `/${href}`;
                                }
                                href = `${siteUrl}${href}`;
                            }
                            if (href && (href.indexOf(siteDomain) > -1) && !urlsCollected.includes(href)) {
                                urlsCollected.push(href);

                                setTimeout(function () {
                                    crawlUrls(href);
                                }, 2000)

                            } else {
                                console.log(`href ${href} was already visited`);
                            }
                        }

                    });

                } catch (e) {
                    console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
                    done();
                }

            }
            done();

        }
    });
}

// This doesn't fire when the crawler is completely finished...
c.on('drain', () => {
    // For example, release a connection to database.
    writeToFile(`${resultFolderPath + saveFile}.txt`, urlsCollected, {});
});

// c.queueSize
const writeToFile = (filePath, dataToWrite, options) => {
    console.log('writing results to file...');
    var file = fs.createWriteStream(filePath);
    file.on('error', function (err) { console.error(`file writing error: ${err}`) });
    dataToWrite.forEach(function (line) {
        file.write(`${line}
`);
    });
    file.end();
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
                // Queue just one URL, with default callback
                crawlUrls(siteUrl);
            })
            .catch((err) => {
                throw err;
            });
    } else {
        console.log(appArgumentsDesc);
    }
})();

