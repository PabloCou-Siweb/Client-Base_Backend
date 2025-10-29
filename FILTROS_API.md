# 🔍 Guía de Filtros de la API - ClientBase

## ✅ Correcciones Aplicadas en el Backend

El backend ahora maneja correctamente todos los filtros que envía el frontend.

---

## 📡 Endpoint: GET /api/clients

### Query Parameters Soportados

#### 1. **Paginación**
```
page=1           # Número de página (default: 1)
limit=10         # Clientes por página (default: 10)
```

#### 2. **Búsqueda General**
```
search=tech      # Busca en: nombre, email, teléfono, empresa
```

#### 3. **Filtro por Estado** ✅ CORREGIDO
```
status=active    # Acepta: active, ACTIVE, inactive, INACTIVE
status=inactive
```

**Conversión automática:**
- `"active"` → `"ACTIVE"`
- `"inactive"` → `"INACTIVE"`

#### 4. **Filtro por Precio** ✅ FUNCIONA
```
minPrice=1000    # Precio mínimo
maxPrice=5000    # Precio máximo
```

**Ejemplo:**
```
GET /api/clients?minPrice=1000&maxPrice=5000
```
Devuelve clientes con precio entre 1,000 y 5,000

#### 5. **Filtro por Proveedores** ✅ NUEVO - SOPORTADO
```
providerNames=["TechCorp","CloudWave"]
```

**Formato JSON (URL encoded):**
```
providerNames=%5B%22TechCorp%22%2C%22CloudWave%22%5D
```

**El backend:**
1. Recibe el array de nombres
2. Busca los proveedores por nombre
3. Obtiene sus IDs
4. Filtra clientes por esos IDs

#### 6. **Filtro por Fechas** ✅ FUNCIONA
```
startDate=2025-01-01   # Fecha inicio (ISO 8601)
endDate=2025-12-31     # Fecha fin (ISO 8601)
```

**Ejemplo:**
```
GET /api/clients?startDate=2025-01-01&endDate=2025-12-31
```

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Solo estado
```
GET /api/clients?status=active
```

### Ejemplo 2: Estado + Precio
```
GET /api/clients?status=active&minPrice=2000&maxPrice=5000
```

### Ejemplo 3: Proveedores específicos
```javascript
// Desde JavaScript
const providers = ['TechCorp', 'CloudWave', 'NextGen Systems'];
const params = new URLSearchParams({
  providerNames: JSON.stringify(providers)
});

fetch(`http://localhost:5000/api/clients?${params}`);
```

### Ejemplo 4: Filtros combinados
```
GET /api/clients?
  page=1&
  limit=10&
  status=active&
  minPrice=1000&
  maxPrice=10000&
  startDate=2025-01-01&
  endDate=2025-12-31&
  providerNames=["TechCorp","CloudWave"]
```

---

## 📝 Formato de Respuesta

```json
{
  "clients": [
    {
      "id": "uuid",
      "name": "TechCorp Solutions",
      "email": "contact@techcorp.com",
      "phone": "+34 952 88 62 30",
      "company": "TechCorp Solutions",
      "status": "ACTIVE",
      "providerId": "provider-uuid",
      "provider": {
        "id": "provider-uuid",
        "name": "TechCorp"
      },
      "price": 1000,
      "date": "2025-02-01T00:00:00.000Z",
      "address": "123 Tech Street",
      "city": "San Francisco",
      "country": "USA",
      "notes": null,
      "createdAt": "2025-01-29T...",
      "updatedAt": "2025-01-29T..."
    }
  ],
  "pagination": {
    "total": 23,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 🔧 Código Frontend Recomendado

### Servicio de Clientes (TypeScript)

```typescript
interface ClientFilters {
  search?: string;
  status?: 'active' | 'inactive';
  providers?: string[];  // Array de nombres
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;    // ISO 8601: "2025-01-01"
  endDate?: string;
}

async function getClients(
  page: number = 1,
  limit: number = 10,
  filters?: ClientFilters
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.search) {
    params.append('search', filters.search);
  }

  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (filters?.providers && filters.providers.length > 0) {
    params.append('providerNames', JSON.stringify(filters.providers));
  }

  if (filters?.minPrice !== undefined) {
    params.append('minPrice', filters.minPrice.toString());
  }

  if (filters?.maxPrice !== undefined) {
    params.append('maxPrice', filters.maxPrice.toString());
  }

  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }

  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }

  const response = await fetch(
    `http://localhost:5000/api/clients?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  return response.json();
}
```

---

## ✅ Checklist de Filtros

- [x] **Estado** - Conversión automática a mayúsculas
- [x] **Precio** - Rangos min/max
- [x] **Proveedores** - Por nombres (array)
- [x] **Fechas** - Rangos startDate/endDate
- [x] **Búsqueda** - En múltiples campos
- [x] **Paginación** - page + limit

---

## 🚨 Notas Importantes

### 1. Estado (status)
- ✅ Acepta: `"active"`, `"ACTIVE"`, `"inactive"`, `"INACTIVE"`
- ✅ Se convierte automáticamente a mayúsculas
- ❌ Si envías otro valor, se ignora

### 2. Proveedores (providerNames)
- ✅ Debe ser un **array JSON stringificado**
- ✅ Ejemplo: `["TechCorp", "CloudWave"]`
- ✅ Los nombres deben coincidir exactamente con la BD
- ❌ Si un proveedor no existe, simplemente no se filtra por él

### 3. Precios
- ✅ Acepta números decimales
- ✅ Puedes usar solo `minPrice`, solo `maxPrice`, o ambos
- ✅ Si el frontend envía en miles, multiplica antes de enviar

### 4. Fechas
- ✅ Formato ISO 8601: `"YYYY-MM-DD"`
- ✅ Ejemplo: `"2025-01-29"`
- ✅ También acepta formato completo: `"2025-01-29T00:00:00.000Z"`

---

## 🧪 Tests en Postman

### Test 1: Filtro por Estado
```
GET http://localhost:5000/api/clients?status=active
Authorization: Bearer {token}
```

### Test 2: Filtro por Precio
```
GET http://localhost:5000/api/clients?minPrice=1000&maxPrice=5000
Authorization: Bearer {token}
```

### Test 3: Filtro por Proveedores
```
GET http://localhost:5000/api/clients?providerNames=["TechCorp","CloudWave"]
Authorization: Bearer {token}
```

### Test 4: Todo combinado
```
GET http://localhost:5000/api/clients?status=active&minPrice=2000&maxPrice=6000&providerNames=["TechCorp"]
Authorization: Bearer {token}
```

---

## 🎉 Resumen

**Todos los filtros funcionan correctamente:**
- ✅ Estado (con conversión automática)
- ✅ Precio (rangos)
- ✅ Proveedores (por nombres)
- ✅ Fechas (rangos)
- ✅ Búsqueda general
- ✅ Paginación

**El frontend puede enviar:**
```javascript
{
  status: 'active',  // minúsculas OK ✓
  providers: ['TechCorp', 'CloudWave'],  // nombres directos ✓
  minPrice: 1000,
  maxPrice: 5000,
  startDate: '2025-01-01',
  endDate: '2025-12-31'
}
```

---

¡Ya no habrá errores de filtros! 🎊

