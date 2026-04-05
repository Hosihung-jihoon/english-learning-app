# 📚 SYSTEM CONTEXT — english-learning-app-t2
> **⚠️ BẮT BUỘC ĐỌC TRƯỚC KHI LÀM VIỆC.**
> File này là **bộ nhớ duy nhất** của toàn bộ dự án.
> Mọi phiên làm việc mới (AI hoặc thành viên mới) **phải đọc file này trước tiên**.
> Sau mỗi thay đổi lớn, hãy cập nhật file này.

---

## 1. Tổng quan dự án

| Trường | Giá trị |
|---|---|
| **Tên dự án** | English Learning App – Team 2 |
| **Loại** | Mobile App (React Native / Expo) |
| **Mục tiêu** | Ứng dụng học tiếng Anh hỗ trợ người dùng luyện từ vựng, ngữ pháp, kỹ năng nghe/đọc |
| **Nền tảng target** | Android, iOS, Web (Expo Router) |
| **Expo SDK** | ~55.0.0 |
| **React Native** | 0.83.4 |
| **React** | 19.2.0 |
| **TypeScript** | ~5.9.2 |
| **Routing** | Expo Router v55 (file-based) |
| **HTTP Client** | `fetch` (native, không dùng axios) |
| **New Architecture** | ✅ Bắt buộc từ SDK 55 (legacy arch đã bị loại bỏ) |
| **Trạng thái hiện tại** | 🟡 Đang phát triển — scaffold ban đầu |

---

## 2. Kiến trúc dự án

```
english-learning-app-t2/
│
├── app/                        # Expo Router – tất cả màn hình
│   ├── _layout.tsx             # Root layout (providers, themes)
│   ├── modal.tsx               # Modal screen
│   └── (tabs)/                 # Tab navigator
│       ├── _layout.tsx         # Tab bar config
│       ├── index.tsx           # Home tab
│       └── explore.tsx         # Explore tab
│
├── components/                 # UI components dùng lại
│   ├── ui/                     # Atomic UI components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
│
├── constants/
│   └── theme.ts                # Design tokens: màu sắc, font, spacing
│
├── hooks/                      # Custom React hooks
├── assets/                     # Hình ảnh, font, icon
├── scripts/                    # Utility scripts (reset-project, v.v.)
│
├── .env                        # 🔒 SECRET – KHÔNG commit (đã có trong .gitignore)
├── .env.example                # ✅ Template an toàn để commit
├── app.json                    # Expo config
├── package.json
├── tsconfig.json
├── .gitignore
├── .antigravityrules           # Quy tắc làm việc với AI Antigravity
└── system_context.md           # 📌 FILE NÀY – bộ nhớ dự án
```

---

## 3. Stack & Dependencies chính

### Runtime
| Package | Version | Mục đích |
|---|---|---|
| `expo` | ~55.0.0 | Framework chính |
| `expo-router` | ~55.0.10 | File-based routing |
| `react-native` | 0.83.4 | Core RN |
| `react` | 19.2.0 | UI library |
| `react-native-reanimated` | 4.2.1 | Animations |
| `react-native-gesture-handler` | ~2.30.0 | Gesture handling |
| `react-native-screens` | ~4.23.0 | Screen optimization |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets |
| `expo-haptics` | ~55.0.11 | Haptic feedback |
| `expo-image` | ~55.0.8 | Optimized image |
| `expo-constants` | ~55.0.11 | App constants |
| `expo-font` | ~55.0.6 | Custom fonts |
| `expo-linking` | ~55.0.11 | Deep linking |
| `expo-splash-screen` | ~55.0.15 | Splash screen |
| `expo-status-bar` | ~55.0.5 | Status bar control |
| `expo-system-ui` | ~55.0.13 | System UI |
| `expo-web-browser` | ~55.0.12 | In-app browser |
| `@expo/vector-icons` | ^15.0.3 | Icon set |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Tab navigation |

> **HTTP**: Dùng `fetch` API native — **không cài axios**. Xem mục "Quy ước HTTP / fetch" bên dưới.

### Dev
| Package | Version | Mục đích |
|---|---|---|
| `typescript` | ~5.9.2 | Type safety |
| `eslint` + `eslint-config-expo` | ^9.25.0 / ~55.0.0 | Linting |
| `@types/react` | ~19.2.10 | React type definitions |

---

## 4. Quy ước code

### Naming
- **File/folder**: `kebab-case` cho components (`themed-text.tsx`)
- **Component**: `PascalCase` (`ThemedText`)
- **Hook**: tiền tố `use` (`useColorScheme`)
- **Constant**: `UPPER_SNAKE_CASE` cho giá trị tĩnh

### TypeScript
- Luôn dùng TypeScript strict mode (`tsconfig.json` hiện tại)
- Tránh `any` – dùng `unknown` nếu cần
- Props interface đặt ngay trên component

