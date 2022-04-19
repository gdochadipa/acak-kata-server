var express = require('express');
var router = express.Router();
const { index, detail } = require('./controller');

router.get('/', index);
router.get('/detail',detail);


module.exports = router;