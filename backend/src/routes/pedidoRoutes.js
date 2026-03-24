const { Router } = require('express');
const pedidoController = require('../controller/pedidoController');
const { authRequired } = require('../middleware/authMiddleware');

const router = Router();

router.use(authRequired);
router.get('/', pedidoController.listar);
router.post('/', pedidoController.criar);
router.put('/:id', pedidoController.atualizar);
router.patch('/:id/cancelar', pedidoController.cancelar);
router.patch('/:id/avaliar', pedidoController.avaliar);
router.post('/:id/executar-contrato', pedidoController.executarContrato);

module.exports = router;
