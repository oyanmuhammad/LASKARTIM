# 🏛️ LASKARTIM - Layanan Aspirasi Karang Baru Timur

Platform transparansi publik berbasis web untuk menyampaikan aspirasi, keluhan, dan saran pembangunan untuk Desa Karang Baru Timur, Lombok Timur. Proyek ini merupakan hasil kolaborasi antara Pemerintah Desa Karang Baru Timur dan tim KKN 31 Fakultas Teknik Universitas Hamzanwadi (UNHAZ).

---

## 📋 Tentang Proyek

LASKARTIM adalah sistem manajemen aspirasi masyarakat yang dirancang khusus untuk meningkatkan transparansi dan partisipasi warga Desa Karang Baru Timur dalam pembangunan desa. Platform ini menyediakan kanal komunikasi dua arah antara masyarakat dan pemerintah desa.

### 🎯 Tujuan Utama

- **Transparansi**: Menyediakan akses publik terhadap aspirasi yang masuk dan status penanganannya
- **Partisipasi**: Memudahkan warga menyampaikan aspirasi tanpa harus datang langsung ke kantor desa
- **Akuntabilitas**: Meningkatkan tanggung jawab pemerintah desa dalam menindaklanjuti aspirasi masyarakat
- **Efisiensi**: Mempercepat proses pencatatan dan pengelolaan aspirasi masyarakat

### ✨ Fitur Utama

#### Untuk Masyarakat:
- 📝 **Pengajuan Aspirasi Online** - Formulir pengajuan yang mudah digunakan dengan validasi NIK
- 🔍 **Tracking Status** - Melihat status penanganan aspirasi secara publik
- 📊 **Dashboard Publik** - Transparansi data aspirasi yang telah masuk
- 🌓 **Dark/Light Mode** - Kenyamanan tampilan untuk berbagai kondisi

#### Untuk Administrator:
- 🔐 **Autentikasi Aman** - Sistem login dengan better-auth untuk keamanan maksimal
- 📊 **Dashboard Admin** - Statistik dan overview semua laporan
- ✅ **Manajemen Status** - Update status laporan (Draft, In Progress, Completed)
- 👥 **Manajemen NIK** - Kelola database NIK warga yang valid
- 🔄 **Update Profil** - Kelola profil administrator
- 🔒 **Ganti Password** - Fitur keamanan untuk mengubah password

#### Keamanan & Validasi:
- 🛡️ **Rate Limiting** - Proteksi dari spam dengan pembatasan 3 percobaan per IP
- ✔️ **Validasi NIK** - Verifikasi NIK dengan database resmi desa
- 🚫 **Spam Prevention** - Pembatasan 3 laporan per NIK per hari
- 🔒 **IP Blocking** - Pemblokiran otomatis IP yang mencurigakan selama 5 jam

---

## 🚀 Cara Kerja Platform

### Alur Sistem untuk Masyarakat

```
1. Warga mengakses website LASKARTIM
                ↓
2. Mengisi formulir aspirasi (NIK, Kategori, Lokasi, Judul, Deskripsi)
                ↓
3. Sistem melakukan validasi:
   - Format NIK (16 digit)
   - NIK terdaftar di database desa
   - Rate limiting (max 3 percobaan)
   - Spam checking (max 3 laporan/hari)
                ↓
4. Laporan tersimpan dengan status DRAFT
                ↓
5. Warga dapat melihat laporan mereka di halaman publik
```

### Alur Sistem untuk Administrator

```
1. Admin login ke dashboard
                ↓
2. Melihat statistik dan daftar semua laporan
                ↓
3. Meninjau laporan yang masuk
                ↓
4. Mengubah status laporan:
   - DRAFT (baru masuk)
   - IN_PROGRESS (sedang ditangani)
   - COMPLETED (selesai ditangani)
                ↓
5. Mengelola database NIK warga
                ↓
6. Update akan langsung terlihat di halaman publik
```

### Mekanisme Keamanan

**Rate Limiting:**
- Setiap IP address dibatasi maksimal 3 percobaan gagal
- Setelah 3 kali gagal, IP akan diblokir selama 5 jam
- Proteksi terhadap brute force attacks

**Spam Prevention:**
- Setiap NIK dibatasi maksimal 3 laporan per hari
- Mencegah penyalahgunaan sistem
- Memastikan kualitas laporan yang masuk

**Validasi NIK:**
- NIK harus terdaftar di database desa
- Format NIK harus valid (16 digit angka)
- NIK harus dalam status aktif

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)
- **Notifications**: Sonner (Toast notifications)

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma 6.18
- **Authentication**: Better Auth v1.3
- **Password Hashing**: bcryptjs
- **Validation**: Zod (built into schemas)

