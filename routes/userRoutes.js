// safewake-back/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const alarmCtrl = require('../controllers/alarmController');
router.post('/register', alarmCtrl.createUser);
router.post('/login', alarmCtrl.loginUser);
module.exports = router;