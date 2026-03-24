const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ sucesso: true, mensagem: 'API funcionando.' });
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
