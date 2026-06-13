class DiscountService {

    calculate(subtotal) {

        if (subtotal > 50000) {
            return subtotal * 0.15;
        }

        if (subtotal > 10000) {
            return subtotal * 0.10;
        }

        return 0;
    }
}

export default  DiscountService;