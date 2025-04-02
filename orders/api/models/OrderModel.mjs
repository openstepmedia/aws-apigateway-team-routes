import crypto from 'crypto';

class Order {
    id;
    total;
    createdAt;

    constructor(params) {
        this.id = crypto.randomUUID();
        this.total = params.total;
        this.createdAt = new Date();
    }
}

class OrderModel {
    static orders = [];

    static all() {
        return this.orders;
    }

    static create(params) {
        const order = new Order({ total: params.total });
        this.orders.push(order);
        return order;
    }

    static read(id) {
        return this.orders.find(order => order.id === id);
    }

    static update(id, params) {
        const order = this.orders.find(order => order.id === id);
        order.total = params.total;
        return order;
    }

    static delete(id) {
        const order = this.orders.find(order => order.id === id);
        this.orders = this.orders.filter(order => order.id !== id);
        return order;
    }
}


export default OrderModel;
