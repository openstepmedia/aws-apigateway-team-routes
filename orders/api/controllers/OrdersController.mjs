import OrderModel from '../models/OrderModel.mjs';

class OrdersController {

    static async all() {
        return OrderModel.all();
    }

    static async create(req) {
        return OrderModel.create(req.body);
    }

    static read(req) {
        return OrderModel.read(req.params.id);
    }

    static update(req) {
        return OrderModel.update(req.params.id, req.body);
    }

    static delete(req) {
        return OrderModel.delete(req.params.id);
    }
}


export default OrdersController;
