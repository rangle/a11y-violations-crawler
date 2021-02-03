const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const childProcess = require('child_process');
const upload = multer({
    dest: './src/public/data/uploads/'
});
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

router.post('/', upload.single('results-file'), function (req, res, next) {
    const a11yCheckerProcess = childProcess.spawn('node', [`${path.join(__dirname, '../lib/checker.js')}`, '--crawlFilePath', path.join(__dirname, `../public/data/uploads/${req.file.filename}`), '--filePrefix', req.body.filePrefix, '--saveFilePath', path.join(__dirname, '../public/scans/'), '--hostName', req.file.originalname]); // ${req.file.filename}

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