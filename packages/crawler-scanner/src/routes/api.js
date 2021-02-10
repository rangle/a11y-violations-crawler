const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const childProcess = require('child_process');
const { cwd } = require('process');

const scansFolderPath = process.env.SCANS_FOLDER_PATH;
const uploadsFolderPath = process.env.UPLOADS_FOLDER_PATH;
const libFolderPath = process.env.LIB_FOLDER_PATH;

const upload = multer({
    dest: path.join(cwd(), uploadsFolderPath)
});
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

/* GET home page. */
router.get('/site-results', function (req, res, next) {
    fs.readdir(path.join(cwd(), scansFolderPath), (err, files) => {
        if (err) {
            logger.error('fs error? ', err);
        }
        const scanDirs = files.filter(f => f !== '.DS_Store').map(((file, index) => ({ id: index, name: file })));
        logger.info('what are the found directories? ', scanDirs);
        res.json({ directories: scanDirs });
    });

});

router.post('/launch-crawler', function (req, res, next) {
    const a11yLauncherProcess = childProcess.spawn('node', [
        path.join(cwd(), `${libFolderPath}crawler.js`),
        '--siteUrl', req.body.siteUrl,
        req.body.autoScan ? '--autoScan' : '']);

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

router.post('/launch-scanner', upload.single('resultsFile'), function (req, res, next) {
    const a11yCheckerProcess = childProcess.spawn('node', [
        path.join(cwd(), `${libFolderPath}checker.js`),
        '--crawlFilePath',
        path.join(cwd(), `${uploadsFolderPath}${req.file.filename}`),
        '--filePrefix',
        req.body.filePrefix,
        '--saveFilePath',
        path.join(cwd(), scansFolderPath),
        '--hostName',
        req.file.originalname]);

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

/* GET site scans listing. */
router.get('/:siteName', function (req, res, next) {
    fs.readdir(path.join(cwd(),
        `${scansFolderPath}${req.params.siteName}`), (err, files) => {
            if (err) {
                logger.error('fs error? ', err);
            }
            const resultDirs = files.filter(f => f !== '.DS_Store');
            res.render('scans', { siteName: req.params.siteName, dirs: resultDirs });
        });
});

/* GET site scans listing. */
router.get('/:siteName/:scanFolder', function (req, res, next) {
    fs.readFile(path.join(cwd(),
        `${scansFolderPath}${req.params.siteName}/${req.params.scanFolder}/summary.json`), (err, data) => {
            if (err) {
                logger.error('fs error? ', err);
            }
            const parsedData = JSON.parse(data);

            logger.info('parsedData: ', parsedData);
            res.render('scan-summary', { siteUrl: req.params.siteName, results: parsedData });
        });
});

/* GET site scan detail. */
router.get('/:siteName/:scanFolder/:scanFile', function (req, res, next) {
    fs.readFile(path.join(cwd(),
        `${scansFolderPath}${req.params.siteName}/${req.params.scanFolder}/${req.params.scanFile}.json`), (err, data) => {
            if (err) {
                logger.error('fs error? ', err);
            }
            const parsedData = JSON.parse(data);

            logger.info('parsedData: ', parsedData);
            res.render('scan-details', { siteUrl: req.params.siteName, results: parsedData });
        });
});

module.exports = router;
