# E-Commerce Backend API

Dokumentasi API untuk E-Commerce Backend Project.

---

## 📋 Daftar API Endpoints

### 1. User Controller (`/user`)

| Method | Endpoint | Deskripsi | Auth | Status |
|--------|----------|-----------|------|--------|
| POST | `/user/create_session` | Membuat sesi pengguna baru | ❌ | 201 Created |
| GET | `/user/get_session` | Mengambil data sesi pengguna berdasarkan Authorization header | ✅ | 200 OK |
| POST | `/user/set_preference` | Mengatur preferensi pengguna | ⚠️ | 200 OK |

---

### 2. Product Controller (`/product`)

| Method | Endpoint | Deskripsi | Auth | Status |
|--------|----------|-----------|------|--------|
| GET | `/product/list` | Mengambil daftar semua produk | ✅ | 200 OK |
| GET | `/product/category/list` | Mengambil daftar semua kategori produk | ✅ | 200 OK |
| GET | `/product/category/{categoryId}` | Mengambil produk berdasarkan ID kategori | ✅ | 200 OK / 404 Not Found |
| GET | `/product/recomendation` | Mengambil rekomendasi produk berdasarkan preferensi pengguna | ✅ | 200 OK |

---

### 3. Product Promotion Controller (`/promotion`)

| Method | Endpoint | Deskripsi | Auth | Status |
|--------|----------|-----------|------|--------|
| GET | `/promotion/list` | Mengambil daftar promosi untuk pengguna yang login | ✅ | 200 OK |
| PUT | `/promotion/subscribe` | Berlangganan promosi produk | ✅ | 200 OK |
| PUT | `/promotion/unsubscribe` | Berhenti berlangganan promosi produk | ✅ | 200 OK |

---

### 4. Admin Product Promotion Controller (`/admin/promotion`)

| Method | Endpoint | Deskripsi | Auth | Status |
|--------|----------|-----------|------|--------|
| GET | `/admin/promotion/list` | Mengambil daftar semua promosi (Admin) | ❌ | 200 OK |
| POST | `/admin/promotion/create` | Membuat promosi produk baru (Admin) | ❌ | 201 Created |
| PUT | `/admin/promotion/update` | Memperbarui promosi produk (Admin) | ❌ | 200 OK |

---

## 🔐 Keterangan Autentikasi

- ✅ **Required** - Memerlukan @RequireAuth dan Authorization header dengan format: `Bearer <session-key>`
- ⚠️ **Optional** - Menggunakan Authorization header manual
- ❌ **None** - Tidak memerlukan autentikasi

---

## 📝 Response Format

Semua endpoint mengembalikan response dengan format standar:

```json
{
  "success": true,
  "message": "Deskripsi pesan",
  "data": {
    // Data respons atau null
  }
}
```

---

## 🚀 Request Headers

### Authorization Header (untuk endpoint dengan ✅)
```
Authorization: Bearer <session-key>
```

### CORS
- Semua endpoint memiliki `@CrossOrigin(origins = "*")`
- Memungkinkan request dari semua origin

---

## 📦 Path Variables

- `{categoryId}` - ID kategori produk (Long)

---

## 🔄 Request Body

### User Controller - `/user/create_session`
```json
{
  "name": "John Doe"
}
```

---

## Generated: 2026-05-25
