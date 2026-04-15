import nodeDomain = require("node:domain");
import {Order} from "../../domain/entities/Order";
import {OrderRepository} from "../ports/OrderRepository";

export type CreateOrderInput = {
    orderId: string;
    customerId: string;
}

export type CreateOrderOutput = {
    orderId: string;
}

export class CreateOrder {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute({orderId, customerId}: CreateOrderInput): Promise<CreateOrderOutput> {
        const exists = await this.orderRepository.findById(orderId);
        if (exists) {
            throw new Error("Order with this ID already exists");
        }
        const order = Order.create(orderId, customerId);
        await this.orderRepository.save(order);
        return {
            orderId: orderId
        };
    }
}
