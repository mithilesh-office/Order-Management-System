import OrderService from "../../src/services/OrderService.js";
import {jest} from "@jest/globals";


describe("Create Order", () => {

    test("should create order successfully",() => {

            const repository = {
                save: jest.fn()
            };

            const pricingService = {
                calculate: jest.fn()
            };

            pricingService.calculate.mockReturnValue({
                    subtotal: 51000,
                    discount: 7650,
                    deliveryCharge: 150,
                    finalAmount: 43500
                });

            const auditService = {
                log: jest.fn()
            };

            const orderService = new OrderService(repository,pricingService,auditService);
            const order  = {
                    id: 1001,
                    customerEmail:"john@test.com",
                    deliveryType:"EXPRESS",
                    items: [
                        {
                            sku: "LAPTOP",
                            quantity: 1,
                            price: 51000
                        }
                    ]
                }

            const result = orderService.createOrder(order);

            expect(repository.save).toHaveBeenCalled();
            expect(result.finalAmount).toBe(43500);
        }
    );
});