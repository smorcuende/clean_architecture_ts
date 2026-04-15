import {InMemoryOrderRepository} from "../infrastructure/persistence/InMemoryOrderRepository";
import {CreateOrder} from "../application/use-cases/CreateOrder"

const orderRepository = new InMemoryOrderRepository()
export const createOrder = new CreateOrder(orderRepository)
