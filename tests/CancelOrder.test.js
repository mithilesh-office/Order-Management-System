import OrderService from "../services/OrderService.js";
import {jest} from "@jest/globals";

describe("Cancel Order", () => {

    test("should delete order",async () => {

            const repository = {
                delete: jest.fn()
            };

            const orderService = new OrderService(
                    repository,
                    {},
                    { log: jest.fn() }
                );

            await orderService.cancelOrder(1001);

            expect(repository.delete).toHaveBeenCalledWith(1001);
        }
    );
});