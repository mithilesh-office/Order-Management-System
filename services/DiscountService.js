import { DISCOUNT_RULES } from "../constants/discountConstants.js";

class DiscountService {

    calculate(subtotal) {

        if (subtotal > DISCOUNT_RULES.HIGH_DISCOUNT_THRESHOLD) {
            return (subtotal * DISCOUNT_RULES.HIGH_DISCOUNT_PERCENTAGE
            );
        }

        if ( subtotal >DISCOUNT_RULES.STANDARD_DISCOUNT_THRESHOLD) {
            return (subtotal * DISCOUNT_RULES.STANDARD_DISCOUNT_PERCENTAGE);
        }

        return 0;
    }
}

export default DiscountService;