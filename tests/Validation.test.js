import OrderService from "../services/OrderService.js";
import { jest } from "@jest/globals";

describe("OrderService - Validation Tests", () => {
    let repository;
    let pricingService;
    let auditService;
    let orderService;
    let Order;

    beforeEach(() => {

        repository = { save: jest.fn() };
        pricingService = { calculate: jest.fn() };
        auditService = { log: jest.fn() };
        orderService = new OrderService(repository, pricingService, auditService);

        Order = {
            id: 1,
            customerEmail: "john@test.com",
            deliveryType: "STANDARD",
            items: [
                {
                    sku: "LAPTOP",
                    quantity: 1,
                    price: 1000
                }
            ]
        };
    });

    test("should throw error for invalid email", () => {
        
        Order.customerEmail = "invalid-email";
        expect(() => orderService.createOrder(Order)).toThrow();

    });

    test("should throw error when quantity is 0", () => {

        Order.items[0].quantity = 0;
        expect(() => orderService.createOrder(Order)).toThrow();

    });

    test("should throw error for invalid SKU", () => {

        Order.items[0].sku = "@@@";
        expect(() => orderService.createOrder(Order)).toThrow();

    });
});