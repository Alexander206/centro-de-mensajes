import express from 'express';
let router = express.Router();

import generarProductoFake from '../../utils/generador.js';
import productosdb from '../../db/productosdb.js';

async function fakeProducts(cant) {
    await productosdb.crearTabla();

    for (let i = 0; i < cant; i++) {
        await productosdb.guardarProducto(generarProductoFake());
    }
}

/* GET users listing. */
router.get('/productos-test', function (req, res, next) {
    fakeProducts(5);
    res.send('5');
});

export default router;
