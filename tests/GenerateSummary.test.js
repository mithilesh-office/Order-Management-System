import OrderService from "../../src/services/OrderService.js";
import {jest} from "@jest/globals";

describe("Generate Summary", () => {

    test("should generate summary",() => {

            const repository = {
                findById: jest.fn()
            };

            repository.findById.mockReturnValue({
                    id: 1001,
                    subtotal: 51000,
                    discount: 7650,
                    deliveryCharge: 150,
                    finalAmount: 43500
                });

            const orderService = new OrderService(
                    repository,
                    {},
                    {}
                );

            const summary = orderService.generateSummary( 1001 );

            expect(summary).toEqual({
                orderId: 1001,
                subtotal: 51000,
                discount: 7650,
                deliveryCharge: 150,
                finalAmount: 43500
            });
        }
    );
});