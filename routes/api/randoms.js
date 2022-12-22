import { Router } from 'express';
import { fork } from 'child_process';

let router = Router();

router.get('/randoms', (req, res, next) => {
    res.render('randoms');
});

router.post('/randoms', (req, res, next) => {
    let number = req.body.number || 100000000;

    console.log('ruta: ',number);

    const computo = fork('./routes/api/calculos.js', [number]);
    computo.on('message', (data) => {
        computo.send('este es un mensaje');
        console.log(data);
        res.send(data);
    });
});

export default router;
