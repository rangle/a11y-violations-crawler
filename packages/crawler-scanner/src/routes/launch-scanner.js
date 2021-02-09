const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const childProcess = require('child_process');
const { cwd } = require('process');
const winston = require('winston');

const scansFolderPath = '/public/scans';
const uploadsFolderPath = '/public/data/uploads/';
const libFolderPath = '/src/lib/';

const upload = multer({
    dest: path.join(cwd(), uploadsFolderPath)
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

router.post('/', upload.single('results-file'), function (req, res, next) {
    const a11yCheckerProcess = childProcess.spawn('node',
        [path.join(cwd(), `${libFolderPath}checker.js`),
            '--crawlFilePath', path.join(cwd(),
                `${uploadsFolderPath}${req.file.filename}`),
            '--filePrefix', req.body.filePrefix,
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

module.exports = router;
