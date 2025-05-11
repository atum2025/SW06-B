// safewake-back/models/AlarmConfig.js
const mongoose = require('mongoose');
const AlarmConfigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  horario: { type: String, required: true }, // ISO string
  intervalo: { type: Number, required: true },
  som: { type: Boolean, default: true },
  vibracao: { type: Boolean, default: true }
},{ timestamps: true });
module.exports = mongoose.model('AlarmConfig', AlarmConfigSchema);