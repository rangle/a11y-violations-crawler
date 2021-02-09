var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var winston = require('winston');
const { cwd } = require('process');

const scansFolderPath = '/public/scans';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(path.join(cwd(), scansFolderPath), (err, files) => {
    if (err) {
      logger.error('fs error? ', err);
    }
    const scanDirs = files.filter(f => f !== '.DS_Store');
    res.render('index', { dirs: scanDirs });
  });

});

module.exports = router;
