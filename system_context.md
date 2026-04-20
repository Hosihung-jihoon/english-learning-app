# 📚 SYSTEM CONTEXT — English Learning App (Monorepo-lite)
> **⚠️ BẮT BUỘC ĐỌC TRƯỚC KHI LÀM VIỆC.**
> File này là **bộ nhớ duy nhất** của toàn bộ dự án.
> Mọi phiên làm việc mới (AI hoặc thành viên mới) **phải đọc file này trước tiên**.
> Sau mỗi thay đổi lớn, hãy cập nhật file này.

---

## 1. Tổng quan dự án

| Trường | Giá trị |
|---|---|
| **Tên dự án** | English Learning App – Team 2 |
| **Loại** | Full-stack Mobile App (MERN + Expo) |
| **Mục tiêu** | Ứng dụng học tiếng Anh: từ vựng, ngữ pháp, nghe, đọc, quiz |
| **Nền tảng target** | Android, iOS, Web |
| **Kiến trúc** | Monorepo-lite (1 repo, 3 folder, không npm workspaces) |
| **Timeline** | 5 tuần — Đồ án môn Lập trình ứng dụng |
| **Trạng thái** | 🟡 Đang phát triển |

### Team
| Vai trò | Trách nhiệm |
|---|---|
| Leader | Backend (api/) + Mobile core logic + Kiến trúc |
| Member 1 | UI/UX — thiết kế giao diện mobile |
| Member 2 | Testing — kiểm thử tính năng |

---

## 2. Kiến trúc dự án

```
english-learning-app-t2/              ← root repo
│
├── api/                               # Backend — Node.js + Express + MongoDB
│   ├── src/
│   │   ├── routes/                    # Định nghĩa API endpoints
│   │   ├── controllers/               # Business logic
│   │   ├── models/                    # Mongoose schemas (DB models)
│   │   ├── middleware/                # Auth, error handling...
│   │   └── index.ts                   # Entry point — khởi động server
│   ├── .env                           # 🔒 SECRET — KHÔNG commit
│   ├── .env.example                   # ✅ Template an toàn
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                            # Frontend — Expo SDK 55
│   ├── app/                           # Expo Router — màn hình
│   │   ├── _layout.tsx                # Root layout
│   │   ├── modal.tsx
│   │   └── (tabs)/                    # Tab navigation
│   ├── components/                    # UI components dùng lại
│   ├── constants/                     # Mobile-only constants
│   ├── hooks/                         # Custom React hooks
│   ├── assets/                        # Hình ảnh, font, icon
│   ├── .env                           # 🔒 SECRET — KHÔNG commit
│   ├── .env.example                   # ✅ Template an toàn
│   ├── app.json                       # Expo config
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                            # Code dùng chung (không có package.json)
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces: User, Lesson, Vocab...
│   └── constants/
│       └── index.ts                   # API_ROUTES, ERROR_CODES, APP_CONFIG
│
├── package.json                       # Root scripts tiện lợi (không phải workspaces)
├── .gitignore
├── .antigravityrules                  # Quy tắc làm việc với AI
├── system_context.md                  # 📌 FILE NÀY
└── README.md
```

---

## 3. Stack & Dependencies

### Backend (`api/`)
| Package | Version | Mục đích |
|---|---|---|
| `express` | ^4.19 | Web framework |
| `mongoose` | ^8.4 | MongoDB ODM |
| `dotenv` | ^16.4 | Biến môi trường |
| `cors` | ^2.8 | Cross-origin requests |
| `ts-node-dev` | ^2.0 | Dev server với hot reload |
| `typescript` | ~5.9 | Type safety |

### Frontend (`mobile/`)
| Package | Version | Mục đích |
|---|---|---|
| `expo` | ~55.0.0 | Framework chính |
| `expo-router` | ~55.0.10 | File-based routing |
| `react-native` | 0.83.4 | Core RN |
| `react` | 19.2.0 | UI Library |
| `react-native-reanimated` | 4.2.1 | Animations |
| `fetch` (native) | built-in | HTTP client (không dùng axios) |

> **New Architecture** bắt buộc từ Expo SDK 55.

---

## 4. Quy ước code

