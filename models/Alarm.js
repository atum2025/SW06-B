// safewake-back/models/Alarm.js
const mongoose = require('mongoose');
const AlarmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Alarm', AlarmSchema);