### Styling
- Dùng `StyleSheet.create()` của React Native (không dùng inline style lớn)
- Design tokens lấy từ `constants/theme.ts`
- Hỗ trợ Dark Mode thông qua `useColorScheme()` hook

### Expo Router
- Màn hình mới: tạo file trong `app/` theo cấu trúc thư mục = URL path
- Layout chia sẻ: dùng `_layout.tsx`
- Tabs: thêm vào `app/(tabs)/`

### Quy ước HTTP / fetch
> ⚠️ Dự án dùng **`fetch` native**, KHÔNG dùng `axios`. Đây là ADR-005.

```ts
// ✅ ĐÚNG — dùng fetch
const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/lessons`);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();

// ❌ SAI — không import axios
import axios from 'axios';
```

**Pattern helper khuyến nghị** — tạo `lib/api.ts`:
```ts
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                    => apiFetch<T>(path),
  post:   <T>(path: string, body: unknown)     => apiFetch<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)     => apiFetch<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)                   => apiFetch<T>(path, { method: 'DELETE' }),
};
```

---

## 5. Environment Variables & Secrets

> **Quy tắc bất biến**: Không bao giờ commit secrets thật vào Git.

| File | Mục đích | Commit? |
|---|---|---|
| `.env` | Giá trị thật (API keys, secrets) | ❌ KHÔNG |
| `.env.example` | Template với placeholder | ✅ CÓ |

### Biến môi trường cần thiết (xem `.env.example`)
```bash
# API & Backend
EXPO_PUBLIC_API_BASE_URL=        # Base URL của backend API

# Authentication (nếu dùng)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=    # Google OAuth Client ID

# AI / External Services (nếu dùng)
EXPO_PUBLIC_OPENAI_API_KEY=      # OpenAI hoặc tương đương

# Analytics (nếu dùng)
EXPO_PUBLIC_ANALYTICS_KEY=
```

> **Lưu ý Expo**: Biến phải có tiền tố `EXPO_PUBLIC_` để truy cập từ client-side.
> Biến không có tiền tố này chỉ dùng được trong `app.config.js` (server-side build).

---

## 6. Luồng phát triển (Getting Started)

```bash
# 1. Clone repo
git clone <repo-url>
cd english-learning-app-t2

# 2. Cài dependencies
npm install

# 3. Tạo file env từ template
cp .env.example .env
# Điền giá trị thật vào .env (hỏi team lead)

# 4. Chạy dev server
npx expo start

# Mở trên:
# - Expo Go app (quét QR)
# - Android emulator: nhấn 'a'
# - iOS simulator: nhấn 'i'  
# - Web browser: nhấn 'w'
```

---

## 7. Các module / tính năng (cập nhật khi thêm)

| Module | Trạng thái | Màn hình | Người phụ trách |
|---|---|---|---|
| Home / Dashboard | 🟡 Scaffold | `app/(tabs)/index.tsx` | TBD |
| Explore | 🟡 Scaffold | `app/(tabs)/explore.tsx` | TBD |
| Vocabulary | ⬜ Chưa làm | — | TBD |
| Grammar | ⬜ Chưa làm | — | TBD |
| Listening | ⬜ Chưa làm | — | TBD |
| Reading | ⬜ Chưa làm | — | TBD |
| User Profile | ⬜ Chưa làm | — | TBD |
| Authentication | ⬜ Chưa làm | — | TBD |
| Progress Tracking | ⬜ Chưa làm | — | TBD |

---

## 8. Quyết định kiến trúc đã xác nhận (ADR)

| # | Quyết định | Lý do | Ngày |
|---|---|---|---|
| ADR-001 | Dùng Expo Router (file-based) | Đơn giản hóa navigation, deep linking built-in | 2026-04-05 |
| ADR-002 | TypeScript strict mode | Giảm bug runtime, IDE support tốt hơn | 2026-04-05 |
| ADR-003 | `StyleSheet.create` + theme tokens | Nhất quán UI, dễ maintenance | 2026-04-05 |
| ADR-004 | New Architecture bắt buộc (SDK 55) | Legacy arch bị loại bỏ, hiệu năng cao hơn | 2026-04-05 |
| ADR-005 | Dùng `fetch` native thay cho `axios` | Không thêm dependency, bundle nhỏ hơn, đủ dùng cho mọi use case | 2026-04-05 |

---

## 9. Lịch sử cập nhật

| Ngày | Phiên bản | Thay đổi | Người cập nhật |
|---|---|---|---|
| 2026-04-05 | v1.0 | Tạo file ban đầu từ scaffold Expo SDK 54 | AI (Antigravity) |
| 2026-04-05 | v1.1 | Nâng cấp Expo SDK 54 → 55 (RN 0.83.4, React 19.2.0); xác nhận fetch thay axios; xóa `newArchEnabled` khỏi app.json | AI (Antigravity) |

---

> 📌 **Khi kết thúc phiên làm việc**: Cập nhật bảng lịch sử, trạng thái module, và ADR nếu có quyết định mới.
