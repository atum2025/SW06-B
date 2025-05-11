// safewake-back/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SafeWake backend rodando na porta ${PORT}!`);
  });
