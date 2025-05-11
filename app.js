// safewake-back/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Conecta ao MongoDB Atlas
async function connectDB() {
  try {
    // Certifique-se que o nome é MONGOURL (com underline)
    const MONGOURL = process.env.MONGOURL;
    if (!MONGOURL) throw new Error('MONGOURL não definido no .env!');
    // Versão atualizada: sem opções depreciadas
    await mongoose.connect(MONGOURL);
    console.log('🔗 Conectado ao MongoDB Atlas!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
}
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/alarm', require('./routes/alarmRoutes'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend SafeWake rodando!' });
});

module.exports = app;