### Development Tools
- **Runtime**: Node.js
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript 5

---

## � Struktur Folder

### `/app` - Next.js App Router
Berisi semua halaman dan routing aplikasi:

#### `/app/actions` - Server Actions
- `submit-report.ts` - Logika pengajuan laporan
- `validate-nik.ts` - Validasi NIK warga
- `get-public-reports.ts` - Ambil data laporan publik
- `/admin/*` - Actions khusus admin (CRUD laporan & NIK)
- `/auth/*` - Actions autentikasi (login, logout, update profile)

#### `/app/api` - API Routes
- `/auth/[...all]/route.ts` - Better Auth API handler

#### Halaman Publik
- `page.tsx` - Landing page dengan semua section
- `/aspirasi/page.tsx` - Halaman daftar aspirasi publik dengan filter & pagination

#### Dashboard Admin
- `/login/page.tsx` - Halaman login administrator
- `/dashboard/layout.tsx` - Layout dashboard dengan sidebar
- `/dashboard/page.tsx` - Dashboard utama dengan statistik
- `/dashboard/reports/page.tsx` - Manajemen semua laporan
- `/dashboard/nik/page.tsx` - Manajemen database NIK
- `/dashboard/profile/page.tsx` - Update profil admin
- `/dashboard/change-password/page.tsx` - Ganti password

### `/components` - React Components
Komponen UI yang dapat digunakan kembali:

#### Landing Page Sections
- `navbar.tsx` - Navigation bar dengan mode toggle
- `hero-section.tsx` - Header utama dengan CTA
- `collaboration-section.tsx` - Info kolaborasi
- `features-section.tsx` - Fitur-fitur platform
- `testimonial-section.tsx` - Testimoni pengguna
- `mission-section.tsx` - Visi misi platform
- `profile-section.tsx` - Profil desa
- `location-section.tsx` - Peta/lokasi desa
- `cta-section.tsx` - Call to action
- `faq-section.tsx` - Frequently Asked Questions
- `footer.tsx` - Footer website

#### Dashboard Components
- `login-form.tsx` - Form login admin
- `profile-form.tsx` - Form update profil
- `password-change-dialog.tsx` - Dialog ganti password
- `mode-toggle.tsx` - Toggle dark/light mode
- `theme-provider.tsx` - Context untuk tema

#### `/components/ui` - UI Primitives
Komponen dasar dari shadcn/ui:
- `button.tsx`, `input.tsx`, `label.tsx`
- `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`
- `table.tsx`, `badge.tsx`, `select.tsx`
- `accordion.tsx`, `pagination.tsx`
- `textarea.tsx`, `sonner.tsx`

### `/lib` - Utilities & Configurations
Library dan helper functions:

- `auth.ts` - Konfigurasi Better Auth
- `db.ts` - Prisma Client instance
- `utils.ts` - Utility functions (cn, dll)
- `rate-limiter.ts` - Logika rate limiting
- `spam-checker.ts` - Logika spam prevention

#### `/lib/validations` - Zod Schemas
- `report-schema.ts` - Validasi data laporan
- `nik-schema.ts` - Validasi data NIK
- `auth-schema.ts` - Validasi login/register
- `admin-schema.ts` - Validasi aksi admin

### `/prisma` - Database
- `schema.prisma` - Database schema definition
- `seed.ts` - Data seeding untuk development
- `/migrations` - Migration history

#### Database Models:
1. **Report** - Data laporan aspirasi
2. **NIKRecord** - Database NIK warga yang valid
3. **RateLimitRecord** - Tracking rate limit per IP
4. **User** - Data administrator
5. **Account** - OAuth accounts (Better Auth)
6. **Session** - User sessions (Better Auth)
7. **Verification** - Email verification tokens

### `/public` - Static Assets
File statis seperti gambar, favicon, dll.

### Config Files
- `next.config.ts` - Konfigurasi Next.js
- `tailwind.config.ts` - Konfigurasi Tailwind CSS
- `tsconfig.json` - Konfigurasi TypeScript
- `prisma.config.ts` - Konfigurasi Prisma
- `eslint.config.mjs` - Konfigurasi ESLint
- `postcss.config.mjs` - Konfigurasi PostCSS
- `components.json` - Konfigurasi shadcn/ui

---

## 🚀 Setup & Instalasi Lokal

