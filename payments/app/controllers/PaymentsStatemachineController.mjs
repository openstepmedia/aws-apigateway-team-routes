/**
 * UsersController
 * Each method acts as a transformer between the HTTP request and the CouponModel
 * @class
 * @see https://github.com/jeremydaly/lambda-api?tab=readme-ov-file#request
 * Using static methods to avoid instantiating the class and keeping index.mjs cleaner.
 */
import CouponModel from '../models/PaymentsModel.mjs';

class CouponsStatemachineController {

    static async state1(req, res) {
        // use logger
        // @see https://github.com/jeremydaly/lambda-api/tree/main?tab=readme-ov-file#adding-additional-detail
        req.log.info('state1 input:' +  JSON.stringify(req.body.input));

        const output = {
            state1Value: {
                key: 'state1',
                time: Date.now()
            }
        }

        req.body.output = {...req.body.output, ...output}
            
        res.send(req.body);
    }

    static async state2(req, res) {
        req.log.info('state2 input:' +  JSON.stringify(req.body.input));

        const output = {
            state2Value: {
                key: 'state2',
                time: Date.now()
            }
        }

        req.body.output = {...req.body.output, ...output}
            
        res.send(req.body);
    }

}

export default CouponsStatemachineController;