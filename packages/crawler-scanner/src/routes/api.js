var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const multer = require('multer');
const childProcess = require('child_process');
const upload = multer({
    dest: './src/public/data/uploads/'
});
var winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

/* GET home page. */
router.get('/site-results', function (req, res, next) {
    fs.readdir(path.join(__dirname, '../public/scans/'), (err, files) => {
        if (err) {
            logger.error('fs error? ', err);
        }
        const scanDirs = files.filter(f => f !== '.DS_Store').map(((file, index) => ({ id: index, name: file })));
        logger.info('what are the found directories? ', scanDirs);
        res.json({ directories: scanDirs });
    });

});

router.post('/launch-crawler', function (req, res, next) {
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

router.post('/launch-scanner', upload.single('results-file'), function (req, res, next) {
    const a11yCheckerProcess = childProcess.spawn('node', [`${path.join(__dirname, '../lib/checker.js')}`, '--crawlFilePath', path.join(__dirname, `../public/data/uploads/${req.file.filename}`), '--filePrefix', req.body.filePrefix, '--saveFilePath', path.join(__dirname, '../public/scans/'), '--hostName', req.file.originalname]);

    a11yCheckerProcess.stderr.on('data', (data) => {
        logger.error(`stderr: ${data}`);
        res.json({ result: 'error' });
    });

    a11yCheckerProcess.stdout.on('data', (data) => {
        logger.info(`stdout: ${data}`);
    });

    a11yCheckerProcess.on('close', (code) => {
        logger.info(`scanner exited with code ${code}`);
        res.json({ result: 'success' });
    });
});

module.exports = router;
