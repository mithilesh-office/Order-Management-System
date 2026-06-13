import DiscountService from "../../src/services/DiscountService.js";

describe("DiscountService", () => {

    test( "should apply 15% discount", () => {

            const service = new DiscountService();

            expect(service.calculate(60000)).toBe(9000);
        }
    );
});