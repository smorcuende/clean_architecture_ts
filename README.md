# Clean Architecture TypeScript

Proyecto de ejemplo que implementa los principios de Clean Architecture en TypeScript.

El dominio es un **Servicio de Pedidos** donde puedes crear pedidos, añadir items con precios y emitir eventos de dominio.

## 🏗️ Stack

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework HTTP**: Fastify
- **Testing**: Vitest
- **Ejecución**: tsx

## 📁 Estructura del Proyecto

```
src/
├── domain/              # Lógica de negocio pura (entidades, value objects, eventos)
│   ├── entities/
│   ├── events/
│   └── value-objects/
├── application/         # Casos de uso, puertos y DTOs
│   ├── dto/
│   ├── ports/
│   ├── use-cases/
│   └── errors.ts
├── infrastructure/      # Implementaciones técnicas (persistencia, HTTP, mensajería)
│   ├── adapters/
│   ├── http/
│   │   └── controllers/
│   ├── messaging/
│   └── persistence/
├── composition/         # Composition root — inyección de dependencias
├── shared/              # Utilitarios compartidos
└── config/

tests/
├── domain/              # Tests unitarios de dominio
└── application/         # Tests de aceptación con adaptadores en memoria
main.ts
```

## 🚀 Instalación y arranque

```bash
# Instalar dependencias
npm install

# Ejecutar servidor en desarrollo (puerto 3000)
npm run dev

# Ejecutar tests
npm run test
```

## 🐳 Docker

```bash
docker build -t clean-architecture-ts .
docker run -p 3000:3000 clean-architecture-ts
```

## 📡 API

### Crear Pedido

**POST** `http://localhost:3000/orders`

**Body:**
```json
{
  "orderId": "123",
  "customerId": "customer-1"
}
```

**curl:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId": "123", "customerId": "customer-1"}'
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "123"
  }
}
```

---

### Añadir Item a un Pedido

**POST** `http://localhost:3000/orders/:orderId/items`

**Body:**
```json
{
  "sku": "SKU-001",
  "productName": "Producto de ejemplo",
  "quantity": 2,
  "unitPrice": 9.99,
  "currency": "EUR"
}
```

**curl:**
```bash
curl -X POST http://localhost:3000/orders/123/items \
  -H "Content-Type: application/json" \
  -d '{"sku": "SKU-001", "productName": "Producto de ejemplo", "quantity": 2, "unitPrice": 9.99, "currency": "EUR"}'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "123",
    "total": 19.98
  }
}
```

## 🧪 Testing

```bash
npm run test
```

### Estructura de tests

```
tests/
├── domain/
│   ├── Price.spec.ts          # Tests unitarios del value object Price
│   └── Order.spec.ts          # Tests unitarios del aggregate Order
└── application/
    └── AddItemToOrder.spec.ts # Test de aceptación del caso de uso
```

### Tests de dominio

#### `Price.spec.ts`
Cubre las invariantes del value object `Price`:
- Creación válida con importe y moneda (`EUR` / `USD`)
- Importe cero permitido
- Redondeo automático a 2 decimales
- Rechazo de importes negativos, `NaN` e `Infinity`

#### `Order.spec.ts`
Cubre el aggregate root `Order` sin ninguna dependencia externa:
- Factory `Order.create`: estado inicial `PENDING`, evento `OrderCreated`, validaciones de ID
- `addItem`: añade items, acumula cantidad si el SKU ya existe, emite `ItemAddedToOrder`
- `calculateTotal`: suma subtotales correctamente, lanza error si no hay items
- `getDomainEvents` / `clearDomainEvents`: los eventos se vacían tras consumirlos

### Test de aceptación

#### `AddItemToOrder.spec.ts`
Ejercita el caso de uso `AddItemToOrder` de extremo a extremo usando **únicamente adaptadores en memoria** (`InMemoryOrderRepository` + `NoopEventBus`), sin IO real:

| Escenario | Resultado esperado |
|---|---|
| Añadir item a pedido existente | `isSuccess: true`, datos del item en el output |
| Mismo SKU dos veces | Cantidad acumulada en el pedido persistido |
| Dos SKUs distintos | Ambos items en el pedido |
| Pedido inexistente | Error `NOT_FOUND_ERROR` |
| Moneda diferente a la del pedido | Error `CONFLICT_ERROR` |
| Cantidad = 0 | Error `VALIDATION_ERROR` |
| Persistencia tras el caso de uso | El repositorio refleja el item guardado |

## 📚 Conceptos clave

- **Domain**: Lógica de negocio pura, sin dependencias externas
- **Application**: Casos de uso que orquestan el dominio a través de puertos
- **Infrastructure**: Implementaciones concretas de los puertos (BD, HTTP, etc.)
- **Ports**: Interfaces que desacoplan el dominio de la infraestructura
- **Adapters**: Implementaciones concretas de los puertos
- **Composition Root**: Único punto donde se ensamblan las dependencias

## 📖 Referencias

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 👨‍💻 Autor

Susana Morcuende
