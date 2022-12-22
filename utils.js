var bcrypt = require('bcrypt');
var jwt = 'jsonwebtoken';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

export const isValidPassword = (password, target) => {
    return bcrypt.compareSync(password, target);
};

export const generateToken = (user) => {
    const token = jwt.sign({ data: user }, PRIVATE_KEY, { expiresIn: '2000h' });
    return token;
};

export const verifyJWT = (token) => {
    new Promise((resolve, reject) => {
        jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded.data);
        });
    });
};
