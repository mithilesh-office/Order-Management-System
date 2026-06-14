import Delivery_charges from "../constants/deliveryCharges.js";

class PricingService {

    constructor(discountService) {
        this.discountService = discountService;
    }

    calculate(order) {

        const subtotal = order.items.reduce( (sum, item) => sum + (item.price * item.quantity), 0 );

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