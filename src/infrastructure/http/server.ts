import Fastify from "fastify";
import {OrdersController} from "./OrdersController";

export async function buildServer() {
    const app = Fastify();
    const ordersController = new OrdersController();
    app.post("/orders", (request, reply) => ordersController.create(request, reply));
    return app;
}
