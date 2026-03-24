const { Router } = require('express');
const creditoController = require('../controller/creditoController');
const { authRequired } = require('../middleware/authMiddleware');

const router = Router();

router.use(authRequired);
router.get('/', creditoController.listar);
router.post('/', creditoController.associar);

module.exports = router;
