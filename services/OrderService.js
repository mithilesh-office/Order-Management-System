import { orderSchema  } from "../validators/orderSchema.js";

class OrderService {

    constructor( repository,pricingService, auditService) {
        this.repository = repository;
        this.pricingService = pricingService;
        this.auditService = auditService;
    }

    createOrder(order) {

     const validatedOrder = orderSchema.parse(order);
     const pricing = this.pricingService.calculate(validatedOrder);
     const savedOrder = {

      ...validatedOrder,
      ...pricing
     
    };

        this.repository.save(savedOrder);
        this.auditService.log( "ORDER_CREATED",savedOrder.id );

        return savedOrder;
    }


    cancelOrder(id) {

        this.repository.delete(id);
        this.auditService.log("ORDER_CANCELLED", id);
    }
      
    updateOrder(order){
     const validatedOrder = orderSchema.parse(order);
     const pricing = this.pricingService.calculate(validatedOrder);
     const savedOrder = {

      ...validatedOrder,
      ...pricing
     
    };

        this.repository.updateOrder(savedOrder)
        this.auditService.log("ORDER_UPDATED" , savedOrder.id);

        return savedOrder;

    }
    generateSummary(id) {

        const order = this.repository.findById(id);

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