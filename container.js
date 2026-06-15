import OrderRepositoryFactory from "./repositories/OrderRepositoryFactory.js";

import AuditService from "./services/AuditService.js";
import DiscountService from "./services/DiscountService.js";
import PricingService from "./services/PricingService.js";
import OrderService from "./services/OrderService.js";

// Repository
const repository = OrderRepositoryFactory.create("MEMORY");

// Services
const auditService = new AuditService();

const discountService = new DiscountService();

const pricingService = new PricingService(discountService );

const orderService = new OrderService(
        repository,
        pricingService,
        auditService
    );

export {
    repository,
    auditService,
    discountService,
    pricingService,
    orderService
};