import MemoryOrderRepository from "./MemoryOrderRepository.js";
import MongoOrderRepository from "./MongoOrderRepository.js";

class OrderRepositoryFactory {

    static create(type) {

        switch (type) {

            case "MEMORY":
                return new MemoryOrderRepository();

            case "MONGO":
                return new MongoOrderRepository();

            default:
                throw new Error( "Unsupported Repository");
        }
    }
}

export default OrderRepositoryFactory;