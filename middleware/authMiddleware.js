// safewake-back/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido!' });
  }
const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
if (!secret) {
    // Interrompe imediatamente caso variável não esteja definida
    throw new Error('JWT_SECRET não definida no .env!');
  }
try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido!' });
  }
};