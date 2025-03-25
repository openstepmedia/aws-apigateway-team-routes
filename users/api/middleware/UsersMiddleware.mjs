// Import VineJS using ESM syntax
import vine from '@vinejs/vine'
  
class UsersMiddleware {

    /**
     * Validate the request body for creating a new user - must have valid email
     */
    static async validateCreate(data) {
        const schema = vine.object({
            email: vine.string().email(),
        });
        return await vine.validate({ schema, data });
    }

    static async create(req, res, next) {
        await UsersMiddleware.validateCreate(req.body);
        next();
    }

}

export default UsersMiddleware;
