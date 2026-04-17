import { describe, it, expect, beforeEach } from 'vitest';
import { AddItemToOrder } from '@application/use-cases/AddItemToOrder';
import { CreateOrder } from '@application/use-cases/CreateOrder';
import { InMemoryOrderRepository } from '@infrastructure/persistence/InMemoryOrderRepository';
import { NoopEventBus } from '@infrastructure/messaging/NoopEventBus';

describe('AddItemToOrder — test de aceptación (in-memory)', () => {
  let repo: InMemoryOrderRepository;
  let eventBus: NoopEventBus;
  let createOrder: CreateOrder;
  let addItemToOrder: AddItemToOrder;

  beforeEach(async () => {
    repo = new InMemoryOrderRepository();
    eventBus = new NoopEventBus();
    createOrder = new CreateOrder(repo);
    addItemToOrder = new AddItemToOrder(repo, eventBus);

    // Pre-condición: el pedido existe
    await createOrder.execute({ orderId: 'order-1', customerId: 'customer-1', currency: 'EUR' });
  });

  it('añade un item a un pedido existente y devuelve éxito', async () => {
    const result = await addItemToOrder.execute({
      orderId: 'order-1',
      sku: 'SKU-001',
      productName: 'Camiseta',
      quantity: 2,
      unitPrice: 15,
      currency: 'EUR',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.data?.orderId).toBe('order-1');
    expect(result.data?.sku).toBe('SKU-001');
    expect(result.data?.quantity).toBe(2);
  });

  it('acumula cantidad en el pedido al añadir el mismo SKU dos veces', async () => {
    await addItemToOrder.execute({
      orderId: 'order-1', sku: 'SKU-001', productName: 'Camiseta',
      quantity: 2, unitPrice: 15, currency: 'EUR',
    });

    const result = await addItemToOrder.execute({
      orderId: 'order-1', sku: 'SKU-001', productName: 'Camiseta',
      quantity: 3, unitPrice: 15, currency: 'EUR',
    });

    expect(result.isSuccess).toBe(true);

    // El DTO devuelve la cantidad del item añadido en esta llamada (3).
    // La acumulación se verifica en la entidad persistida.
    const saved = await repo.findById('order-1');
    expect(saved!.getItems()[0].quantity.value).toBe(5);
  });

  it('añade varios SKUs distintos al mismo pedido', async () => {
    await addItemToOrder.execute({
      orderId: 'order-1', sku: 'SKU-001', productName: 'Camiseta',
      quantity: 1, unitPrice: 15, currency: 'EUR',
    });

    const result = await addItemToOrder.execute({
      orderId: 'order-1', sku: 'SKU-002', productName: 'Pantalón',
      quantity: 1, unitPrice: 30, currency: 'EUR',
    });

    expect(result.isSuccess).toBe(true);
  });

  it('devuelve error NOT_FOUND si el pedido no existe', async () => {
    const result = await addItemToOrder.execute({
      orderId: 'pedido-inexistente',
      sku: 'SKU-001', productName: 'Camiseta',
      quantity: 1, unitPrice: 15, currency: 'EUR',
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error?.type).toBe('NOT_FOUND_ERROR');
  });

  it('devuelve error CONFLICT si la moneda no coincide con la del pedido', async () => {
    const result = await addItemToOrder.execute({
      orderId: 'order-1',
      sku: 'SKU-001', productName: 'Camiseta',
      quantity: 1, unitPrice: 15, currency: 'USD',
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error?.type).toBe('CONFLICT_ERROR');
  });

  it('devuelve error VALIDATION si la cantidad es cero', async () => {
    const result = await addItemToOrder.execute({
      orderId: 'order-1',
      sku: 'SKU-001', productName: 'Camiseta',
      quantity: 0, unitPrice: 15, currency: 'EUR',
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error?.type).toBe('VALIDATION_ERROR');
  });

  it('persiste el item en el repositorio tras ejecutar el caso de uso', async () => {
    await addItemToOrder.execute({
      orderId: 'order-1', sku: 'SKU-001', productName: 'Camiseta',
      quantity: 2, unitPrice: 15, currency: 'EUR',
    });

    const saved = await repo.findById('order-1');
    expect(saved).not.toBeNull();
    expect(saved!.getItems()).toHaveLength(1);
    expect(saved!.getItems()[0].sku.value).toBe('SKU-001');
  });
});
