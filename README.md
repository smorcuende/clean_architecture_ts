# Clean Architecture TypeScript

Un proyecto de ejemplo implementando los principios de Clean Architecture en TypeScript.

El ejemplo en concreto es un **Servicio de Pedidos** donde puedes:
- ✅ Crear pedidos (POST `/orders`)
- 📊 Calcular el total con reglas de negocio
- 🎯 Emitir eventos de dominio

## 📁 Estructura del Proyecto

```
src/
├── application/          # Casos de uso y puertos
│   ├── ports/           # Interfaces (OrderRepository)
│   └── use-cases/       # CreateOrder
├── domain/              # Lógica de negocio
│   ├── entities/        # Order
│   ├── events/          # DomainEvent
│   └── value-objects/   # Price
├── infrastructure/      # Implementaciones externas
│   ├── http/            # API REST (Fastify)
│   │   ├── server.ts
│   │   └── OrdersController.ts
│   └── persistence/     # InMemoryOrderRepository
├── composition/         # Inyección de dependencias
├── shared/              # Utilitarios compartidos
└── config/              # Configuración

tests/                   # Tests con Vitest
main.ts                 # Punto de entrada
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor en desarrollo (puerto 3000)
npm run dev

# Ejecutar tests
npm run test
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

**Response (201):**
```json
{
  "orderId": "123"
}
```

## 🐳 Docker

```bash
docker build -t clean-architecture-ts .
docker run -p 3000:3000 clean-architecture-ts
```

## 🧪 Testing

```bash
npm run test
```

## 📚 Conceptos

- **Domain**: Lógica de negocio pura
- **Application**: Casos de uso que orquestan el dominio
- **Infrastructure**: Implementaciones técnicas (BD, HTTP, etc.)
- **Ports**: Interfaces que definen contratos
- **Adapters**: Implementaciones concretas de los puertos

## 🏗️ Stack

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework HTTP**: Fastify
- **Testing**: Vitest
- **Ejecución**: tsx
docker build -t clean_architecture_ts .

# Ejecutar contenedor
docker run -p 3000:3000 clean_architecture_ts
```

## 🧪 Testing

```bash
npm run test
```

## 📋 Dependencias Principales

- **TypeScript**: Tipado estático
- **tsx**: Ejecutor de TypeScript
- **vitest**: Framework de testing

## 📝 Licencia

ISC

## 👨‍💻 Autor

[Tu nombre]

## 📖 Referencias

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
