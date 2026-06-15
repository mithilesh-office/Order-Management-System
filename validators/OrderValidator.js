import { orderSchema } from "../validators/orderSchema.js";


class OrderValidator {

     validate(order) {
        return orderSchema.parse(order);
    }
}


export default OrderValidator;