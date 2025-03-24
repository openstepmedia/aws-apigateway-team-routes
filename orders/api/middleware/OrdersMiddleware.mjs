// Import VineJS using ESM syntax
import vine from '@vinejs/vine'

  
class OrdersMiddleware {

    static async validateCreate(data) {
        const schema = vine.object({
            total: vine.number(),
        });
        return await vine.validate({ schema, data });
    }

    static async create(req, res, next) {
        await OrdersMiddleware.validateCreate(req.body);
        next();
    }

}


export default OrdersMiddleware;
