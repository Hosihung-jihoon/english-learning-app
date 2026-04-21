# 📚 English Learning App — Monorepo

> **Stack:** React Native (Expo) · NestJS · MongoDB Atlas

---

## 🗂️ Cấu trúc thư mục

```
english-learning-app-t2/
├── apps/
│   ├── mobile/          # React Native (Expo SDK 55) — Android
│   └── server/          # NestJS Backend + Mongoose + MongoDB Atlas
├── shared/              # Types & constants dùng chung
│   ├── types/           # TypeScript interfaces (User, Lesson, Vocab...)
│   └── constants/       # API_ROUTES, ERROR_CODES, APP_CONFIG
├── docker-compose.yml   # ⚠️ CHỈ DÙNG KHI DEPLOY VPS — không dùng khi dev
├── package.json         # Root — npm workspaces + scripts
└── README.md
```

---

## 🚀 Bắt đầu

### 1. Yêu cầu

| Tool | Phiên bản |
|------|-----------|
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| Expo Go app | Cài trên điện thoại |
| Tài khoản MongoDB Atlas | Miễn phí tại [mongodb.com](https://www.mongodb.com/cloud/atlas) |

> ℹ️ **Không cần Docker** để chạy dev. Database dùng MongoDB Atlas (cloud).

### 2. Cài đặt dependencies

```bash
npm run install:all
```

### 3. Cấu hình môi trường

#### Server
```bash
# Windows
copy apps\server\.env.example apps\server\.env

# Mac/Linux
cp apps/server/.env.example apps/server/.env
```

Mở `apps/server/.env` và điền:
```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/english_learning
JWT_SECRET=your-super-secret-key-minimum-32-characters
PORT=3000
```

> 💡 Lấy `MONGODB_URI` từ **MongoDB Atlas Console** → **Connect** → **Drivers** → chọn Node.js.
> Thành viên trong team dùng chung 1 cluster Atlas → không cần sync DB thủ công.

#### Mobile
```bash
copy apps\mobile\.env.example apps\mobile\.env
```

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 4. Chạy ứng dụng

```bash
# Chạy cả server + mobile cùng lúc
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:server   # NestJS → http://localhost:3000/api/v1
npm run dev:mobile   # Expo → scan QR code bằng Expo Go
```

---

## 📦 Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy server + mobile cùng lúc |
| `npm run dev:server` | Chỉ chạy NestJS server |
| `npm run dev:mobile` | Chỉ chạy Expo mobile |
| `npm run build:server` | Build NestJS production |
| `npm run install:all` | Cài dependencies cho tất cả packages |

---

## 🛠️ Công nghệ

### Mobile (`apps/mobile/`)
- **Expo SDK 55** + React Native 0.83
- **Expo Router** (file-based navigation)
- **React Native Reanimated 4**
- **fetch** native (không dùng axios)

### Server (`apps/server/`)
- **NestJS** v11
- **Mongoose** + **MongoDB Atlas** (cloud database)
- **@nestjs/config** (env management)
- **class-validator** / **class-transformer** (DTO validation)
- **JWT** authentication

---

## 🗄️ Database — MongoDB Atlas

Dự án dùng **MongoDB Atlas** (cloud-hosted) để tất cả thành viên trong team đều kết nối cùng 1 database mà không cần cài đặt gì cục bộ.

### Setup Atlas (lần đầu)
1. Tạo tài khoản tại [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo **Free Cluster** (M0 — miễn phí)
3. Thêm IP của máy vào **Network Access** (hoặc `0.0.0.0/0` khi dev)
4. Tạo **Database User** → lấy connection string
5. Paste vào `apps/server/.env` → biến `MONGODB_URI`

> ⚠️ **Không hardcode** connection string vào code. Luôn dùng biến môi trường.

---

## 🐳 Docker (Deploy VPS Only)

`docker-compose.yml` được chuẩn bị sẵn cho việc deploy lên VPS.
**Không cần dùng khi phát triển local** — MongoDB Atlas đã đảm nhận vai trò database.

```bash
# Chỉ chạy khi deploy production trên VPS
docker compose up -d
```

---

## 📁 Quy ước NestJS (Feature Module Pattern)

```
apps/server/src/modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
└── entities/
    └── <feature>.schema.ts      ← Mongoose @Schema()
```

### API Prefix
Toàn bộ API có prefix `/api/v1`:
```
GET  /api/v1/lessons
POST /api/v1/auth/login
...
```

---

## 🤝 Contributing

Commit message format: `<type>(<scope>): <subject>`

```bash
feat(server): add lesson CRUD endpoints
feat(mobile): add vocabulary flashcard screen
fix(server): handle mongoose connection error
docs(root): update README
```

**Scopes:** `server` | `mobile` | `shared` | `root`
