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

const createdOrder =orderService.createOrder(order);


console.log(createdOrder);

console.log("\nSummary of the order\n")
console.log(orderService.generateSummary(1001));

orderService.cancelOrder(1001);

console.log("\nEvent logs\n")
console.log(auditService.getLogs());