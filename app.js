import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

import indexRouter from './routes/index.js';
import UserModel from './model/user.js';

const app = express();
const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Midelware de autenticación

(() => {
    try {
        const URL = process.env.MONGODB_URL;
        mongoose.connect(URL);
        console.log('Conectado a la base de datos.');
    } catch (error) {
        console.error('Error en conectarse a la base de datos: ', error.message);
    }
})();

// Autenticación: podemos autenticarnos de muchas maneras (google, twiter, facebook, local, etc...)

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        (email, password, done) => {
            UserModel.findOne({ email })
                .then((user) => {
                    if (!user) {
                        console.log(`El usuario ${email} no se encuentra.`);

                        return done(null, true, {
                            message: `El usuario ${email} no fue encontrado`,
                        });
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        console.log('contraseña invalida');

                        return done(null, false, {
                            message: 'Contraseña invalida',
                        });
                    }
                    console.log(user);
                    done(null, user);
                })
                .catch((error) => {
                    console.log('Error al iniciar sesion\n', error.message);
                    done(error);
                });
        },
    ),
);

passport.use(
    'registrer',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true, // Este parametro si esta en true, especifica que el callback reciba el objeto req (request)
        },
        (req, email, password, done) => {
            UserModel.findOne({ email })
                .then((user) => {
                    if (user) {
                        console.log(`El usuario ${email} ya existe.`);

                        return done(null, false);
                    } else {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(req.body.password, salt);
                        req.body.password = hash;

                        return UserModel.create(req.body);
                    }
                })
                .then((newUser) => {
                    console.log(newUser);
                    if (newUser) {
                        console.log(`EL usuario ${newUser.email} se registro de manera exitosa.`);

                        done(null, newUser, { message: '' });
                    } else {
                        throw new Error('El usuario ya existe');
                    }
                })
                .catch((error) => {
                    console.log('Error al registrarse', error.message);
                    done(error);
                });
        },
    ),
);

// Serializador de passport

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    UserModel.findOne({ _id })
        .then((user) => done(null, user))
        .catch(done);
});

// Express sesion

app.use(
    session({
        secret: process.env.SECRET_SESSION,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            mongoOptions: advancedOptions,
            ttl: 600,
        }),
        rolling: true,
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Vista de la setaup del servidor

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// rutas

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
