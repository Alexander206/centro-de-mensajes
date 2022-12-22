import { Router } from 'express';
import passport from 'passport';

let router = Router();

// [Midellware] usuario autenticado

const isAuth = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('login');
};

// [GET] pagina de inicio.

router.get('/', isAuth, (req, res, next) => {
    res.redirect('/aplication');
});

// [GET] pagina de la aplicación.

router.get('/aplication', isAuth, (req, res, next) => {
    const { user } = req;
    console.log('El usuario :' + user.email + ' se conecto');
    res.render('index', {
        name: `${user.firstname} ${user.lastname}`,
        correo: user.email,
        nombre: user.firstname,
        apellido: user.lastname,
        edad: user.age,
        alias: user.alias,
        avatar: user.avatar,
    });
});

// [GET] pagina de registro.

router.get('/registrer', (req, res, next) => {
    res.render('registrer');
});

// [GET] pagina de registro fallido.

router.get('/failRegistrer', (req, res, next) => {
    res.render('failRegistrer', { email: 'yo' });
});

// [GET] pagina de inicio de sesion.

router.get('/login', isAuth, (req, res, next) => {
    res.render('login');
});

// [GET] pagina de inicio de sesion fallido.

router.get('/failLogin', (req, res, next) => {
    res.render('failLogin', { email: req.email });
});

// [GET] pagina de cierre.

router.get('/bye', isAuth, (req, res, next) => {
    const { user } = req;
    res.render('bye', { name: `${user.firstname} ${user.lastname}` });
});

// [POST] ruta para iniciar sesion.

router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/failLogin',
        failureMessage: true,
    }),
    function (req, res) {
        res.redirect('/');
    },
);

// [POST] ruta para registrarse.

router.post(
    '/registrer',
    passport.authenticate('registrer', {
        successRedirect: '/login',
        failureRedirect: '/failRegistrer',
    }),
    function (req, res) {
        res.redirect('/');
    },
);

// [POST] ruta para cerrar sesion.

router.post('/logout', (req, res, next) => {
    const { user } = req;
    req.logout((error) => {
        if (!error) {
            // res.status(200).render('adios', { user: user.email });
        } else {
            res.send('Ocurrio un  error', error.message);
        }
    });
});

export default router;
