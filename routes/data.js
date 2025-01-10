const express = require('express');
const { insertData } = require('../controllers/dataController');
const router = express.Router();

router.post('/data', insertData);

module.exports = router;
