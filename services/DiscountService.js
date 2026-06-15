import Discount_Rules from "../constants/discountConstants.js";

class DiscountService {

    calculate(subtotal) {

        if (subtotal > Discount_Rules.High_Discount_Threshold) {
            return (subtotal * Discount_Rules.High_Discount_Percentage
            );
        }

        if ( subtotal >Discount_Rules.Standard_Discount_Threshold) {
            return (subtotal * Discount_Rules.Standard_Discount_Percentage);
        }

        return 0;
    }
}

export default DiscountService;