### Naming
- **File/folder**: `kebab-case` (`lesson-controller.ts`, `themed-text.tsx`)
- **Component React**: `PascalCase` (`ThemedText`, `LessonCard`)
- **Hook**: tiền tố `use` (`useColorScheme`, `useLessons`)
- **Constant tĩnh**: `UPPER_SNAKE_CASE` (`API_ROUTES`, `MAX_RETRIES`)
- **Mongoose model**: `PascalCase` singular (`Lesson`, `User`)

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

### REST API (Backend)
```
GET    /api/lessons          → lấy danh sách
GET    /api/lessons/:id      → lấy 1 item
POST   /api/lessons          → tạo mới
PUT    /api/lessons/:id      → cập nhật
DELETE /api/lessons/:id      → xóa
```

---

## 5. Environment Variables & Secrets

| File | Mục đích | Commit? |
|---|---|---|
| `api/.env` | Secrets backend (MONGO_URI, JWT_SECRET) | ❌ KHÔNG |
| `api/.env.example` | Template backend | ✅ CÓ |
| `mobile/.env` | Secrets mobile (API_BASE_URL) | ❌ KHÔNG |
| `mobile/.env.example` | Template mobile | ✅ CÓ |

### Biến quan trọng
```bash
# api/.env
MONGO_URI=mongodb+srv://...    # Kết nối MongoDB Atlas
JWT_SECRET=...                 # Dùng để ký JWT token
PORT=5000

# mobile/.env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000   # URL backend khi dev
```

---

## 6. Getting Started

```bash
# Clone
git clone https://github.com/Hosihung-jihoon/english-learning-app.git
cd english-learning-app

# Cài root dependencies (concurrently)
npm install

# Cài dependencies cho từng package
npm run install:all

# Tạo file .env từ template
cp api/.env.example api/.env       # Điền MONGO_URI + JWT_SECRET
cp mobile/.env.example mobile/.env  # Điền API_BASE_URL

# Chạy cả API + Mobile cùng lúc
npm run dev
# hoặc riêng lẻ:
npm run dev:api
npm run dev:mobile
```

---

## 7. Các module / tính năng

| Module | API Route | Mobile Screen | Trạng thái | Người làm |
|---|---|---|---|---|
| Authentication | `/api/auth` | `app/(tabs)/` | ⬜ Chưa làm | Leader |
| Lessons | `/api/lessons` | `app/(tabs)/explore` | ⬜ Chưa làm | Leader |
| Vocabulary | `/api/vocabulary` | — | ⬜ Chưa làm | Leader |
| Quiz | `/api/quiz` | — | ⬜ Chưa làm | Leader |
| Progress | `/api/progress` | — | ⬜ Chưa làm | Leader |
| Home UI | — | `app/(tabs)/index` | 🟡 Scaffold | Member 1 |

---

## 8. Quyết định kiến trúc (ADR)

| # | Quyết định | Lý do | Ngày |
|---|---|---|---|
| ADR-001 | Expo Router file-based | Navigation tự động, deep linking built-in | 2026-04-05 |
| ADR-002 | TypeScript strict mode | Giảm bug runtime | 2026-04-05 |
| ADR-003 | `StyleSheet.create` + theme tokens | Nhất quán UI | 2026-04-05 |
| ADR-004 | New Architecture (SDK 55) | Bắt buộc, hiệu năng tốt hơn | 2026-04-05 |
| ADR-005 | `fetch` thay `axios` | Không thêm dependency, đủ dùng | 2026-04-05 |
| ADR-006 | Monorepo-lite (không npm workspaces) | 1 leader code, 5 tuần — overhead không đáng | 2026-04-20 |
| ADR-007 | `shared/` dùng relative import | Đơn giản hơn workspace config, đủ dùng cho scale dự án | 2026-04-20 |

---

## 9. Lịch sử cập nhật

| Ngày | Phiên bản | Thay đổi | Người cập nhật |
|---|---|---|---|
| 2026-04-05 | v1.0 | Tạo file ban đầu — Expo SDK 54 scaffold | AI (Antigravity) |
| 2026-04-05 | v1.1 | Nâng cấp SDK 54 → 55; fetch thay axios | AI (Antigravity) |
| 2026-04-20 | v2.0 | Restructure sang monorepo-lite: thêm `api/`, `shared/`, di chuyển Expo vào `mobile/` | AI (Antigravity) |

---

> 📌 **Khi kết thúc phiên làm việc**: Cập nhật bảng lịch sử, trạng thái module, và ADR nếu có quyết định mới.
