# English Learning App — Team 2

Ung dung hoc tieng Anh xay dung bang Expo (mobile) + Node.js (backend).

> **Danh cho thanh vien moi**: Doc tu dau den cuoi mot lan. Sau do moi ngay chi can lam theo [muc 4](#4-chay-du-an-moi-ngay).

---

## Danh muc

1. [Tong quan](#1-tong-quan)
2. [Cau truc thu muc](#2-cau-truc-thu-muc)
3. [Cai dat lan dau](#3-cai-dat-lan-dau)
4. [Chay du an moi ngay](#4-chay-du-an-moi-ngay)
5. [Huong dan theo vai tro](#5-huong-dan-theo-vai-tro)
6. [Dung AI ho tro cong viec](#6-dung-ai-ho-tro-cong-viec)
7. [Cac lenh hay dung](#7-cac-lenh-hay-dung)
8. [Xu ly loi thuong gap](#8-xu-ly-loi-thuong-gap)

---

## 1. Tong quan

| Thong tin | Chi tiet |
|---|---|
| **Ten** | English Learning App — Team 2 |
| **Muc tieu** | Ung dung hoc tieng Anh: tu vung, ngu phap, quiz, theo doi tien trinh |
| **Backend** | Node.js + Express + MongoDB |
| **Mobile** | React Native / Expo SDK 55 |
| **Ngon ngu** | TypeScript |

---

## 2. Cau truc thu muc

```
english-learning-app/
|
+-- api/                 Backend (may chu + API)
|   +-- src/
|   |   +-- routes/      Dinh nghia URL endpoint
|   |   +-- controllers/ Xu ly logic nghiep vu
|   |   +-- models/      Cau truc du lieu MongoDB
|   |   +-- middleware/  Xac thuc, phan quyen
|   |   +-- index.ts     Diem khoi dong may chu
|   +-- .env.example     Template bien moi truong backend
|   +-- package.json
|
+-- mobile/              Frontend (ung dung tren dien thoai)
|   +-- app/             Cac man hinh (Expo Router)
|   +-- components/      UI components dung lai
|   +-- hooks/           Custom React hooks
|   +-- assets/          Hinh anh, font, icon
|   +-- .env.example     Template bien moi truong mobile
|   +-- package.json
|
+-- shared/              Code dung chung (ca API va Mobile)
|   +-- types/           TypeScript interfaces: User, Lesson...
|   +-- constants/       API routes, hang so dung chung
|
+-- package.json         Scripts tien loi chay toan bo du an
+-- system_context.md    Bo nho du an — doc truoc khi lam viec
+-- README.md            File nay
```

> **Luu y quan trong**: Moi thu muc co file `.env.example`.
> Day la template — ban PHAI copy thanh `.env` va dien thong tin truoc khi chay du an.

---

## 3. Cai dat lan dau

> Chi can lam mot lan duy nhat sau khi clone ve may.

### Buoc 1: Cai dat cong cu

Mo **Terminal** (Command Prompt hoac PowerShell) kiem tra:

```bash
node --version
```

Neu thay loi `not recognized` → Tai **Node.js LTS** tai [nodejs.org](https://nodejs.org).

Cung can cai:
- **Expo Go** tren dien thoai (Tim trong App Store / Google Play)
- **VS Code** tai [code.visualstudio.com](https://code.visualstudio.com)

### Buoc 2: Clone du an

```bash
git clone https://github.com/Hosihung-jihoon/english-learning-app.git
cd english-learning-app
```

### Buoc 3: Cai dat thu vien

```bash
npm install
npm run install:all
```

Lan dau mat khoang 3–5 phut. Cho den khi hoan thanh.

### Buoc 4: Tao file bien moi truong

**Backend** — mo Terminal va chay:

```bash
copy api\.env.example api\.env
```

Mo file `api/.env` vua tao, dien vao (hoi leader de lay gia tri):

```
MONGO_URI=...        <- Duong dan ket noi MongoDB Atlas
JWT_SECRET=...       <- Chuoi bi mat bat ky, dai > 32 ky tu
PORT=5000
NODE_ENV=development
```

**Mobile** — chay:

```bash
copy mobile\.env.example mobile\.env
```

Mo file `mobile/.env`, dien vao:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Buoc 5: Thu chay

```bash
npm run dev
```

Neu thanh cong se thay:
- `[API] API running on port 5000` — backend dang chay
- Expo hien QR code — quet bang Expo Go de mo tren dien thoai

---

## 4. Chay du an moi ngay

Ba dong nay moi ngay:

```bash
git pull
npm run install:all
npm run dev
```

Khi bi loi khong ro, nhan `Ctrl+C` roi chay lai `npm run dev`.

---

## 5. Huong dan theo vai tro

### Member 1 — UI/UX Designer

**Nhiem vu**: Thiet ke giao dien man hinh tren dien thoai.

Chi can chay mobile, khong can chay API:

```bash
npm run dev:mobile
```

**Cac file ban lam viec chinh:**

| File | Mo ta |
|---|---|
| `mobile/app/(tabs)/index.tsx` | Man hinh Home |
| `mobile/app/(tabs)/explore.tsx` | Man hinh Explore |
| `mobile/components/` | Cac thanh phan UI dung lai |
| `mobile/constants/theme.ts` | Mau sac, font, spacing |

**Them man hinh moi**: Tao file `.tsx` trong `mobile/app/`.
Ten file = ten route. Vi du: `mobile/app/vocabulary.tsx` la man hinh `/vocabulary`.

---

### Member 2 — Tester

**Nhiem vu**: Test tinh nang, bao cao bug cho leader.

**Cach test tren dien thoai**:
1. Chay `npm run dev:mobile`
2. Quet QR code bang app **Expo Go**
3. Thu cac tinh nang va ghi lai loi

**Cach bao cao bug**:
1. Mo GitHub Issues cua repo
2. Tao Issue moi, tieu de: `[BUG] Mo ta ngan gon`
3. No dung ghi ro:
   - Loi xay ra o man hinh nao?
   - Lam gi thi bi loi?
   - Ket qua mong muon la gi?
   - (Neu co) Chup anh man hinh loi

---

## 6. Dung AI ho tro cong viec

> AI giup viet code, giai thich code, sua loi. Hoc cach dung de lam viec hieu qua hon.

### Cai Cursor — VS Code tich hop AI

Tai tai [cursor.sh](https://cursor.sh). Dung y het VS Code nhung co them AI chat.

**Mo du an**: `File > Open Folder` → chon thu muc `english-learning-app`.

**Noi chuyen voi AI**: Nhan `Ctrl+L` de mo chat.

---

### Buoc quan trong: Cho AI biet context

AI khong tu biet du an cua ban la gi. Truoc khi hoi, hay copy toan bo noi dung file `system_context.md` dan vao dau cau hoi.

**Tai sao?** Vi system_context.md chua tat ca thong tin ve du an nen AI se tra loi chinh xac hon rat nhieu.

---

### Cac mau prompt hay dung

**Tao component moi (Member 1):**

```
[Dan noi dung system_context.md vao day]

Toi can tao component ten la VocabularyCard.
Component hien thi mot the tu vung gom: tu tieng Anh, phien am, nghia tieng Viet.
Du an dung Expo SDK 55, React Native. Dung StyleSheet.create.
File dat o mobile/components/vocabulary-card.tsx
Hay viet code cho toi.
```

**Hieu mot doan code:**

```
Doan code nay lam gi? Giai thich bang tieng Viet, don gian.

[Dan doan code vao]
```

**Sua loi:**

```
Toi bi loi nay khi chay du an:

[Dan thong bao loi vao]

File bi loi: [ten file]
Giai thich loi la gi va cach sua.
```

**Khong biet bat dau tu dau:**

```
[Dan noi dung system_context.md vao day]

Toi la Member 1, phu trach UI/UX.
Toi can thiet ke man hinh hien thi danh sach bai hoc.
Huong dan toi nen lam gi truoc tien.
```

### Luu y

- Doc lai code AI viet truoc khi dung — AI co the sai
- Neu code khong chay: copy thong bao loi va hoi AI sua tiep
- Hoi lai nhieu lan neu chua hieu — AI khong ngan

---

## 7. Cac lenh hay dung

```bash
# Chay ca du an
npm run dev

# Chi chay backend API
npm run dev:api

# Chi chay mobile
npm run dev:mobile

# Cai lai tat ca thu vien (dung khi bi loi thu vien)
npm run install:all

# Kiem tra loi code
npm run lint

# Dong bo code moi nhat tu GitHub
git pull

# Xem nhung gi da thay doi
git status

# Luu thay doi len GitHub
git add .
git commit -m "feat(mobile): them man hinh tu vung"
git push
```

**Quy tac viet commit message:**

```
<loai>(<phan): <mo ta ngan>

loai:
  feat     = them tinh nang moi
  fix      = sua loi
  docs     = cap nhat tai lieu
  style    = chinh style/giao dien
  chore    = cap nhat cau hinh, thu vien

Phan: api | mobile | shared | root

Vi du:
  feat(mobile): them man hinh tu vung
  fix(api): sua loi ket noi MongoDB
  docs(root): cap nhat README
```

---

## 8. Xu ly loi thuong gap

### Loi: Cannot find module hoac Module not found

```bash
npm run install:all
```

### Loi: MongoDB connection failed

- Kiem tra `api/.env` co `MONGO_URI` chua
- Hoi leader lay gia tri MONGO_URI dung
- Kiem tra ket noi internet

### Loi: Network request failed (tren dien thoai)

Dien thoai va may tinh PHAI cung mang WiFi.

Lay IP may tinh:
```bash
ipconfig
```
Tim dong `IPv4 Address`, du kieu `192.168.x.x`.

Sua trong `mobile/.env`:
```
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:5000
```

### Loi: Port 5000 already in use

```bash
netstat -ano | findstr :5000
```
Xem so PID trong ket qua, roi:
```bash
taskkill /PID [so pid] /F
```

### Khong biet lam gi

1. Doc `system_context.md`
2. Hoi AI voi context day du (xem muc 6)
3. Hoi leader

---

## Tai lieu

| File/Link | Muc dich |
|---|---|
| `system_context.md` | Bo nho du an — doc truoc khi lam viec |
| `api/.env.example` | Template bien moi truong backend |
| `mobile/.env.example` | Template bien moi truong mobile |
| `.antigravityrules` | Quy tac lam viec voi AI Antigravity |
| [Expo Docs](https://docs.expo.dev) | Tai lieu Expo chinh thuc |
| [React Native Docs](https://reactnative.dev/docs) | Tai lieu React Native |