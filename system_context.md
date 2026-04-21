# 📚 SYSTEM CONTEXT — English Learning App (Monorepo)
> **⚠️ BẮT BUỘC ĐỌC TRƯỚC KHI LÀM VIỆC.**
> File này là **bộ nhớ duy nhất** của toàn bộ dự án.
> Mọi phiên làm việc mới (AI hoặc thành viên mới) **phải đọc file này trước tiên**.
> Sau mỗi thay đổi lớn, hãy cập nhật file này.

---

## 1. Tổng quan dự án

| Trường | Giá trị |
|---|---|
| **Tên dự án** | English Learning App – Team 2 |
| **Loại** | Full-stack Mobile App |
| **Mục tiêu** | Ứng dụng học tiếng Anh: từ vựng, ngữ pháp, nghe, đọc, quiz |
| **Nền tảng target** | Android (chính), iOS, Web |
| **Kiến trúc** | Monorepo (npm workspaces) |
| **Timeline** | 5 tuần — Đồ án môn Lập trình ứng dụng |
| **Trạng thái** | 🟡 Đang phát triển |

### Team
| Vai trò | Trách nhiệm |
|---|---|
| Leader | Backend (apps/server/) + Mobile core logic + Kiến trúc |
| Member 1 | UI/UX — thiết kế giao diện mobile |
| Member 2 | Testing — kiểm thử tính năng |

---

## 2. Kiến trúc dự án

```
english-learning-app-t2/              ← root repo (npm workspaces)
│
├── apps/
│   ├── server/                        # Backend — NestJS + Mongoose + MongoDB Atlas
│   │   ├── src/
│   │   │   ├── modules/               # Feature modules (auth, lessons, vocab...)
│   │   │   │   └── <feature>/
│   │   │   │       ├── <feature>.module.ts
│   │   │   │       ├── <feature>.controller.ts
│   │   │   │       ├── <feature>.service.ts
│   │   │   │       ├── dto/           # Request/Response DTOs
│   │   │   │       └── entities/      # Mongoose @Schema() definitions
│   │   │   ├── common/                # Guards, decorators, filters, pipes
│   │   │   ├── app.module.ts          # Root module
│   │   │   └── main.ts               # Entry point
│   │   ├── .env                       # 🔒 SECRET — KHÔNG commit
│   │   ├── .env.example              # ✅ Template an toàn
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                        # Frontend — Expo SDK 55 (Android)
│       ├── app/                       # Expo Router — màn hình
│       │   ├── _layout.tsx            # Root layout
│       │   ├── modal.tsx
│       │   └── (tabs)/               # Tab navigation
│       ├── components/               # UI components dùng lại
│       ├── constants/                # Mobile-only constants (theme...)
│       ├── hooks/                    # Custom React hooks
│       ├── assets/                   # Hình ảnh, font, icon
│       ├── .env                      # 🔒 SECRET — KHÔNG commit
│       ├── .env.example             # ✅ Template an toàn
│       ├── app.json                  # Expo config (package, EAS projectId)
│       ├── package.json
│       └── tsconfig.json
│
├── shared/                            # Code dùng chung (không có package.json)
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces: User, Lesson, Vocab...
│   └── constants/
│       └── index.ts                   # API_ROUTES, ERROR_CODES, APP_CONFIG
│
├── docker-compose.yml                 # ⚠️ CHỈ DÙNG KHI DEPLOY VPS — không dùng khi dev
├── package.json                       # Root — npm workspaces + scripts
├── .gitignore
├── .antigravityrules                  # Quy tắc làm việc với AI
├── system_context.md                  # 📌 FILE NÀY
└── README.md
```

---

## 3. Stack & Dependencies

### Backend (`apps/server/`)
| Package | Version | Mục đích |
|---|---|---|
| `@nestjs/core` | ^11 | Web framework |
| `@nestjs/mongoose` | ^11 | Mongoose integration cho NestJS |
| `mongoose` | ^9 | MongoDB ODM |
| `@nestjs/config` | ^4 | Biến môi trường |
| `@nestjs/jwt` | ^11 | JWT Authentication |
| `class-validator` | ^0.14 | DTO validation decorators |
| `class-transformer` | ^0.5 | Transform request payloads |
| `typescript` | ~5.9 | Type safety |

