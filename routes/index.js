import { Router } from 'express';
import productosTest from './api/productosTest.js';
import randoms from './api/randoms.js';
import info from './api/info.js';
import aplication from './views/index.js';

const router = Router();

router.use('/', aplication);
router.use('/api/', productosTest, randoms, info);

export default router;
