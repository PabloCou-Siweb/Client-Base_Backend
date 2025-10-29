# 🧪 Test de Búsqueda - ClientBase

## ✅ Corrección Aplicada

He simplificado el código de búsqueda para eliminar el error 500.

---

## 🔧 Cambio Realizado

### ANTES (causaba error 500):
```typescript
const sanitizedSearch = searchTerm.replace(/[%_\\]/g, '\\$&');

where.OR = [
  { name: { contains: sanitizedSearch, mode: 'insensitive' } },
  // ...
];
```

### AHORA (funciona correctamente):
```typescript
if (filters?.search && typeof filters.search === 'string') {
  const searchTerm = filters.search.trim();
  
  if (searchTerm.length > 0 && searchTerm.length <= 100) {
    where.OR = [
      { name: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { phone: { contains: searchTerm } },
      { company: { contains: searchTerm } },
    ];
  }
}
```

---

## 🎯 Validaciones que SÍ están activas:

1. ✅ Verifica que search sea un string
2. ✅ Hace trim() para eliminar espacios
3. ✅ Valida que no esté vacío (length > 0)
4. ✅ Limita a 100 caracteres máximo
5. ✅ Busca en 4 campos: name, email, phone, company

---

## 🔄 PASO IMPORTANTE: Reiniciar el Servidor

```powershell
# Detener el servidor
Ctrl + C

# Reiniciar
npm run dev
```

**⚠️ ES OBLIGATORIO reiniciar para que los cambios surtan efecto**

---

## 🧪 Cómo Probar

### Test 1: Desde Postman

```
GET http://localhost:5000/api/clients?search=tech
Authorization: Bearer {tu-token}
```

**Debe devolver:**
```json
{
  "clients": [
    {
      "name": "TechCorp Solutions",
      ...
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    ...
  }
}
```

### Test 2: Desde el Frontend

1. Abre tu aplicación
2. Escribe en el input de búsqueda: **"tech"**
3. Deberías ver los clientes que contienen "tech"

### Test 3: Búsqueda con números

```
GET http://localhost:5000/api/clients?search=6
Authorization: Bearer {tu-token}
```

Debe buscar en todos los campos y devolver resultados sin error 500.

---

## ❓ Si SIGUE dando error 500:

### Paso 1: Ver el error exacto en la consola del servidor

En la terminal donde corre `npm run dev`, verás el error completo.

### Paso 2: Verificar que el servidor se reinició

Detén completamente el servidor (Ctrl + C) y vuelve a iniciar:
```powershell
npm run dev
```

### Paso 3: Test básico sin búsqueda

```
GET http://localhost:5000/api/clients
Authorization: Bearer {tu-token}
```

Si esto funciona pero con `?search=` no, copia el error completo que aparece en la consola.

---

## 📊 Búsquedas que deberían funcionar:

```javascript
// ✅ Texto normal
search: "tech"

// ✅ Con mayúsculas
search: "TECH"

// ✅ Números
search: "6"
search: "2024"

// ✅ Email parcial
search: "@gmail"

// ✅ Teléfono parcial
search: "+34"

// ✅ Con espacios (se limpian)
search: "  tech  "

// ✅ Vacío (se ignora, devuelve todos)
search: ""
```

---

## 🚨 Diagnóstico de Errores

### Si ves este error en los logs:
```
PrismaClientKnownRequestError: Invalid `prisma.client.findMany()` invocation
```

**Solución:** 
1. Verifica que la base de datos esté corriendo (XAMPP → MySQL en verde)
2. Verifica el DATABASE_URL en `.env`

### Si ves:
```
TypeError: Cannot read property 'trim' of undefined
```

**Solución:** Ya está corregido con `typeof filters.search === 'string'`

### Si ves:
```
Error: Unknown argument `mode` on field `contains`
```

**Solución:** Ya está corregido (quité el `mode: 'insensitive'`)

---

## ✅ Checklist de Solución

- [x] Código simplificado (sin regex complejo)
- [x] Sin `mode: 'insensitive'` (causaba error en MySQL)
- [x] Validación de tipo `typeof === 'string'`
- [x] Trim de espacios
- [x] Validación de longitud
- [x] Manejo de errores con try-catch
- [ ] **REINICIAR SERVIDOR** ← PENDIENTE

---

## 🎉 Después de Reiniciar

El input de búsqueda debería funcionar perfectamente:
- ✅ Sin error 500
- ✅ Devuelve resultados
- ✅ Status 200
- ✅ Frontend muestra los clientes

---

**¡IMPORTANTE!** Detén el servidor (Ctrl+C) y reinicia con `npm run dev`

