import OrderRepositoryFactory from "./repositories/OrderRepositoryFactory.js";
import PricingService from "./services/PricingService.js";
import DiscountService from "./services/DiscountService.js";
import AuditService from "./services/AuditService.js";
import OrderService from "./services/OrderService.js";


const repository = OrderRepositoryFactory.create(  "MEMORY" );
const auditService =new AuditService();

const discountService = new DiscountService();

const pricingService =  new PricingService( discountService );
const orderService = new OrderService( repository, pricingService, auditService);

const order = {
    id: 1001,
    customerEmail: "john@test.com",
    deliveryType: "EXPRESS",
    items: [
        {
            sku: "LAPTOP",
            quantity: 1,
            price: 51000
        }
    ]
};

console.log("Creating order...");
const createdOrder = await orderService.createOrder(order);
console.log("Created Order:", createdOrder);

console.log("\nSummary of the order\n")
console.log(await orderService.generateSummary(1001));

// Update Order Example
const updateData = {
    id: 1001,
    customerEmail: "john_updated@test.com",
    deliveryType: "EXPRESS",
    items: [
        {
            sku: "LAPTOP",
            quantity: 2,
            price: 51000
        }
    ]
};
console.log("\nUpdating order...");
const updatedOrder = await orderService.updateOrder(updateData);
console.log("Updated Order:", updatedOrder);

console.log("\nSummary of the updated order\n")
console.log(await orderService.generateSummary(1001));

console.log("\nCancelling order...");
await orderService.cancelOrder(1001);

console.log("\nEvent logs\n")
console.log(auditService.getLogs());
