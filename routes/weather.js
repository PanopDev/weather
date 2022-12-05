const express = require('express');
const router = express.Router();
const weather = require('../controllers/weatherController')
router.post('/', weather)

module.exports = router