### Frontend (`apps/mobile/`)
| Package | Version | Mục đích |
|---|---|---|
| `expo` | ~55.0.0 | Framework chính |
| `expo-router` | ~55.0.10 | File-based routing |
| `react-native` | 0.83.4 | Core RN |
| `react` | 19.2.0 | UI Library |
| `react-native-reanimated` | 4.2.1 | Animations |
| `fetch` (native) | built-in | HTTP client (không dùng axios) |

> **New Architecture** bắt buộc từ Expo SDK 55.

### Database & Infrastructure
| Công nghệ | Môi trường | Ghi chú |
|---|---|---|
| **MongoDB Atlas** | Dev + Production | Cloud — đồng bộ DB giữa thành viên |
| Docker (MongoDB + MongoExpress) | VPS deploy only | Không dùng khi dev local |

---

## 4. Thông tin App (KHÔNG tự ý thay đổi)

| Trường | Giá trị |
|---|---|
| **App Name** | english-learning-app-t2 |
| **Slug** | english-learning-app-t2 |
| **Android Package** | `com.sihung.englishlearningapp` |
| **EAS Project ID** | `1d0104bc-99e0-40dc-ad06-351b482c486d` |
| **Scheme (deep link)** | `englishlearningappt2` |

> ⚠️ `android.package` và EAS `projectId` được đặt cố định trong `apps/mobile/app.json`.
> Thay đổi 2 trường này sẽ làm mất liên kết với EAS cloud và Google Play (nếu đã submit).

---

## 5. Quy ước code

### Naming
- **File/folder**: `kebab-case` (`lesson.controller.ts`, `themed-text.tsx`)
- **Component React**: `PascalCase` (`ThemedText`, `LessonCard`)
- **Hook**: tiền tố `use` (`useColorScheme`, `useLessons`)
- **Constant tĩnh**: `UPPER_SNAKE_CASE` (`API_ROUTES`, `MAX_RETRIES`)
- **NestJS class**: `PascalCase` singular (`LessonService`, `AuthGuard`)
- **Mongoose collection**: plural, snake_case (`lessons`, `vocabulary_items`)

### TypeScript
- Luôn dùng strict mode
- Tránh `any` — dùng `unknown` nếu chưa biết type
- Import types từ `shared/types` thay vì định nghĩa lại

### HTTP / fetch (Mobile)
> ⚠️ Dự án dùng `fetch` native — **KHÔNG cài axios**.

```typescript
// ✅ ĐÚNG — dùng fetch + shared constants
import { API_ROUTES } from '../../shared/constants';

const res = await fetch(`${BASE_URL}${API_ROUTES.LESSONS}`);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

### REST API (Backend — prefix `/api/v1`)
```
GET    /api/v1/lessons          → lấy danh sách
GET    /api/v1/lessons/:id      → lấy 1 item
POST   /api/v1/lessons          → tạo mới
PUT    /api/v1/lessons/:id      → cập nhật
DELETE /api/v1/lessons/:id      → xóa
```

---

## 6. Environment Variables & Secrets

| File | Mục đích | Commit? |
|---|---|---|
| `apps/server/.env` | Secrets backend (MONGODB_URI, JWT_SECRET) | ❌ KHÔNG |
| `apps/server/.env.example` | Template backend | ✅ CÓ |
| `apps/mobile/.env` | Secrets mobile (API_BASE_URL) | ❌ KHÔNG |
| `apps/mobile/.env.example` | Template mobile | ✅ CÓ |
| `credentials.json` | EAS keystore/cert | ❌ KHÔNG |

### Biến quan trọng
```bash
# apps/server/.env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/english_learning
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=*

# apps/mobile/.env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000   # URL backend khi dev local
```

> 💡 **MONGODB_URI** lấy từ MongoDB Atlas Console → Connect → Drivers.
> Mỗi thành viên tạo account Atlas miễn phí rồi chia sẻ connection string qua kênh riêng (không qua git).

---

## 7. Getting Started

```bash
# Clone
git clone https://github.com/Hosihung-jihoon/english-learning-app.git
cd english-learning-app-t2

# Cài tất cả dependencies (root + workspaces)
npm run install:all

# Tạo file .env từ template
copy apps\server\.env.example apps\server\.env   # Điền MONGODB_URI + JWT_SECRET
copy apps\mobile\.env.example apps\mobile\.env   # Điền API_BASE_URL

