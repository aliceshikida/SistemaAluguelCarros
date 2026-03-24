const { Router } = require('express');
const consultaController = require('../controller/consultaController');
const { authRequired } = require('../middleware/authMiddleware');

const router = Router();

router.use(authRequired);
router.get('/clientes', consultaController.listarClientes);
router.get('/agentes', consultaController.listarAgentes);
router.get('/contratos', consultaController.listarContratos);

module.exports = router;
