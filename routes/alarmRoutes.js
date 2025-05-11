// safewake-back/routes/alarmRoutes.js
const express = require('express');
const router = express.Router();
const alarmCtrl = require('../controllers/alarmController');
const auth = require('../middleware/authMiddleware');
// Configuração e busca de alarme (requer login)
router.get('/next', auth, alarmCtrl.getNextAlarm);
router.post('/config', auth, alarmCtrl.saveAlarmConfig);
// Rota de trigger manual (se precisar)
router.post('/trigger', alarmCtrl.triggerAlarm);
module.exports = router;