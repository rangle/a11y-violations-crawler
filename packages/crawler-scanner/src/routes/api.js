var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
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
        logger.info('what is scanDirs? ', scanDirs);
        res.json({ directories: scanDirs });
        res.end();
    });

});

module.exports = router;
