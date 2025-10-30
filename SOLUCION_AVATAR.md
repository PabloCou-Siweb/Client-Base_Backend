# 🔧 Solución: Avatar no se Muestra

## ✅ Cambios Aplicados

He corregido el problema para que las imágenes se muestren correctamente.

---

## 🔧 Modificaciones Realizadas

### 1. **Ruta de archivos estáticos mejorada**
```typescript
// src/index.ts
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
```
Ahora usa `process.cwd()` en lugar de `__dirname` para mayor compatibilidad.

### 2. **URL completa en la base de datos**
```typescript
// src/services/auth.service.ts
const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;
```

Ahora guarda la URL completa: `http://localhost:5000/uploads/avatars/avatar-123.jpg`

---

## ⚙️ Configurar Variable de Entorno

Agrega al archivo `.env`:

```env
BACKEND_URL=http://localhost:5000
```

Tu `.env` completo debería verse así:

```env
DATABASE_URL="mysql://root@localhost:3306/clientbase"

PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

JWT_SECRET=tu-clave-secreta-muy-segura-cambiala-en-produccion
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

---

## 🧪 Verificar que Funciona

### Paso 1: Reiniciar el servidor
```powershell
Ctrl + C
npm run dev
```

### Paso 2: Subir una imagen en Postman

```
POST http://localhost:5000/api/auth/upload-avatar
Authorization: Bearer {token}
Body: form-data
  avatar: [selecciona una imagen]
```

**Response esperada:**
```json
{
  "message": "Avatar actualizado correctamente",
  "avatarUrl": "http://localhost:5000/uploads/avatars/avatar-1738234567890-123456789.jpg",
  "user": {
    "avatar": "http://localhost:5000/uploads/avatars/avatar-1738234567890-123456789.jpg"
  }
}
```

### Paso 3: Copiar la URL del avatar

Copia el `avatarUrl` de la respuesta.

### Paso 4: Abrir en el navegador

Pega la URL en tu navegador:
```
http://localhost:5000/uploads/avatars/avatar-1738234567890-123456789.jpg
```

**Deberías ver tu imagen** ✅

---

## 🎨 Mostrar en el Frontend

Ahora el usuario tiene la URL completa guardada, solo debes usarla directamente:

```typescript
const user = JSON.parse(localStorage.getItem('user'));

// La URL ya es completa, úsala directamente
<img 
  src={user.avatar} 
  alt="Avatar"
  style={{ width: 100, height: 100, borderRadius: '50%' }}
/>

// O con validación:
{user.avatar ? (
  <img src={user.avatar} alt="Avatar" />
) : (
  <div className="avatar-placeholder">
    {user.name?.charAt(0).toUpperCase()}
  </div>
)}
```

**NO necesitas construir la URL**, ya viene completa del backend.

---

## 🚨 Troubleshooting

### Problema 1: Imagen no se muestra en el navegador

**Test directo:**
```
http://localhost:5000/uploads/avatars/nombre-de-tu-archivo.jpg
```

Si NO se ve:
- Verifica que la carpeta `uploads/avatars/` existe
- Verifica que el archivo esté ahí
- Reinicia el servidor

### Problema 2: Error de CORS

Si ves error de CORS en la consola del frontend:

Ya está configurado en `src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

Pero los archivos estáticos también necesitan CORS. Esto ya está incluido automáticamente.

### Problema 3: La carpeta no existe

La carpeta se crea automáticamente al subir el primer avatar, pero puedes crearla manualmente:

```powershell
mkdir -p uploads\avatars
```

---

## 📊 Estructura Esperada

```
ClientBaseBack/
├── uploads/
│   └── avatars/
│       ├── avatar-1738234567890-123456789.jpg
│       ├── avatar-1738234567891-987654321.png
│       └── ...
```

**URLs accesibles:**
```
http://localhost:5000/uploads/avatars/avatar-1738234567890-123456789.jpg
http://localhost:5000/uploads/avatars/avatar-1738234567891-987654321.png
```

---

## ✅ Checklist de Solución

- [x] Archivos estáticos configurados con `process.cwd()`
- [x] URL completa guardada en BD
- [x] Variable BACKEND_URL configurada
- [x] CORS habilitado
- [x] Carpeta uploads/avatars se crea automáticamente
- [ ] **Reiniciar servidor** ← Pendiente
- [ ] **Agregar BACKEND_URL al .env** ← Importante

---

## 🔄 Pasos Finales:

1. **Edita el archivo `.env`** y agrega:
   ```env
   BACKEND_URL=http://localhost:5000
   ```

2. **Reinicia el servidor:**
   ```powershell
   Ctrl + C
   npm run dev
   ```

3. **Sube una imagen de nuevo** (en Postman o frontend)

4. **La URL ahora será completa:** `http://localhost:5000/uploads/avatars/...`

5. **En el frontend, úsala directamente:**
   ```jsx
   <img src={user.avatar} alt="Avatar" />
   ```

---

**Agrega `BACKEND_URL=http://localhost:5000` al `.env` y reinicia el servidor** 🚀
