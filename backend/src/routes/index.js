const { Router } = require('express');
const authRoutes = require('./authRoutes');
const pedidoRoutes = require('./pedidoRoutes');
const automovelRoutes = require('./automovelRoutes');
const creditoRoutes = require('./creditoRoutes');
const consultaRoutes = require('./consultaRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/automoveis', automovelRoutes);
router.use('/creditos', creditoRoutes);
router.use('/', consultaRoutes);

module.exports = router;
