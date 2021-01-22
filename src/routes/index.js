var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(path.join(__dirname, '../public/scans/'), (err, files) => {
    if (err) {
      console.log('fs error? ', err);
    }
    const scanDirs = files.filter(f => f !== '.DS_Store');
    res.render('index', { dirs: scanDirs });
  });

});

module.exports = router;
