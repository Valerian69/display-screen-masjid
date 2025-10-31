# Aplikasi Layar Display Sholat Masjid

'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.

Proyek ini telah bersumber terbuka sebagai bentuk sedekah jariyah - semoga Allah memberi reward untuk setiap kontribusi, baik teknis maupun non-teknis dan mereka yang berbagi dengan orang lain.

## Pendahuluan

Aplikasi layar display sholat masjid modern dengan dukungan penuh Bahasa Indonesia, sistem admin yang komprehensif, dan integrasi API MyQuran untuk waktu sholat akurat di seluruh Indonesia. Aplikasi ini berjalan sebagai aplikasi web progresif offline yang kompatibel dengan browser modern.

Versi aplikasi ini menggantikan [versi asli](https://github.com/Mosque-Screens/Mosque-Screen) yang dibuat bersama dengan [East London Mosque](https://www.eastlondonmosque.org.uk/).

Komentar tentang mengapa kami membangun versi ini dapat ditemukan di blog berikut: [https://medium.com/mosque/design-concept-direction-for-mosque-screens-51c4f9bb82](https://medium.com/mosque/design-concept-direction-for-mosque-screens-51c4f9bb82).

Kontributor asli proyek ini dapat ditemukan [di sini](https://github.com/Mosque-Screens/Mosque-Screen#contributors-wall-of-fame).

Terima kasih khusus harus diberikan kepada [UK Government Digital Service](https://www.gov.uk/government/organisations/government-digital-service) yang menyediakan hari-hari sukarela yang memungkinkan proyek asli menjadi kenyataan.

## Fitur

### 🇮🇩 **Bahasa Indonesia Penuh**
- Seluruh antarmuka dalam Bahasa Indonesia
- Nama sholat dalam bahasa Arab dan Indonesia
- Format tanggal Hijriyah dan Masehi

### 🕌 **Integrasi API MyQuran**
- Waktu sholat akurat untuk 347+ kota di Indonesia
- Data langsung dari api.myquran.com/v2
- Pemilihan kota dinamis melalui panel admin
- Update otomatis dan cache sistem

### ⚙️ **Panel Admin Modern**
- Login aman dengan session management
- Pengaturan informasi masjid (nama, alamat, logo)
- Sistem pengumuman dengan running text
- Pemilihan lokasi/kota dari 347+ pilihan
- Pengaturan tampilan dan animasi
- Perubahan real-time langsung ke layar utama

### 📱 **Responsive Design**
- Tampilan optimal untuk TV Full HD 1080p
- Mode TV dan mobile yang responsif
- Progressive Web App (PWA) support
- Offline functionality

### 📢 **Sistem Pengumuman**
- Running text marquee yang dapat dikustomisasi
- Animasi, warna, dan ukuran teks fleksibel
- Multiple pengumuman dengan manajemen mudah
- Integrasi real-time dengan layar display

### ⚡ **Real-time Updates**
- Perubahan admin langsung terlihat di layar utama
- Custom event system untuk sinkronisasi data
- Cache management yang optimal

Untuk melacak fitur yang diimplementasikan dan dalam jalur pipa, silakan lihat papan proyek kami:
https://github.com/orgs/MosqueOS/projects/1/views/1

Jika Anda ingin meminta fitur baru, silakan ajukan masalah di repo ini dengan deskripsi apa yang Anda inginkan.

## Demo

Anda dapat melihat demo yang berfungsi di sini:
[https://mosque-prayer-display-screen.vercel.app/](https://mosque-prayer-display-screen.vercel.app/)

Semua kode ada di sini:
[https://github.com/MosqueOS/Mosque-Prayer-Display-Screen](https://github.com/MosqueOS/Mosque-Prayer-Display-Screen)

## Tangkapan Layar

### Tampilan Masjid

<img src="./public/demo-mosque-view-1.png" />

<img src="./public/demo-mosque-view-2.png" />


### Aplikasi Mobile

<img src="./public/demo-mobile-view.png" width="500px" />


## Cara Mengatur sebagai Masjid

### Prasyarat

- Node.js (versi 18 atau lebih tinggi)
- npm atau yarn
- Browser modern dengan dukungan JavaScript

### Pengaturan Cepat (Development)

#### Langkah 1: Clone Repository

```bash
git clone https://github.com/your-username/display-screen-masjid.git
cd display-screen-masjid
```

#### Langkah 2: Install Dependencies

```bash
npm install
```

#### Langkah 3: Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3001` (atau port lain jika 3001 digunakan).

### Pengaturan Panel Admin

1. **Buka Panel Admin**: Kunjungi `http://localhost:3001/admin`
2. **Login**: Gunakan kredensial default:
   - Username: `admin`
   - Password: `admin123`
   - **Penting**: Ganti password ini di production!
3. **Konfigurasi Masjid**:
   - Buka tab "Informasi Masjid" untuk mengubah nama dan alamat
   - Buka tab "Pilih Lokasi Masjid" untuk memilih kota Anda
   - Buka tab "Pengumuman" untuk mengelola pengumuman running text
   - Buka tab "Pengaturan" untuk menyesuaikan tampilan

### Integrasi API MyQuran

Aplikasi sudah terintegrasi dengan API MyQuran untuk waktu sholat otomatis:
- **347+ kota tersedia** di seluruh Indonesia
- Data tersimpan dalam cache 24 jam untuk performa
- Update otomatis tanpa konfigurasi manual

**Catatan**: Tidak diperlukan setup spreadsheet atau API endpoint manual seperti versi sebelumnya.

### Deploy ke Production

#### Opsi 1: Vercel (Recommended)

1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup of mosque display system"
   git push origin main
   ```

2. **Deploy ke Vercel**:
   - Kunjungi [vercel.com](https://vercel.com)
   - Import repository GitHub Anda
   - Vercel akan otomatis mendeteksi ini sebagai aplikasi Next.js
   - Klik "Deploy"

#### Opsi 2: Build Manual

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

### Langkah 4: Uji display Anda

Setelah aplikasi Anda dideploy:
1. **Uji tampilan utama** di `http://your-domain.com`
2. **Uji panel admin** di `http://your-domain.com/admin`
3. **Pastikan berfungsi di TV** yang akan digunakan untuk masjid
4. **Aplikasi dioptimalkan untuk layar TV Full HD 1080p**

### Konfigurasi Production

**PENTING**: Sebelum production, pastikan untuk:
- Ganti default admin password (`admin123`)
- Konfigurasi kota lokasi masjid Anda
- Sesuaikan nama dan alamat masjid
- Atur pengumuman yang diinginkan

### Hal opsional yang mungkin ingin Anda lakukan

#### Domain kustom

Anda dapat mengatur domain kustom seperti: prayertime.mymosque.com

Jika Anda ingin memperbarui domain Anda, Anda dapat melakukannya dengan mengikuti dokumentasi Vercel:
[https://vercel.com/docs/projects/domains/add-a-domain](https://vercel.com/docs/projects/domains/add-a-domain)

#### Variabel lingkungan

|KUNCI|NILAI|DEFAULT|DESKRIPSI|
|-|-|-|-|
|NEXT_PUBLIC_APP_URL|http://localhost:3001|http://localhost:3001|URL dasar aplikasi|
|UPCOMING_PRAYER_DAY|3|3 hari mendatang ditampilkan di slider|Berapa banyak hari mendatang yang ditampilkan di bagian geser|
|SLIDE_TRANSITION_TIME|7|7 detik|Berapa lama setiap slide ditampilkan di bagian geser|

**Catatan**: Versi ini tidak memerlukan `MOSQUE_API_ENDPOINT` karena menggunakan API MyQuran langsung.

### 🏗️ **Struktur Proyek**

```
display-screen-masjid/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel admin routes
│   ├── login/             # Login page
│   └── page.tsx           # Main display page
├── components/            # React components
│   ├── Admin/            # Admin panel components
│   ├── AnnouncementMarquee/
│   ├── Blackout/
│   ├── Clock/
│   ├── PrayerTimes/
│   └── ...
├── services/             # API services
│   ├── MyQuranService.ts    # MyQuran API integration
│   ├── AdminService.ts      # Admin authentication & data
│   └── EnhancedMosqueDataService.ts
├── types/                # TypeScript type definitions
├── constants/            # Constants dan translations
└── public/              # Static assets
```

### 🔧 **Teknologi yang Digunakan**

- **Framework**: Next.js 15 dengan App Router
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **API**: MyQuran API (api.myquran.com/v2)
- **State Management**: React Hooks + Custom Events
- **Authentication**: LocalStorage dengan session management
- **Cache**: localStorage dengan 24-hour expiry
- **PWA**: Service Worker support

## Pengaturan Dev

```sh
cp .env.local.example .env.local
```

```sh
npm install
```

```sh
npm run dev
```

## Pengaturan Raspberry Pi

Raspberry Pi (RPI) adalah cara mudah untuk menjalankan layar, layar tidak memerlukan terlalu banyak daya - komputer ringan seperti RPI sudah cukup.

Anda dapat membelinya dari pemasok resmi: https://www.raspberrypi.com/products/

Kami sarankan Anda membeli casing dengan kipas atau solusi pendinginan panas - layar akan berjalan sepanjang hari jadi baik untuk memiliki solusi pendinginan yang baik.

### Langkah-langkah pengaturan RPI

0. Install [Raspberry Pi OS](https://www.raspberrypi.com/software/) pada Kartu SD
1. Install [chromium-browser](https://www.chromium.org/getting-involved/download-chromium) - **Lakukan langkah ini hanya jika Anda tidak memiliki Chromium**
2. Buka Terminal
3. `cd .config`
4. `sudo mkdir -p lxsession/LXDE-pi`
5. `sudo nano lxsession/LXDE-pi/autostart`
6. Tambahkan baris berikut di akhir file:

```sh
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
point-rpi
@chromium-browser --noerrdialogs --noerrors --disable-session-crashed-bubble --disable-features=InfiniteSessionRestore --disable-infobars --start-fullscreen --start-maximized --app=https://mosque-prayer-display-screen.vercel.app
```

(pastikan untuk mengganti `--app=https://mosque-prayer-display-screen.vercel.app` dengan URL Anda)

7. `sudo reboot`
8. Setelah reboot, itu harus mulai dengan start-up ke layar Anda secara otomatis.

## 🚨 **Keamanan**

### Production Security Checklist

- [ ] Ganti default admin password (`admin123`)
- [ ] Gunakan HTTPS di production
- [ ] Validasi input di panel admin
- [ ] Rate limiting untuk API calls
- [ ] Regular security updates

### Admin Credentials Default

**⚠️ HANYA UNTUK DEVELOPMENT ⚠️**
- Username: `admin`
- Password: `admin123`

**PENTING**: Selalu ganti password default di production environment!

## 🛠️ **Troubleshooting**

### Masalah Umum

#### City changes tidak terlihat di main page
- **Solusi**: Refresh browser dan buka console untuk debugging logs
- **Check**: Pastikan tidak ada error JavaScript di console

#### API MyQuran tidak responsif
- **Solusi**: Tunggu 24 jam untuk cache reset atau clear browser cache
- **Check**: Koneksi internet harus stabil

#### Admin panel tidak bisa login
- **Solusi**: Clear localStorage dan refresh browser
- **Check**: Username dan password yang benar

#### Blank page atau error
- **Solusi**: Check browser console untuk error details
- **Check**: Pastikan Node.js versi 18+ terinstall

### Debug Mode

Aktifkan debug logging dengan membuka browser developer console. Logs akan menampilkan:
- City ID yang digunakan untuk API calls
- Cache status
- Error details jika ada

## 🤝 **Kontribusi**

Kontribusi sangat welcome! Silakan:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

### Development Guidelines

- Gunakan TypeScript untuk type safety
- Follow existing code style
- Add logging untuk debugging
- Test di multiple browsers

## 📄 **License**

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk details.

## Masih butuh bantuan?

### Dukungan Komunitas
- Bergabung dengan channel Discord kami: [https://discord.gg/CG7frj2](https://discord.gg/CG7frj2)
- Ajukan issue di GitHub untuk bug reports dan feature requests

### Dukungan Berbayar
Untuk dukungan berbayar dan setup kustom, hubungi:
- Email: [mosque.screens786@gmail.com](mailto:mosque.screens786@gmail.com)

---

**💡 Tips**: Simpan link README ini untuk referensi setup dan maintenance masa depan.