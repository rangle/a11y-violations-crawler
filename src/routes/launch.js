var express = require('express');
var router = express.Router();
var path = require('path');
var childProcess = require('child_process');

router.post('/', function (req, res, next) {
    const a11yLauncherProcess = childProcess.spawn('node', [`${path.join(__dirname, '../lib/crawler.js')}`, '--siteUrl', req.body.siteUrl, req.body.autoScan ? '--autoScan' : '']); // --siteUrl ${req.body.siteUrl}

    a11yLauncherProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.json({ result: 'error' });
    });

    a11yLauncherProcess.stdout.on('data', (data) => {
        console.info(`stdout: ${data}`);
    });

    a11yLauncherProcess.on('close', (code) => {
        console.log(`crawler exited with code ${code}`);
        res.json({ result: 'success' });

    });
});

module.exports = router;