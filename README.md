Client Base Back
# ClientBase Backend - API REST

Backend del sistema de gestión de clientes desarrollado con Node.js, Express, TypeScript y Prisma ORM.

## 🚀 Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Tokens)
- **Encriptación:** bcrypt
- **Validación:** Custom validators
- **Upload:** Multer
- **Excel/CSV:** xlsx

## 📁 Estructura del Proyecto

```
ClientBaseBack/
├── prisma/
│   ├── schema.prisma          # Schema de Prisma con modelos
│   ├── seed.ts                # Datos iniciales
│   └── migrations/            # Migraciones de base de datos
├── src/
│   ├── config/
│   │   └── database.ts        # Configuración de Prisma
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── client.controller.ts
│   │   ├── provider.controller.ts
│   │   ├── import.controller.ts
│   │   └── export.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── upload.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── client.routes.ts
│   │   ├── provider.routes.ts
│   │   ├── import.routes.ts
│   │   ├── export.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── client.service.ts
│   │   ├── provider.service.ts
│   │   ├── import.service.ts
│   │   └── export.service.ts
│   ├── types/
│   │   └── express.ts
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── jwt.ts
│   │   └── validation.ts
│   └── index.ts               # Punto de entrada
├── uploads/                   # Archivos temporales de importación
├── .env                       # Variables de entorno
├── .env.example              # Ejemplo de variables
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 📊 Modelos de Base de Datos

### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  name: string?
  role: UserRole (ADMIN | USER)
  avatar: string?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Client
```typescript
{
  id: string (UUID)
  name: string
  email: string (unique)
  phone: string?
  company: string?
  status: ClientStatus (ACTIVE | INACTIVE)
  providerId: string
  provider: Provider
  price: float
  date: DateTime
  address: string?
  city: string?
  country: string?
  notes: string?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Provider
```typescript
{
  id: string (UUID)
  name: string (unique)
  clients: Client[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
cd ClientBaseBack
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y configura tus variables:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/clientbase?schema=public"
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Configurar PostgreSQL
Asegúrate de tener PostgreSQL instalado y crea la base de datos:

```bash
# Desde psql o pgAdmin
CREATE DATABASE clientbase;
```

### 5. Ejecutar migraciones
```bash
npm run prisma:migrate
```

### 6. Generar cliente de Prisma
```bash
npm run prisma:generate
```

### 7. Seed de datos iniciales (opcional)
```bash
npm run prisma:seed
```

Esto creará:
- 2 usuarios (admin y user)
- 7 proveedores
- 22 clientes de ejemplo

### 8. Iniciar servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

## 📡 Endpoints de la API

### Base URL
```
http://localhost:5000/api
```

### 🔐 Autenticación

#### POST `/auth/register`
Registrar nuevo usuario
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nombre Usuario",
    "role": "USER",
    "avatar": null
  }
}
```

#### POST `/auth/login`
Iniciar sesión
```json
{
  "email": "admin@clientbase.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@clientbase.com",
    "name": "Administrador",
    "role": "ADMIN",
    "avatar": null
  }
}
```

#### GET `/auth/profile`
Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT `/auth/profile`
Actualizar perfil
```json
{
  "name": "Nuevo Nombre",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 👥 Clientes

#### GET `/clients`
Listar clientes con paginación y filtros

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (buscar en nombre, email, teléfono, empresa)
- `status` (ACTIVE | INACTIVE)
- `providerId` (UUID del proveedor)
- `minPrice` (número)
- `maxPrice` (número)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)

**Ejemplo:**
```
GET /clients?page=1&limit=10&search=tech&status=ACTIVE
```

**Respuesta:**
```json
{
  "clients": [...],
  "pagination": {
    "total": 22,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### GET `/clients/:id`
Obtener cliente por ID

#### POST `/clients`
Crear nuevo cliente
```json
{
  "name": "TechCorp Solutions",
  "email": "contact@techcorp.com",
  "phone": "+1-555-0101",
  "company": "TechCorp Inc.",
  "status": "ACTIVE",
  "providerId": "uuid-del-proveedor",
  "price": 15000,
  "date": "2025-10-29T00:00:00.000Z",
  "address": "123 Tech Street",
  "city": "San Francisco",
  "country": "USA",
  "notes": "Cliente importante"
}
```

#### PUT `/clients/:id`
Actualizar cliente
```json
{
  "name": "Nuevo Nombre",
  "status": "INACTIVE",
  "price": 20000
}
```

#### DELETE `/clients/:id`
Eliminar cliente

#### POST `/clients/delete-multiple`
Eliminar múltiples clientes
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

### 🏢 Proveedores

#### GET `/providers`
Listar todos los proveedores

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "name": "TechCorp",
    "createdAt": "2025-10-29T...",
    "updatedAt": "2025-10-29T...",
    "_count": {
      "clients": 5
    }
  }
]
```

#### GET `/providers/:id`
Obtener proveedor por ID (incluye clientes)

#### POST `/providers`
Crear proveedor (solo ADMIN)
```json
{
  "name": "Nuevo Proveedor"
}
```

#### PUT `/providers/:id`
Actualizar proveedor (solo ADMIN)
```json
{
  "name": "Nombre Actualizado"
}
```

#### DELETE `/providers/:id`
Eliminar proveedor (solo ADMIN)

### 📥 Importación

#### POST `/import`
Importar clientes desde Excel o CSV

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Body:**
- `file`: Archivo Excel (.xlsx, .xls) o CSV (.csv)

**Formato del archivo Excel/CSV:**
| name | email | phone | company | status | provider | price | date | address | city | country | notes |
|------|-------|-------|---------|--------|----------|-------|------|---------|------|---------|-------|

**Respuesta:**
```json
{
  "message": "Importación completada",
  "success": 18,
  "errors": [
    {
      "row": 5,
      "error": "El email ya está registrado",
      "data": {...}
    }
  ],
  "total": 20
}
```

### 📤 Exportación

#### GET `/export`
Exportar clientes a Excel, CSV o PDF

**Query Parameters:**
- `format` (excel | csv | pdf) - default: excel
- Filtros (mismos que `/clients`)

**Ejemplo:**
```
GET /export?format=excel&status=ACTIVE&providerId=uuid
```

**Respuesta:** Archivo descargable

## 🔒 Autenticación y Autorización

### JWT Token
Todos los endpoints (excepto `/auth/register` y `/auth/login`) requieren autenticación mediante JWT.

**Header requerido:**
```
Authorization: Bearer {token}
```

### Roles
- **ADMIN:** Acceso completo, puede crear/editar/eliminar proveedores
- **USER:** Puede gestionar clientes, ver proveedores

## 🛡️ Seguridad

- **Contraseñas:** Hasheadas con bcrypt (10 salt rounds)
- **JWT:** Tokens firmados con secret key
- **Validación:** Validación de email y contraseñas
- **CORS:** Configurado para frontend específico
- **Rate Limiting:** Recomendado para producción
- **SQL Injection:** Protección mediante Prisma ORM

## 📝 Scripts Disponibles

```bash
npm run dev              # Desarrollo con nodemon
npm run build            # Compilar TypeScript a JavaScript
npm start                # Ejecutar en producción
npm run prisma:generate  # Generar cliente de Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (GUI)
npm run prisma:seed      # Ejecutar seed de datos
```

## 🧪 Datos de Prueba

Después de ejecutar `npm run prisma:seed`:

**Usuario Admin:**
- Email: `admin@clientbase.com`
- Password: `admin123`

**Usuario Normal:**
- Email: `user@clientbase.com`
- Password: `user123`

**Clientes:** 22 clientes de ejemplo
**Proveedores:** 7 proveedores

## 🚀 Despliegue

### Variables de Entorno en Producción

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="clave-super-secreta-aleatoria"
FRONTEND_URL="https://tu-frontend.com"
PORT=5000
```

### Recomendaciones
1. Usar variables de entorno seguras
2. Configurar HTTPS
3. Implementar rate limiting
4. Configurar logs
5. Usar base de datos en la nube (Railway, Supabase, etc.)
6. Implementar monitoreo (Sentry, etc.)

## 📚 Tecnologías Adicionales Sugeridas

Para mejorar el proyecto:
- **Validación:** class-validator, Joi, Zod
- **Rate Limiting:** express-rate-limit
- **Logging:** Winston, Morgan
- **Testing:** Jest, Supertest
- **Documentation:** Swagger/OpenAPI
- **Email:** Nodemailer (para forgot password)
- **PDF Generation:** puppeteer, pdfkit

## 🔄 Flujo de Autenticación

1. Usuario envía credenciales a `/auth/login`
2. Backend valida y genera JWT
3. Frontend guarda token (localStorage/sessionStorage)
4. Frontend envía token en header `Authorization`
5. Middleware valida token en cada request
6. Request procede si token es válido

## 📊 Estructura de Respuestas

### Éxito
```json
{
  "data": {...},
  "message": "Operación exitosa"
}
```

### Error
```json
{
  "error": "Mensaje de error descriptivo"
}
```

## 🤝 Integración con Frontend

### Ejemplo de fetch desde React:

```typescript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/clients', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

**Desarrollado con Node.js + Express + TypeScript + Prisma**
**Base de datos PostgreSQL**
