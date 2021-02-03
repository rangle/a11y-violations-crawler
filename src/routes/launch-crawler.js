const express = require('express');
const router = express.Router();
const path = require('path');
const childProcess = require('child_process');

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

router.post('/', function (req, res, next) {
    const a11yLauncherProcess = childProcess.spawn('node', [`${path.join(__dirname, '../lib/crawler.js')}`, '--siteUrl', req.body.siteUrl, req.body.autoScan ? '--autoScan' : '']); // --siteUrl ${req.body.siteUrl}

    a11yLauncherProcess.stderr.on('data', (data) => {
        logger.error(`stderr: ${data}`);
        res.json({ result: 'error' });
    });

    a11yLauncherProcess.stdout.on('data', (data) => {
        logger.info(`stdout: ${data}`);
    });

    a11yLauncherProcess.on('close', (code) => {
        logger.info(`crawler exited with code ${code}`);
        res.json({ result: 'success' });

    });
});

module.exports = router;