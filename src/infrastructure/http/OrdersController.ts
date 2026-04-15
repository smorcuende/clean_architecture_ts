import {FastifyRequest, FastifyReply} from "fastify"
import {createOrder} from "@composition/container";

export class OrdersController {
    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {customerId, orderId} = request.body as any
            const out = await createOrder.execute({customerId, orderId});
            reply.code(201).send(out);
        } catch (error) {
            reply.status(400).send({error: error instanceof Error ? error.message : "Unknown error"});
        }
    }
}
