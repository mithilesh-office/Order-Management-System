import { orderSchema } from "../validators/orderSchema.js";

class OrderService {

    constructor( repository,pricingService, auditService) {
        this.repository = repository;
        this.pricingService = pricingService;
        this.auditService = auditService;
    }

    async createOrder(order) {

     const validatedOrder = orderSchema.parse(order);
     const pricing = this.pricingService.calculate(validatedOrder);
     const savedOrder = {

      ...validatedOrder,
      ...pricing
     
    };

        await this.repository.save(savedOrder);
        this.auditService.log( "ORDER_CREATED",savedOrder.id );

        return savedOrder;
    }


    async cancelOrder(id) {

        await this.repository.delete(id);
        this.auditService.log("ORDER_CANCELLED", id);
    }
      
    async updateOrder(order){
     const validatedOrder = orderSchema.parse(order);
     const pricing = this.pricingService.calculate(validatedOrder);
     const savedOrder = {

      ...validatedOrder,
      ...pricing
     
    };

        await this.repository.update(savedOrder);
        this.auditService.log("ORDER_UPDATED" , savedOrder.id);

        return savedOrder;

    }
    async generateSummary(id) {

        const order = await this.repository.findById(id);

        if (!order) {
            throw new Error("Order not found");
        }

        return {
            orderId: order.id,
            subtotal: order.subtotal,
            discount: order.discount,
            deliveryCharge:order.deliveryCharge,
            finalAmount: order.finalAmount
        };
    }
}

export default OrderService;