# Chạy server + mobile cùng lúc
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:server   # NestJS → http://localhost:3000/api/v1
npm run dev:mobile   # Expo → scan QR code bằng Expo Go
```

---

## 8. Các module / tính năng

| Module | API Route | Mobile Screen | Trạng thái | Người làm |
|---|---|---|---|---|
| Authentication | `/api/v1/auth` | — | ⬜ Chưa làm | Leader |
| Lessons | `/api/v1/lessons` | `app/(tabs)/explore` | ⬜ Chưa làm | Leader |
| Vocabulary | `/api/v1/vocabulary` | — | ⬜ Chưa làm | Leader |
| Quiz | `/api/v1/quiz` | — | ⬜ Chưa làm | Leader |
| Progress | `/api/v1/progress` | — | ⬜ Chưa làm | Leader |
| Home UI | — | `app/(tabs)/index` | 🟡 Scaffold | Member 1 |

---

## 9. EAS Build

| Trường | Giá trị |
|---|---|
| **Project ID** | `1d0104bc-99e0-40dc-ad06-351b482c486d` |
| **Android package** | `com.sihung.englishlearningapp` |
| **Build platform** | Android (chính) |

```bash
# Build APK preview (test nội bộ)
cd apps/mobile
eas build --platform android --profile preview

# Build AAB production (Google Play)
eas build --platform android --profile production
```

> ⚠️ **`credentials.json`** chứa keystore — KHÔNG BAO GIỜ commit.

---

## 10. Quyết định kiến trúc (ADR)

| # | Quyết định | Lý do | Ngày |
|---|---|---|---|
| ADR-001 | Expo Router file-based | Navigation tự động, deep linking built-in | 2026-04-05 |
| ADR-002 | TypeScript strict mode | Giảm bug runtime | 2026-04-05 |
| ADR-003 | `StyleSheet.create` + theme tokens | Nhất quán UI | 2026-04-05 |
| ADR-004 | New Architecture (SDK 55) | Bắt buộc, hiệu năng tốt hơn | 2026-04-05 |
| ADR-005 | `fetch` thay `axios` | Không thêm dependency, đủ dùng | 2026-04-05 |
| ADR-006 | Monorepo (npm workspaces) | Quản lý dependencies tập trung | 2026-04-20 |
| ADR-007 | `shared/` dùng relative import | Đơn giản hơn workspace config | 2026-04-20 |
| ADR-008 | NestJS thay Express | Module system, DI, decorator pattern tốt hơn cho scale | 2026-04-20 |
| ADR-009 | MongoDB Atlas thay PostgreSQL | Cloud-hosted → đồng bộ DB dễ dàng giữa thành viên | 2026-04-21 |
| ADR-010 | Docker chỉ dùng khi deploy VPS | Tránh overhead cho dev local, Atlas đã lo infrastructure | 2026-04-21 |
| ADR-011 | EAS Build cho Android | Build APK/AAB không cần máy Mac, CI/CD tích hợp sẵn | 2026-04-22 |

---

## 11. Lịch sử cập nhật

| Ngày | Phiên bản | Thay đổi | Người cập nhật |
|---|---|---|---|
| 2026-04-05 | v1.0 | Tạo file ban đầu — Expo SDK 54 scaffold | AI (Antigravity) |
| 2026-04-05 | v1.1 | Nâng cấp SDK 54 → 55; fetch thay axios | AI (Antigravity) |
| 2026-04-20 | v2.0 | Restructure sang monorepo-lite: thêm `api/`, `shared/`, `mobile/` | AI (Antigravity) |
| 2026-04-20 | v2.1 | Nâng cấp lên monorepo đầy đủ (npm workspaces): `api/` → `apps/server/` (NestJS), `mobile/` → `apps/mobile/` | AI (Antigravity) |
| 2026-04-21 | v3.0 | Đổi database PostgreSQL → MongoDB Atlas; Docker chỉ dùng khi deploy VPS | AI (Antigravity) |
| 2026-04-22 | v4.0 | Thêm EAS Build config: Android package `com.sihung.englishlearningapp`, EAS Project ID; cập nhật .gitignore cho credentials | AI (Antigravity) |

---

> 📌 **Khi kết thúc phiên làm việc**: Cập nhật bảng lịch sử, trạng thái module, và ADR nếu có quyết định mới.
