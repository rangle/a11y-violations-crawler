var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/', function (req, res, next) {
    res.redirect('/');
});

/* GET site scans listing. */
router.get('/:siteName', function (req, res, next) {
    fs.readdir(path.join(__dirname, `../public/scans/${req.params.siteName}`), (err, files) => {
        if (err) {
            console.log('fs error? ', err);
        }
        const resultDirs = files.filter(f => f !== '.DS_Store');
        res.render('scans', { siteName: req.params.siteName, dirs: resultDirs });
    });
});


/* GET site scans listing. */
router.get('/:siteName/:scanFolder', function (req, res, next) {
    fs.readFile(path.join(__dirname, `../public/scans/${req.params.siteName}/${req.params.scanFolder}/summary.json`), (err, data) => {
        if (err) {
            console.log('fs error? ', err);
        }
        const parsedData = JSON.parse(data);

        console.log('parsedData: ', parsedData);
        res.render('scan-summary', { siteUrl: req.params.siteName, results: parsedData });
    });
});

/* GET site scan detail. */
router.get('/:siteName/:scanFolder/:scanFile', function (req, res, next) {
    fs.readFile(path.join(__dirname, `../public/scans/${req.params.siteName}/${req.params.scanFolder}/${req.params.scanFile}.json`), (err, data) => {
        if (err) {
            console.log('fs error? ', err);
        }
        const parsedData = JSON.parse(data);

        console.log('parsedData: ', parsedData);
        res.render('scan-details', { siteUrl: req.params.siteName, results: parsedData });
    });
});

module.exports = router;
