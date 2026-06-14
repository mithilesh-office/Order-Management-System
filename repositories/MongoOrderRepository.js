import { MongoClient } from "mongodb";
import OrderRepository from "./OrderRepository.js";

class MongoOrderRepository extends OrderRepository {
    constructor() {
        super();
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
        this.client = new MongoClient(uri);
        this.dbName = process.env.MONGO_DB || "order_management";
        this.collectionName = "orders";
        this.db = null;
        this.collection = null;
        this.connectPromise = null;
    }

    async connect() {
        if (!this.connectPromise) {
            this.connectPromise = (async () => {
                await this.client.connect();
                this.db = this.client.db(this.dbName);
                this.collection = this.db.collection(this.collectionName);
            })();
        }
        await this.connectPromise;
    }

    async save(order) {
        await this.connect();
        await this.collection.insertOne(order);
    }

    async delete(id) {
        await this.connect();
        await this.collection.deleteOne({ id: id });
    }

    async update(order) {
        await this.connect();
        const result = await this.collection.replaceOne({ id: order.id }, order);
        if (result.matchedCount === 0) {
            throw new Error("order not found");
        }
    }

    async findById(id) {
        await this.connect();
        return await this.collection.findOne({ id: id });
    }

    async close() {
        if (this.connectPromise) {
            await this.connectPromise;
            await this.client.close();
            this.db = null;
            this.collection = null;
            this.connectPromise = null;
        }
    }
}

export default MongoOrderRepository;