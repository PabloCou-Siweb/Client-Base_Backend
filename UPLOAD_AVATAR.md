# 📸 Upload de Avatar - ClientBase Backend

## ✅ Endpoint Implementado

El endpoint para subir foto de perfil está completamente funcional.

---

## 📡 Endpoint

### POST `/api/auth/upload-avatar`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
avatar: [archivo de imagen]
```

**Validaciones:**
- ✅ Tamaño máximo: **2 MB**
- ✅ Formatos aceptados: **jpg, jpeg, png, gif, webp**
- ✅ Requiere autenticación (JWT)

**Response (200 OK):**
```json
{
  "message": "Avatar actualizado correctamente",
  "avatarUrl": "/uploads/avatars/avatar-1738234567890-123456789.jpg",
  "user": {
    "id": "uuid",
    "email": "admin@clientbase.com",
    "name": "Administrador",
    "role": "ADMIN",
    "avatar": "/uploads/avatars/avatar-1738234567890-123456789.jpg",
    "updatedAt": "2025-01-29T..."
  }
}
```

**Errores:**
```json
// 400 Bad Request - No se envió imagen
{
  "error": "No se ha proporcionado ninguna imagen"
}

// 400 Bad Request - Formato inválido
{
  "error": "Solo se permiten imágenes (jpg, jpeg, png, gif, webp)"
}

// 400 Bad Request - Archivo muy grande
{
  "error": "File too large"
}

// 401 Unauthorized
{
  "error": "No autenticado"
}
```

---

## 🗂️ Dónde se Guardan las Imágenes

**Carpeta:** `uploads/avatars/`

**Nombre del archivo:** `avatar-{timestamp}-{random}.{ext}`

**Ejemplo:** `avatar-1738234567890-123456789.jpg`

---

## 🌐 URL de Acceso a las Imágenes

Las imágenes se sirven como archivos estáticos en:

```
http://localhost:5000/uploads/avatars/avatar-123456789.jpg
```

**Configuración en el servidor:**
```typescript
// src/index.ts
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

---

## 🧪 Probar en Postman

### Paso 1: Preparar una imagen
- Busca cualquier imagen .jpg, .png en tu PC
- Debe ser menor a 2 MB

### Paso 2: Hacer Login
```
POST http://localhost:5000/api/auth/login

{
  "email": "admin@clientbase.com",
  "password": "admin123"
}
```

Guarda el **token**.

### Paso 3: Upload Avatar

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/upload-avatar`
3. **Headers:**
   - `Authorization: Bearer {token}`
4. **Body:**
   - Selecciona **"form-data"** (no raw, no JSON)
   - Key: `avatar` (tipo: **File**)
   - Value: Click en "Select Files" → Selecciona tu imagen
5. **Send**

**Response esperada:**
```json
{
  "message": "Avatar actualizado correctamente",
  "avatarUrl": "/uploads/avatars/avatar-1738234567890-123456789.jpg",
  "user": {
    "avatar": "/uploads/avatars/avatar-1738234567890-123456789.jpg"
  }
}
```

### Paso 4: Ver la imagen

Copia el `avatarUrl` y ábrelo en el navegador:
```
http://localhost:5000/uploads/avatars/avatar-1738234567890-123456789.jpg
```

Deberías ver tu imagen ✅

---

## 💻 Uso desde el Frontend

### Con Fetch:

```javascript
const uploadAvatar = async (file) => {
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // ⚠️ NO incluir Content-Type, se añade automáticamente
    },
    body: formData
  });
  
  const result = await response.json();
  
  if (response.ok) {
    console.log('Avatar URL:', result.avatarUrl);
    
    // Actualizar estado/contexto
    setUser(result.user);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    return result.avatarUrl;
  } else {
    throw new Error(result.error);
  }
};
```

### En un componente React:

```typescript
const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  if (!file) return;
  
  // Validar tamaño en frontend también
  if (file.size > 2 * 1024 * 1024) {
    alert('La imagen no debe superar 2 MB');
    return;
  }
  
  // Validar formato
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('Solo se permiten imágenes JPG, PNG, GIF o WebP');
    return;
  }
  
  try {
    setUploading(true);
    const avatarUrl = await uploadAvatar(file);
    console.log('Avatar subido:', avatarUrl);
  } catch (error) {
    alert(error.message);
  } finally {
    setUploading(false);
  }
};

// JSX:
<input
  type="file"
  accept="image/*"
  onChange={handleAvatarChange}
  disabled={uploading}
/>

{uploading && <span>Subiendo imagen...</span>}
```

---

## 🎨 Mostrar el Avatar

Una vez subido, puedes mostrarlo así:

```typescript
const user = JSON.parse(localStorage.getItem('user'));

// URL completa
const avatarUrl = `http://localhost:5000${user.avatar}`;

// En JSX:
<img 
  src={avatarUrl} 
  alt="Avatar" 
  style={{ width: 100, height: 100, borderRadius: '50%' }}
/>
```

---

## 📁 Estructura de Archivos

```
ClientBaseBack/
├── uploads/
│   └── avatars/
│       ├── avatar-1738234567890-123456789.jpg  ← Subido por usuario 1
│       ├── avatar-1738234567891-987654321.png  ← Subido por usuario 2
│       └── ...
```

---

## 🔒 Seguridad Implementada

- ✅ Solo imágenes permitidas (.jpg, .jpeg, .png, .gif, .webp)
- ✅ Tamaño máximo 2 MB
- ✅ Nombres únicos (timestamp + random)
- ✅ Requiere autenticación JWT
- ✅ Carpeta uploads separada de src

---

## 🚀 Para Aplicar

```powershell
# Reiniciar servidor
Ctrl + C
npm run dev
```

---

## ✅ Checklist

- [x] Middleware de avatar creado
- [x] Validación de formato de imagen
- [x] Validación de tamaño (2 MB)
- [x] Servicio de upload implementado
- [x] Controlador creado
- [x] Ruta configurada
- [x] Archivos estáticos configurados
- [x] URL accesible desde navegador

---

¡El upload de avatar está 100% funcional! 📸

