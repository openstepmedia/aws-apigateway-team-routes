import crypto from 'crypto';

class User {
    id;
    email;
    createdAt;

    constructor(params) {
        this.id = crypto.randomUUID();
        this.email = params.email;
        this.createdAt = new Date();
    }
}

class UserModel {
    static users = [];

    static all() {
        return this.users;
    }

    static create(params) {
        const user = new User({ email: params.email });
        this.users.push(user);
        return user;
    }

    static read(id) {
        return this.users.find(user => user.id === id);
    }

    static update(id, params) {
        const user = this.users.find(user => user.id === id);
        user.email = params.email;
        return user;
    }

    static delete(id) {
        const user = this.users.find(user => user.id === id);
        this.users = this.users.filter(user => user.id !== id);
        return user;
    }
}

export default UserModel;
