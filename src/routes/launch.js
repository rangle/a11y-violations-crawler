var express = require('express');
var router = express.Router();
var path = require('path');
var childProcess = require('child_process');

// const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lh', '/usr']);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process close all stdio with code ${code}`);
// });

// ls.on('exit', (code) => {
//   console.log(`child process exited with code ${code}`);
// });


router.post('/', function (req, res, next) {
    console.log('the post request worked!');
    console.log('req: ', req.body.siteUrl);
    // TODO: Need to figure out the path where the file gets saved (right now it's in same folder as the a11y-crawler-poc project)
    // childProcess.fork(`${path.join(__dirname, '../lib/crawler.js')}`, ['--siteUrl', req.body.siteUrl]); // --siteUrl ${req.body.siteUrl}
    res.json({ result: 'success' });
});

module.exports = router;