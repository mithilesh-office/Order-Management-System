import OrderRepository from "./OrderRepository.js";

class MemoryOrderRepository extends OrderRepository {

    constructor() {
        super();
        this.orders = [];
    }

    save(order) {
        this.orders.push(order);
    }

    delete(id) {
        const index = this.orders.findIndex(order => order.id === id);
        if (index !== -1) {
        this.orders.splice(index, 1);
    }
}
update(order){
    const index = this.orders.findIndex(o => o.id === order.id);
    if(index === -1){
        throw new Error("order not found");
    }
    this.orders[index] = order;
}

    findById(id) {
        return this.orders.find(order => order.id === id);
    }
}


export default MemoryOrderRepository;