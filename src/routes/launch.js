var express = require('express');
var router = express.Router();
var path = require('path');
var childProcess = require('child_process');

router.post('/', function (req, res, next) {
    console.log('the post request worked!');
    console.log('req: ', req.body.siteUrl);
    // TODO: Need to figure out the path where the file gets saved (right now it's in same folder as the a11y-crawler-poc project)
    const crawlProcess = childProcess.spawn('node', [`${path.join(__dirname, '../lib/crawler.js')}`, '--siteUrl', req.body.siteUrl]); // --siteUrl ${req.body.siteUrl}

    crawlProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.json({ result: 'error' });
    });

    crawlProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.json({ result: 'success' });
    });
});

module.exports = router;