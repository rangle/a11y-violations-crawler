const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const { cwd } = require('process');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

const scansFolderPath = '/public/scans';

router.get('/', function (req, res, next) {
    res.redirect('/');
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
