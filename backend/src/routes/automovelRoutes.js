const { Router } = require('express');
const automovelController = require('../controller/automovelController');
const { authRequired } = require('../middleware/authMiddleware');

const router = Router();

router.use(authRequired);
router.get('/', automovelController.listar);
router.post('/', automovelController.cadastrar);

module.exports = router;
