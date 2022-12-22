import UserModel from '../model/user.js';

class UserController {
    static create(data) {
        return UserModel.create(data);
    }

    static get(query = {}) {
        return UserModel.find(query);
    }

    static getByid(id) {
        return UserModel.findById(id);
    }

    static uploadById(id, data) {
        return UserModel.updateOne({ _id: id }, { $set: data });
    }

    static deleteById(id) {
        return UserModel.deleteOne({ _id: id });
    }
}

export default UserController;
