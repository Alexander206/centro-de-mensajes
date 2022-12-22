import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const user = new Schema({
    email: { type: String, require: true },
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    alias: { type: String, require: true },
    age: { type: Number, require: true },
    avatar: { type: String, require: true },
    password: { type: String, require: true },
});

export default mongoose.model('user', user);
