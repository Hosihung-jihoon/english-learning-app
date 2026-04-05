# English Learning App - Team 2

> Ung dung hoc tieng Anh da nen tang (Android - iOS - Web) xay dung bang **Expo SDK 55** + **React Native 0.83**.

[![Expo SDK](https://img.shields.io/badge/Expo-55.0.0-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.83.4-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## Muc luc

- [Gioi thieu](#gioi-thieu)
- [Tech Stack](#tech-stack)
- [Cai dat va Chay du an](#cai-dat-va-chay-du-an)
- [Cau truc thu muc](#cau-truc-thu-muc)
- [Bien moi truong](#bien-moi-truong)
- [Scripts](#scripts)
- [Quy uoc dong gop](#quy-uoc-dong-gop)
- [Tai lieu du an](#tai-lieu-du-an)

---

## Gioi thieu

**English Learning App** la ung dung di dong giup nguoi dung hoc tieng Anh hieu qua thong qua cac module:

- **Tu vung** - flashcard, quiz theo chu de
- **Ngu phap** - bai hoc co vi du va bai tap
- **Nghe** - luyen nghe voi audio ban ngu
- **Doc** - doc hieu voi bai doc theo cap do
- **Theo doi tien trinh** - thong ke hoc tap ca nhan

---

## Tech Stack

| Cong nghe | Phien ban | Muc dich |
|---|---|---|
| [Expo](https://expo.dev) | ~55.0.0 | Framework chinh |
| [React Native](https://reactnative.dev) | 0.83.4 | UI Engine |
| [React](https://react.dev) | 19.2.0 | UI Library |
| [TypeScript](https://typescriptlang.org) | ~5.9.2 | Type safety |
| [Expo Router](https://expo.github.io/router) | ~55.0.10 | File-based navigation |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | 4.2.1 | Animations |
| fetch (native) | built-in | HTTP client (khong dung axios) |

> **New Architecture** bat buoc tu SDK 55 - legacy architecture da bi loai bo.

---

## Cai dat va Chay du an

### Yeu cau

- [Node.js](https://nodejs.org) >= 18
- [Git](https://git-scm.com)
- Dien thoai that cai [Expo Go](https://expo.dev/go) hoac Android Emulator / iOS Simulator

### Cac buoc

```bash
# 1. Clone repo
git clone https://github.com/Hosihung-jihoon/english-learning-app.git
cd english-learning-app

# 2. Cai dependencies
npm install

# 3. Tao file bien moi truong
cp .env.example .env
# Dien gia tri that vao .env

# 4. Khoi dong dev server
npx expo start
```

### Mo ung dung

| Phim | Nen tang |
|---|---|
| `a` | Android Emulator |
| `i` | iOS Simulator (macOS only) |
| `w` | Web Browser |
| Quet QR | Expo Go tren dien thoai that |

> SDK 55 khuyen nghi dung **Development Build** thay Expo Go cho production.

---

## Cau truc thu muc

```
english-learning-app-t2/
|
+-- app/                        # Expo Router - tat ca man hinh
|   +-- _layout.tsx             # Root layout
|   +-- modal.tsx               # Modal screen
|   +-- (tabs)/
|       +-- _layout.tsx
|       +-- index.tsx           # Home tab
|       +-- explore.tsx         # Explore tab
|
+-- components/                 # UI components dung lai
|   +-- ui/
|   +-- themed-text.tsx
|   +-- themed-view.tsx
|
+-- constants/
|   +-- theme.ts                # Design tokens
|
+-- hooks/                      # Custom React hooks
+-- assets/                     # Hinh anh, font, icon
|
+-- .env                        # SECRET - KHONG commit
+-- .env.example                # Template bien moi truong
+-- system_context.md           # Bo nho du an
+-- .antigravityrules           # Quy tac lam viec voi AI
+-- app.json
+-- package.json
+-- tsconfig.json
```

---

## Bien moi truong

Du an dung file `.env` de quan ly secrets. File nay **khong duoc commit** vao Git.

```bash
cp .env.example .env
```

Xem [.env.example](.env.example) de biet danh sach bien can thiet.

> Bien phai co tien to `EXPO_PUBLIC_` de truy cap tu client-side.

---

## Scripts

```bash
npm start              # Khoi dong Expo dev server
npm run android        # Mo tren Android emulator
npm run ios            # Mo tren iOS simulator
npm run web            # Mo tren trinh duyet
npm run lint           # Kiem tra loi ESLint
npm run reset-project  # Reset ve scaffold goc
```

---

## Quy uoc dong gop

### Commit message format

```
<type>(<scope>): <subject>
```

| Type | Khi nao dung |
|---|---|
| `feat` | Them tinh nang moi |
| `fix` | Sua bug |
| `docs` | Cap nhat tai lieu |
| `style` | Thay doi style/format |
| `refactor` | Refactor code |
| `chore` | Cap nhat config, dependencies |

**Vi du:**

```bash
git commit -m "feat(vocabulary): add flashcard component"
git commit -m "fix(auth): handle token expiry on 401"
```

### Checklist truoc khi tao PR

- [ ] Chay `npm run lint` - khong co loi
- [ ] File `.env` that khong nam trong staged changes
- [ ] Cap nhat `system_context.md` neu co thay doi kien truc

---

## Tai lieu du an

| File | Muc dich |
|---|---|
| [system_context.md](system_context.md) | **Bo nho du an** - doc truoc khi lam viec |
| [.env.example](.env.example) | Template bien moi truong |
| [.antigravityrules](.antigravityrules) | Quy tac lam viec voi AI Antigravity |

### Tai nguyen ngoai

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Docs](https://expo.github.io/router/docs)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)