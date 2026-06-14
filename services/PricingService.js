import Delivery_charges from "../constants/deliveryCharges.js";

class PricingService {

    constructor(discountService) {
        this.discountService = discountService;
    }

    calculate(order) {

        let subtotal = 0;
        for (let i = 0; i < order.items.length; i++) {
            subtotal += order.items[i].price * order.items[i].quantity;
        }

        const deliveryCharge = Delivery_charges[order.deliveryType] || 0;

        const discount = this.discountService.calculate(subtotal);

        const finalAmount = subtotal - discount + deliveryCharge;

        return {
            subtotal,
            discount,
            deliveryCharge,
            finalAmount
        };
    }
}


export default PricingService;