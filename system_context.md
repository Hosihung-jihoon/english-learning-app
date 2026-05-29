# SYSTEM CONTEXT — English Learning App (Monorepo)
> BẮT BUỘC đọc trước khi làm việc.
> Đây là bộ nhớ dự án dùng chung cho các phiên sau.

---

## 1. Tổng quan

| Trường | Giá trị |
|---|---|
| Tên dự án | English Learning App – Team 2 |
| Loại | Full-stack mobile app |
| Mục tiêu | Học tiếng Anh: target path, lesson, quiz, flashcard, progress |
| Kiến trúc | Monorepo npm workspaces |
| Trạng thái | Đang phát triển |

### Repo layout
```text
english-learning-app-t2/
├── apps/
│   ├── server/   # NestJS + Mongoose + MongoDB Atlas
│   └── mobile/   # Expo Router + React Native
├── shared/       # shared types, constants, seed content
├── plan.md
├── workflow.md
└── system_context.md
```

---

## 2. Stack và ràng buộc

### Backend
- NestJS 11
- Mongoose 9
- MongoDB Atlas
- `class-validator`, `class-transformer`
- JWT-style bearer auth hiện được ký thủ công bằng `crypto`
- Global prefix: `/api/v1`

### Mobile
- Expo SDK 55
- Expo Router
- React 19 / React Native 0.83
- `fetch` native, không dùng axios
- `expo-secure-store` để lưu token và trạng thái onboarding
- `StyleSheet.create` + `constants/theme.ts`

### Shared
- `shared/types/index.ts`: hợp đồng dữ liệu dùng chung
- `shared/constants/index.ts`: API routes, app config
- `shared/seed/default-content.ts`: seed content mặc định cho DB

---

## 3. Environment variables

### `apps/server/.env`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `NODE_ENV`
- `ALLOWED_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### `apps/mobile/.env`
- `EXPO_PUBLIC_API_BASE_URL`
- các biến `EXPO_PUBLIC_*` khác chỉ là optional utility placeholders

---

## 4. Trạng thái implementation hiện tại

### Backend
- `apps/server` không còn là skeleton.
- Đã có feature modules:
  - `auth`
  - `users`
  - `profile`
  - `targets`
  - `courses`
  - `lessons`
  - `vocabulary`
  - `quiz`
  - `collections`
  - `progress`
  - `assessments`
  - `certificates`
  - `database-seed`
- Seed service tự đẩy dữ liệu mặc định vào MongoDB nếu collection còn trống.

### Mobile
- Root app đã có auth provider và redirect theo state thật:
  - chưa onboarding xong → onboarding
  - đã onboarding nhưng chưa có token → sign-in
  - có token hợp lệ → tabs
- Core screens đang dùng API thật:
  - home
  - target selection/detail
  - course detail
  - lesson + quiz
  - collection overview/detail/study
  - categories
  - profile
- Core node đã thay placeholder:
  - assessment
  - lesson complete
  - review mistakes
  - create folder / create flashcard / choose folder
  - certificate

### Mock data
- `apps/mobile/data/mock-content.ts` không còn được dùng bởi runtime core flow.
- Nguồn dữ liệu mặc định hiện nằm ở `shared/seed/default-content.ts` và được seed vào MongoDB.
- `apps/mobile/data/onboarding-options.ts` chỉ giữ option local cho onboarding UI, không phải learning content.

---

## 5. API quan trọng

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Profile / Progress
- `GET /api/v1/users/profile`
- `GET /api/v1/progress/me`
- `GET /api/v1/progress/review-mistakes`
- `POST /api/v1/progress/lesson-access`

### Learning content
- `GET /api/v1/targets`
- `GET /api/v1/targets/:type`
- `GET /api/v1/courses`
- `GET /api/v1/courses/:id`
- `GET /api/v1/lessons`
- `GET /api/v1/lessons/:id`
- `GET /api/v1/vocabulary?lessonId=...`
- `GET /api/v1/quiz?lessonId=...`
- `POST /api/v1/quiz/submit`

### Collections
- `GET /api/v1/collections`
- `POST /api/v1/collections`
- `GET /api/v1/collections/:id`
- `GET /api/v1/collections/:id/flashcards`
- `POST /api/v1/collections/:id/flashcards`

### Assessment / Certificates
- `GET /api/v1/assessments/:targetType`
- `POST /api/v1/assessments/submit`
- `GET /api/v1/certificates`

---

## 6. Mobile flow hiện tại

### Auth flow
- onboarding step 1 → 2 → 3 → 4
- step 4 đánh dấu onboarding hoàn tất
- sign-in / sign-up gọi backend thật
- token lưu bằng secure store

### Learning flow
- home → target → course → lesson → quiz → lesson-complete
- assessment có route riêng theo `targetType`

### Library flow
- collection overview → detail → study
- collection overview → review mistakes
- collection overview / detail → collection-builder
- categories → collection detail

### Profile flow
- profile lấy dữ liệu từ `/users/profile`
- certificate route riêng
- sign out xóa token và quay lại sign-in

### Placeholder còn giữ
- search
- notifications
- social sign-in/link
- forgot password
- các info CTA phụ
- filter/option utility ngoài core scope

---

## 7. Quy ước kỹ thuật cần nhớ

- Luôn đọc `.antigravityrules` trước khi làm.
- Sau thay đổi lớn phải cập nhật `system_context.md`.
- Tạo type ở `shared/types`, không khai báo lại trong package con.
- Tạo API route constant ở `shared/constants`.
- Mobile dùng `fetch` + service layer, không gọi hardcode URL rải rác.
- Server module mới đặt dưới `apps/server/src/modules/<feature>/`.
- Không commit `.env` thật.

---

## 8. ADR đang hiệu lực

| ID | Quyết định | Ghi chú |
|---|---|---|
| ADR-001 | Expo Router file-based | giữ nguyên |
| ADR-002 | TypeScript strict | giữ nguyên |
| ADR-003 | `StyleSheet.create` + theme tokens | giữ nguyên |
| ADR-004 | Expo SDK 55 / New Architecture | giữ nguyên |
| ADR-005 | `fetch` thay `axios` | giữ nguyên |
| ADR-006 | Monorepo npm workspaces | giữ nguyên |
| ADR-007 | `shared/` cho contract dùng chung | giữ nguyên |
| ADR-008 | NestJS + Mongoose + Atlas | giữ nguyên |
| ADR-009 | Seed content mặc định trong `shared/seed/default-content.ts` | mới |
| ADR-010 | Mobile auth session lưu bằng `expo-secure-store` | mới |
| ADR-011 | Core flow dùng API thật, không còn runtime mock content | mới |

---

## 9. Kiểm tra đã pass gần nhất

- `npm run build --workspace=apps/server`
- `npx tsc --noEmit` trong `apps/mobile`
- `npm run lint` trong `apps/mobile`

---

## 10. Lịch sử cập nhật

| Ngày | Phiên bản | Thay đổi |
|---|---|---|
| 2026-04-05 | v1.0 | Khởi tạo context ban đầu |
| 2026-04-20 | v2.0 | Chuyển sang monorepo workspaces |
| 2026-04-21 | v3.0 | Chuyển DB sang MongoDB Atlas |
| 2026-04-22 | v4.0 | Chốt EAS/Android identity |
| 2026-05-29 | v4.1 | Merge core mobile UI flow theo Figma, còn dùng mock runtime |
| 2026-05-29 | v4.2 | Backend feature modules + DB seed + auth/progress thật + mobile core flow nối API |
