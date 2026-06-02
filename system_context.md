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
- Một phần UI mobile đang được kéo sát Figma bằng asset export trực tiếp từ Figma:
  - bottom tab bar dùng background node export thật
  - home/auth đã qua một lượt chỉnh responsive theo Figma
  - collection overview và categories overview đang dùng card asset export thật
  - profile progress/streak panel đang dùng node export thật kết hợp dữ liệu runtime
  - target selection và target detail đã tách lại đúng 2 route riêng, dùng illustration/card export từ Figma
  - lesson, quiz state và lesson complete đã qua một lượt refactor lớn để bám Figma hơn bằng illustration/card export thật
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
| 2026-06-01 | v4.3 | Mobile UI pass mới: bottom bar/profile/collection/categories bám Figma hơn bằng asset export trực tiếp |
| 2026-06-01 | v4.4 | Sửa target flow thành selection/detail thật và kéo UI target gần Figma hơn bằng asset export |
| 2026-06-01 | v4.5 | Rework lesson + quiz + lesson-complete để khớp Figma hơn và dùng thêm asset export thật |
<!-- v4.6: course detail, sign-in, sign-up, onboarding step 1 refined toward Figma on 2026-06-01 -->
<!-- v4.7: onboarding intro 1-3 and info step 2-4 now use Figma frame assets with overlay interactions; broken 149-byte image refs removed -->
<!-- v4.8: assessment, review-mistakes, certificate, collection-builder reworked into polished visual screens closer to the app design language -->
<!-- v4.9: collection detail and study states rewritten to match the visual level of the Figma-driven overview screens -->
<!-- v4.10: bottom tab bar now uses Figma-exported per-tab icons on a responsive green container instead of a stretched full-bar image; home/menu spacing and card proportions refined closer to figma-menu -->
<!-- v4.11: categories and profile tabs were rewritten cleanly in UTF-8, with responsive spacing and layout brought closer to the exported figma-categories and figma-profile frames -->
<!-- v4.12: target selection, target detail, and course screens were rewritten cleanly in UTF-8 and re-aligned to the figma target/course exports, including header, hero, tabs, and footer CTA structure -->
<!-- v4.13: lesson, quiz feedback state, and lesson-complete screens were rewritten cleanly in UTF-8 and visually aligned more closely with the figma lesson/quiz exports -->
<!-- v4.14: assessment, review-mistakes, certificate, and collection-builder screens were rewritten cleanly in UTF-8 to remove encoding issues and align their card hierarchy with the rest of the refreshed mobile UI -->
<!-- v4.15: generic Expo placeholder routes were removed; coming-soon and modal now use the app's own UI language instead of boilerplate screens -->
<!-- v4.16: onboarding step 1 and the full collection flow were rewritten cleanly in UTF-8, removing the last visible mojibake strings from active user-facing mobile screens -->
<!-- v4.17: target detail, course, assessment, and lesson quiz now handle info/bookmark actions inline instead of bouncing core-flow taps to coming-soon placeholders -->
<!-- v4.18: home, profile, sign-in, and sign-up now replace first-touch coming-soon actions with inline guidance or native share behavior, reducing placeholder jumps in the most-used entry screens -->
<!-- v4.19: target selection was rewritten cleanly in UTF-8 and the final remaining coming-soon CTA inside apps/mobile/app was removed; current mobile app routes no longer bounce to coming-soon -->
<!-- v4.20: home and sign-in were rewritten cleanly in UTF-8, removing another high-visibility layer of mojibake text from the app entry flow -->
<!-- v4.21: sign-up and profile were rewritten cleanly in UTF-8, continuing the cleanup of mojibake across the highest-traffic mobile screens -->
<!-- v4.22: course and assessment were rewritten cleanly in UTF-8, extending the mojibake cleanup deeper into the main learning flow -->
<!-- v4.23: lesson, quiz state copy, and theory parsing text in lesson.tsx were rewritten cleanly in UTF-8, completing the mojibake cleanup across the main lesson flow -->
<!-- v4.24: lesson-complete, review-mistakes, certificate, and collection-builder were rewritten cleanly in UTF-8; a follow-up scan found no remaining mojibake patterns in apps/mobile/app -->
<!-- v4.25: bottom tab bar was reworked into a slimmer floating capsule closer to the Figma frame, and Home/Menu was rewritten cleanly in UTF-8 with tighter spacing and smaller scale for better pixel fit -->
<!-- v4.26: target and categories tabs were rewritten cleanly in UTF-8 and tightened toward Figma with smaller scale, cleaner spacing, and safer bottom padding against the tab bar -->
<!-- v4.27: profile and target-detail were rewritten cleanly in UTF-8 and tightened toward Figma with smaller hero proportions, cleaner copy, and more compact footer/action spacing -->
<!-- v4.28: course and lesson-complete were rewritten cleanly in UTF-8, with slimmer hero proportions, tighter footer actions, and corrected asset usage to better match the Figma-driven mobile UI -->
<!-- v4.29: assessment, review-mistakes, and certificate were rewritten cleanly in UTF-8 and tightened visually, removing another batch of mojibake while bringing secondary screens closer to the refreshed Figma-aligned mobile UI -->
<!-- v4.30: the full collection tab flow (overview, detail, study) was rewritten cleanly in UTF-8 and tightened visually, removing remaining mojibake there and aligning its spacing and card hierarchy with the refreshed Figma-driven mobile UI -->
<!-- v4.31: coming-soon, modal, and onboarding step 1-4 were rewritten cleanly in UTF-8; onboarding helper screens now keep the same flow but no longer show mojibake in visible copy -->
<!-- v4.32: sign-in and sign-up were rewritten cleanly in UTF-8 again, preserving the current auth flow while removing visible mojibake from the highest-traffic entry screens -->
<!-- v4.33: root layout was simplified to a headerless stack with explicit modal presentation and theme-aware status bar; modal and coming-soon were rewritten cleanly in UTF-8 again from current-state evidence -->
<!-- v4.34: bottom tab bar and Home/Menu were tightened again for better pixel fit on real devices, using a slimmer tab capsule and smaller card/banner/section proportions -->
<!-- v4.35: profile, target-detail, and course were rewritten cleanly in UTF-8 from current-state evidence and tightened again for real-device pixel fit, especially hero sizes, section spacing, and sticky footer controls -->
<!-- v4.36: lesson-complete, assessment, and the full collection tab flow were rewritten cleanly in UTF-8 from current-state evidence and tightened again for real-device pixel fit, especially result/quiz cards, flashcard study proportions, and bottom actions -->
<!-- v4.37: target selection and categories were rewritten cleanly in UTF-8 from current-state evidence and tightened again for real-device pixel fit, with smaller cards, chips, search, and bottom CTA proportions -->
<!-- v4.38: onboarding step 1-4 were rewritten cleanly in UTF-8 again from current-state evidence; step 1 was also tightened slightly to better match the smaller real-device scale used across the rest of the app -->
<!-- v4.39: onboarding intro 1-3 now use safe-area-context SafeAreaView and replace-based forward navigation for a cleaner entry stack and more reliable real-device top inset handling -->
<!-- v4.40: coming-soon, modal, and onboarding step 1-4 now also use safe-area-context SafeAreaView with explicit top edges for more consistent real-device status-bar handling across helper/auth flows -->
<!-- v4.41: coming-soon and modal were rewritten cleanly again from current-state evidence, replacing the last generic English eyebrow labels with app-consistent Vietnamese copy -->
<!-- v4.42: app entry, tabs layout, home, target, profile, target-detail, and course now use safe-area-context SafeAreaView with explicit top edges, reducing remaining status-bar/top-inset inconsistency across the main mobile flow -->
<!-- v4.43: lesson, assessment, collection, categories, certificate, review-mistakes, collection-builder, and lesson-complete were also migrated to safe-area-context SafeAreaView with explicit top edges; apps/mobile/app no longer imports SafeAreaView from react-native -->
<!-- v4.44: bottom inset handling was standardized on key screens with absolute footers and tab content; lesson, assessment, collection, course, target-detail, and lesson-complete now better avoid the home indicator and tab bar on real devices -->
<!-- v4.45: certificate, review-mistakes, and collection-builder now also use safe-area bottom insets for long-form scroll content, reducing fixed bottom padding assumptions across utility/detail screens -->
<!-- v4.46: auth and onboarding now also reduce fixed bottom assumptions; sign-in, sign-up, and onboarding-step-1 use safe-area bottom insets for scroll/sheet spacing, while onboarding intro and image-based steps 2-4 now opt into bottom safe-area edges -->
<!-- v4.47: image-mapped auth/onboarding CTA hitboxes at the bottom of the screen are now anchored by bottom percentages instead of top percentages, making them more stable across real-device aspect ratios and safe-area variations -->
<!-- v4.48: onboarding-step-4 now explicitly calls completeOnboarding before entering tabs, making the final onboarding step itself authoritative for onboarding completion instead of relying only on intro-3 -->
<!-- v4.49: tabs and sign-in now also respect onboardingComplete, preventing direct-route or direct-login bypass into /(tabs) before onboarding is actually completed -->
<!-- v4.50: protected deep routes outside /(tabs) now also honor auth bootstrap + onboardingComplete; course, target-detail, lesson, assessment, certificate, review-mistakes, and collection-builder redirect cleanly instead of falling into blank/loading states when opened without a valid session -->
<!-- v4.51: lesson-complete now follows the same auth/onboarding guard policy as the rest of the deep learning flow, closing the remaining direct-open gap outside /(tabs) -->
<!-- v4.52: the auth route group now redirects fully authenticated+onboarded users away from /(auth), keeping sign-in/sign-up/onboarding screens from reopening on top of a completed session -->
<!-- v4.53: auth layout now distinguishes intro vs info-step routes, blocking no-token deep links into onboarding-step-* and redirecting token-holding but not-yet-onboarded users away from sign-in/sign-up back into onboarding -->
<!-- v4.54: intro-3 now marks only intro completion, while onboarding-step-4 remains the sole place that marks onboardingComplete; app entry, auth layout, and sign-in now distinguish introComplete from onboardingComplete to keep intro flow and questionnaire flow consistent -->
<!-- v4.55: onboarding completion is now stored per user id in mobile secure storage with legacy fallback; sign-in returns the resolved onboarding state for the logged-in account, preventing stale state reads and cross-user onboarding leakage on shared devices -->
<!-- v4.56: legacy onboarding fallback is now bootstrap-only for migrating preexisting sessions; normal sign-in reads only user-scoped onboarding state, preventing the old global key from leaking completion across different accounts -->
<!-- v4.57: completing onboarding no longer rewrites the legacy global onboarding key; the legacy key is now read only during bootstrap migration and cleared after use, making the user-scoped onboarding migration one-way -->
<!-- v4.58: bootstrap now also migrates introComplete for preexisting authenticated sessions, preventing older logged-in users from being sent back through intro screens just because the newer intro key was absent -->
<!-- v4.59: deep routes that require params now redirect cleanly instead of rendering vague error states; assessment, course, lesson, target-detail, lesson-complete, and collection detail/study now guard missing ids/types and fall back to the appropriate entry screen -->
<!-- v4.60: collection-builder now handles invalid or missing collection ids deterministically; if a requested collection no longer exists it falls back to the first available collection or to folder-creation mode instead of opening an unusable flashcard form -->
<!-- v4.61: the shared mobile api helper now preserves parsed backend error messages correctly instead of swallowing them in its own JSON parse catch; route constants also encode dynamic ids/types before composing request URLs -->
<!-- v4.62: target, categories, and collection tabs now surface real fetch failures instead of collapsing into misleading empty states; these screens were also rewritten cleanly in UTF-8 while preserving current flow -->
<!-- v4.63: dynamic detail screens now reset stale runtime state when route params change; assessment, course, lesson, target-detail, collection detail/study, and collection-builder clear old data/UI state before refetching or syncing to a new route context -->
<!-- v4.64: home, profile, certificate, and review-mistakes now clear stale screen state before refetching on session changes; review-mistakes also now surfaces real fetch failures instead of silently degrading into an empty state -->
<!-- v4.65: collection-builder now surfaces real load/save failures and no longer relies on silent finally-only flows; lesson list requests now encode courseId correctly, and the shared mobile API helper now shows clean Vietnamese timeout/network errors instead of mojibake -->
<!-- v4.66: content-service was rewritten cleanly in UTF-8 from current-state logic, preserving the real API flow while fixing shared filter labels and keeping lesson courseId requests encoded consistently -->
<!-- v4.67: certificate screen was rewritten cleanly in UTF-8 from current-state logic, fixing visible mojibake in its error, header, hero, and CTA copy while also making its data effect respond to onboarding state -->
<!-- v4.68: home and profile tabs were rewritten cleanly in UTF-8 from current-state logic, removing another high-visibility layer of mojibake from session errors, inline info cards, labels, and primary CTA copy while preserving the existing API-driven flow -->
<!-- v4.69: course detail was rewritten cleanly in UTF-8 from current-state logic, removing visible mojibake from error/header/info/tab/lesson metadata/description/CTA copy while preserving the current API-driven course -> lesson flow -->
<!-- v4.70: assessment was rewritten cleanly in UTF-8 from current-state logic, removing visible mojibake from intro, quiz, feedback, result, and CTA copy while preserving the current assessment submit -> recommended course flow -->
<!-- v4.71: lesson was rewritten cleanly in UTF-8 from current-state logic, removing visible mojibake from hero copy, quiz copy, feedback copy, and bottom CTA while preserving the current lesson -> quiz -> lesson-complete flow -->
<!-- v4.72: lesson-complete was rewritten cleanly in UTF-8 from current-state logic, removing visible mojibake from title, fallback lesson name, stats labels, and bottom CTA while preserving the current return-to-course/lesson behavior -->
<!-- v4.73: lesson loading no longer fails hard when background lesson-access tracking fails; markLessonAccess is now treated as a non-blocking side effect so content still renders even if progress logging has a transient error -->
<!-- v4.74: lesson and assessment now surface submit failures inline instead of leaving users with no visible feedback when final quiz/assessment submission fails -->
<!-- v4.75: review-mistakes and the collection tab flow were rewritten cleanly again from current-state logic; collection now surfaces load failures for detail routes instead of silently collapsing back to overview -->
<!-- v4.76: home no longer fails the entire screen when the secondary lesson-preview request fails; targets/courses render first and lesson suggestions now degrade gracefully if getLessons has a transient error -->
<!-- v4.77: sign-in and sign-up were rewritten cleanly again from current-state logic, removing another batch of visible mojibake from auth entry screens while preserving the existing real backend auth flow -->
<!-- v4.78: collection-builder was rewritten cleanly again from current-state logic; its folder/flashcard forms now clear stale error state during input changes and reset local form state more cleanly after successful create actions -->
<!-- v4.79: profile and certificate were rewritten cleanly again from current-state logic, continuing the removal of visible mojibake from core profile/certificate routes while preserving the current API-driven flow -->
<!-- v4.80: profile sign-out now has explicit action state and inline failure feedback instead of relying on a floating signOut promise with no visible error path if session clearing fails -->
<!-- v4.81: assessment now blocks its start CTA when the backend returns no questions, showing an inline explanation instead of allowing users into an empty quiz state -->
<!-- v4.82: lesson now blocks its bottom CTA when the backend returns no quiz items, showing an inline explanation instead of looping users back into the lesson screen with no visible quiz state -->
