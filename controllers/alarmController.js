// safewake-back/controllers/alarmController.js
const User = require('../models/User');
const Alarm = require('../models/Alarm');
const AlarmConfig = require('../models/AlarmConfig');
const twilio = require('twilio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Twilio
const client = twilio(
  process.env.TWILIOACCOUNTSID,
  process.env.TWILIOAUTHTOKEN
);
// ----------- CADASTRO DE USUÁRIO -----------
exports.createUser = async (req, res) => {
  try {
    const { name, email, senha, telefone, contatoNome, contatoTelefone } = req.body;
    if (!name || !email || !senha || !telefone || !contatoNome || !contatoTelefone) {
      return res.status(400).json({ message: 'Preencha todos os campos!' });
    }
const exists = await User.findOne({ $or: [{ email }, { telefone }] });
if (exists) return res.status(409).json({ message: 'Usuário já cadastrado!' });

const senhaHash = await bcrypt.hash(senha, 10);

const savedUser = await User.create({
  name,
  email,
  senha: senhaHash,
  telefone,
  contatoNome,
  contatoTelefone
});

// Não retorna senha
const { senha: _, ...userNoSenha } = savedUser.toObject();
res.status(201).json({ user: userNoSenha, message: 'Usuário cadastrado com sucesso!' });

} catch (e) {
    console.error('[ERROR] Erro ao cadastrar usuário:', e);
    res.status(500).json({ error: 'Erro ao criar usuário', detail: e.message });
  }
};
// ----------- LOGIN DE USUÁRIO -----------
exports.loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos!' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Usuário ou senha inválidos' });
const senhaOK = await bcrypt.compare(senha, user.senha);
if (!senhaOK) return res.status(401).json({ message: 'Usuário ou senha inválidos' });

const { senha: _, ...userNoSenha } = user.toObject();
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'sua-chave-ultra-secreta', { expiresIn: '7d' });

res.json({ user: userNoSenha, token, message: 'Login efetuado com sucesso!' });

} catch (e) {
    console.error('[ERROR] Erro ao fazer login:', e);
    res.status(500).json({ error: 'Erro ao fazer login', detail: e.message });
  }
};
// ----------- DISPARAR ALARME/SMS (opcional, mantém para emergência manual) -----------
exports.triggerAlarm = async (req, res) => {
  try {
    const { telefone } = req.body;
    const user = await User.findOne({ telefone });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });
await Alarm.create({ user: user._id });

const contato = user.contatoTelefone.replace(/\D/g, '');
const dddCountry = contato.length === 11 ? '+55' : '';
const numeroDestino = dddCountry + contato;
const mensagem = `Alerta SafeWake: ${user.name} (${user.telefone}) pode precisar de ajuda. Favor tentar contato!`;

await client.messages.create({
  to: numeroDestino,
  from: process.env.TWILIO_PHONE,
  body: mensagem
});

res.json({ message: 'SMS enviado ao contato de emergência.' });

} catch (e) {
    console.error('[ERROR] Erro ao disparar alerta/SMS:', e);
    res.status(500).json({ error: 'Erro ao disparar alerta e enviar SMS.', detail: e.message });
  }
};
// ----------- ROTAS DE ALARME (FRONTEND) -----------
// Retorna a próxima configuração de alarme do usuário autenticado
exports.getNextAlarm = async (req, res) => {
  try {
    const config = await AlarmConfig.findOne({ user: req.userId });
    if (!config) return res.status(200).json(null);
res.json({
  horario: new Date(config.horario).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
  intervalo: config.intervalo,
  som: config.som,
  vibracao: config.vibracao
});

} catch (e) {
    res.status(500).json({ error: 'Erro ao buscar alarme', detail: e.message });
  }
};
// Salva a configuração do alarme do usuário autenticado
exports.saveAlarmConfig = async (req, res) => {
  try {
    const { horario, intervalo, som, vibracao } = req.body;
    if (!horario || !intervalo) return res.status(400).json({ message: 'Horário e intervalo obrigatórios.' });
let config = await AlarmConfig.findOne({ user: req.userId });
if (!config) {
  config = await AlarmConfig.create({ user: req.userId, horario, intervalo, som, vibracao });
} else {
  config.horario = horario;
  config.intervalo = intervalo;
  config.som = som;
  config.vibracao = vibracao;
  await config.save();
}
res.json({ ok: true, message: 'Configuração salva!', config });

} catch (e) {
    res.status(500).json({ error: 'Erro ao salvar configuração', detail: e.message });
  }
};