# Plan triển khai full core nodes + chuyển dữ liệu sang DB

## Trạng thái
- Đã chuyển core flow từ mock runtime sang backend API thật.
- `apps/server` hiện có module nghiệp vụ cho `auth`, `users/profile`, `targets`, `courses`, `lessons`, `vocabulary`, `quiz`, `collections`, `progress`, `assessments`, `certificates`.
- Mobile core screens không còn đọc `apps/mobile/data/mock-content.ts`.

## Đã triển khai
### 1. Shared contract
- Chuẩn hóa `shared/types/index.ts` cho:
  - `AuthSession`, `UserProfile`
  - `TargetContent`, `CourseContent`, `LessonContent`
  - `Flashcard`, `CollectionSummary`, `CategorySummary`
  - `Assessment`, `QuizSubmissionResult`, `ProgressSnapshot`, `ProfileSummary`
- Mở rộng `shared/constants/index.ts` với route `/api/v1/*`.
- Thêm `shared/seed/default-content.ts` làm nguồn seed cố định cho MongoDB.

### 2. Backend và database
- Thêm auth thật bằng token bearer HMAC-signed theo format JWT-compatible.
- Thêm Mongoose schemas và feature modules cho content/progress/profile.
- Bổ sung seed service tự nạp dữ liệu mặc định khi DB trống:
  - targets
  - courses
  - lessons
  - flashcard collections
  - flashcards
  - assessments
  - certificates
- Thêm endpoints chính:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/users/profile`
  - `GET /api/v1/targets`, `GET /api/v1/targets/:type`
  - `GET /api/v1/courses`, `GET /api/v1/courses/:id`
  - `GET /api/v1/lessons`, `GET /api/v1/lessons/:id`
  - `GET /api/v1/vocabulary?lessonId=...`
  - `GET /api/v1/quiz?lessonId=...`
  - `POST /api/v1/quiz/submit`
  - `GET /api/v1/collections`, `GET /api/v1/collections/:id`
  - `GET /api/v1/collections/:id/flashcards`
  - `POST /api/v1/collections`
  - `POST /api/v1/collections/:id/flashcards`
  - `GET /api/v1/progress/me`
  - `GET /api/v1/progress/review-mistakes`
  - `POST /api/v1/progress/lesson-access`
  - `GET /api/v1/assessments/:targetType`
  - `POST /api/v1/assessments/submit`
  - `GET /api/v1/certificates`

### 3. Mobile runtime
- Thêm `expo-secure-store` để lưu token và cờ onboarding.
- Thêm:
  - `apps/mobile/lib/api.ts`
  - `apps/mobile/lib/auth-storage.ts`
  - `apps/mobile/providers/auth-provider.tsx`
  - `apps/mobile/services/auth-service.ts`
  - `apps/mobile/services/content-service.ts`
- `app/index.tsx` giờ redirect theo state thật:
  - chưa onboarding xong → onboarding
  - đã onboarding nhưng chưa có token → sign-in
  - có token hợp lệ → tabs

### 4. Core UI/flow đã thay placeholder
- `Assessment`: `app/assessment.tsx`
- `Lesson complete`: `app/lesson-complete.tsx`
- `Review mistakes`: `app/review-mistakes.tsx`
- `Create folder / create flashcard / choose existing folder`: `app/collection-builder.tsx`
- `Certificate`: `app/certificate.tsx`
- `Collection detail` và `flashcard study` đã chạy trong `app/(tabs)/collection.tsx`

## Còn ngoài scope
- Social sign-in/link
- Forgot password
- Search/notification flow
- Info/utility CTA phụ vẫn dùng `coming-soon`
- Chưa có CMS/admin UI để chỉnh seed content
- Chưa có analytics/streak engine phức tạp; metrics profile đang tính từ progress cơ bản

## Kiểm tra đã chạy
- `npm run build --workspace=apps/server` ✅
- `npx tsc --noEmit` trong `apps/mobile` ✅
- `npm run lint` trong `apps/mobile` ✅