### Prasyarat
- Node.js 18+ 
- PostgreSQL Database
- npm atau yarn atau pnpm

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/oyanmuhammad/web-layanan-aspirasi.git
   cd LASKARTIM
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Buat file `.env` di root project:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/laskartim"
   
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   
   # Better Auth Secret (generate random string)
   BETTER_AUTH_SECRET="your-secret-key-here"
   ```

4. **Setup Database**
   
   Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
   
   Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
   
   Seed database dengan data awal (optional):
   ```bash
   npm run prisma:seed
   ```

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

6. **Akses Aplikasi**
   - Website: `http://localhost:3000`
   - Login Admin: `http://localhost:3000/login`
   - Dashboard: `http://localhost:3000/dashboard`

### Database Management

**Lihat Database dengan Prisma Studio:**
```bash
npx prisma studio
```

**Create Migration (setelah edit schema):**
```bash
npx prisma migrate dev --name description_of_changes
```

**Reset Database:**
```bash
npx prisma migrate reset
```

---

## 🌐 Deployment ke Vercel

### Persiapan

1. **Setup Database Production**
   
   Buat PostgreSQL database di salah satu provider:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com/)
   - [Neon](https://neon.tech/)
   - [Railway](https://railway.app/)

2. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Deploy ke Vercel

#### Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Pilih repository `LASKARTIM`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Setup Environment Variables**
   
   Tambahkan di Vercel Dashboard → Settings → Environment Variables:
   
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   BETTER_AUTH_SECRET=your-production-secret
   ```

5. **Deploy**
   - Click "Deploy"
   - Tunggu proses build selesai
   - Website akan live di `https://your-project.vercel.app`

#### Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Untuk production:
   ```bash
   vercel --prod
   ```

### Post-Deployment

1. **Run Database Migration**
   
   Jalankan migration di production database:
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed Data (Optional)**
   
   Jika perlu data awal:
   ```bash
   npm run prisma:seed
   ```

3. **Buat Admin User Pertama**
   
   Gunakan Prisma Studio atau langsung via database untuk membuat user admin pertama:
   ```sql
   INSERT INTO "User" (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
   VALUES (
     'admin-001',
     'admin@laskartim.com',
     '$2a$10$hashedPasswordHere', -- hash password dengan bcrypt
     'Administrator',
     'ADMIN',
     true,
     NOW(),
     NOW()
   );
   ```

### Custom Domain (Optional)

1. Beli domain di provider (Namecheap, GoDaddy, dll)
2. Di Vercel Dashboard → Settings → Domains
3. Add domain dan ikuti instruksi DNS configuration
4. Update `NEXT_PUBLIC_APP_URL` di environment variables

### Monitoring & Maintenance

- **Logs**: Vercel Dashboard → Deployments → [deployment] → Runtime Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Environment Variables**: Update di Settings → Environment Variables
- **Redeployment**: Otomatis setiap git push ke main branch

---

## 📝 Scripts Available

```bash
# Development
npm run dev          # Jalankan dev server di localhost:3000

# Production
npm run build        # Build untuk production
npm start            # Jalankan production build

# Database
npm run prisma:seed  # Seed database dengan data awal

# Code Quality
npm run lint         # Cek kode dengan ESLint
```

---

## 🔐 Default Credentials

Setelah menjalankan seed (development):
```
Email: admin@laskartim.com
Password: admin123
```

**⚠️ PENTING:** Ubah password default segera setelah login pertama kali!

---

## 📊 Database Schema Overview

```
Report (Laporan Aspirasi)
├── id: String (CUID)
├── nik: String (16 digit)
├── title: String (max 50 char)
├── category: String
├── location: Enum (3 dusun)
├── description: String (max 500 char)
├── status: Enum (DRAFT, IN_PROGRESS, COMPLETED)
└── timestamps

NIKRecord (Data NIK Valid)
├── nik: String (PK, 16 digit)
├── name: String
├── isActive: Boolean
└── timestamps

RateLimitRecord (Rate Limiting)
├── ip: String (PK)
├── attempts: Int
├── blockedUntil: DateTime
└── lastAttempt: DateTime

User (Administrator)
├── id: String (CUID)
├── email: String (unique)
├── password: String (hashed)
├── name: String
├── role: String (ADMIN)
└── Better Auth relations
```

---

## 🤝 Kontribusi

Proyek ini dikembangkan oleh:
- **Pemerintah Desa Karang Baru Timur**
- **Tim KKN 31 Fakultas Teknik UNHAZ**

---

## 📄 License

Proyek ini dikembangkan untuk kepentingan publik Desa Karang Baru Timur.

---

## 📞 Kontak & Support

Untuk pertanyaan atau dukungan teknis, hubungi:
- Email: admin@laskartim.com
- GitHub Issues: [Report Issue](https://github.com/oyanmuhammad/web-layanan-aspirasi/issues)

---

**Dikembangkan dengan ❤️ untuk Desa Karang Baru Timur, Lombok Timur**