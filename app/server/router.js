var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os');
const { syncUserServer } = require('./controller');

router.post('/sync-user',syncUserServer);