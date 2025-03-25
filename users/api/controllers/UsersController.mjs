import UserModel from '../models/UserModel.mjs';

class UsersController {

    static async all() {
        return UserModel.all();
    }

    static async create(req) {
        return UserModel.create(req.body);
    }

    static read(req) {
        return UserModel.read(req.params.id);
    }

    static update(req) {
        return UserModel.update(req.params.id, req.body);
    }

    static delete(req) {
        return UserModel.delete(req.params.id);
    }
}


export default UsersController;
