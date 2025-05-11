// safewake-back/models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true, unique: true },
  contatoNome: { type: String, required: true },
  contatoTelefone: { type: String, required: true }
},{ timestamps: true });
module.exports = mongoose.model('User', UserSchema);