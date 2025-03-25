/**
 * UsersController
 * Each method acts as a transformer between the HTTP request and the UserModel
 * @class
 * @see https://github.com/jeremydaly/lambda-api?tab=readme-ov-file#request
 * Using static methods to avoid instantiating the class and keeping index.mjs cleaner.
 */
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
