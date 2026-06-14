import OrderService from "../services/OrderService.js";
import {jest} from "@jest/globals";

describe("Generate Summary", () => {

    test("should generate summary",async () => {

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

            const summary = await orderService.generateSummary( 1001 );

            expect(summary).toEqual({
                orderId: 1001,
                subtotal: 51000,
                discount: 7650,
                deliveryCharge: 150,
                finalAmount: 43500
            });
            expect(summary.finalAmount).toBe(43500);

        }
    );
});