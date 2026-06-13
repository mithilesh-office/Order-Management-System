import PricingService from "../../src/services/PricingService.js";
import {jest} from "@jest/globals";


describe("PricingService", () => {

    test("should calculate express delivery charge",() => {

            const discountService = {
                calculate: jest.fn()
            };

            const pricingService = new PricingService( discountService );

            const result = pricingService.calculate({
                deliveryType:"EXPRESS",
                items: [ {
                    sku: "LAPTOP",
                    quantity: 1,
                    price: 1000
                }]
                });

            expect( result.deliveryCharge ).toBe(150);
        }
    );
});