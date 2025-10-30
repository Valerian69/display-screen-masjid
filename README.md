# Aplikasi Layar Display Sholat Masjid

'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.

Proyek ini telah bersumber terbuka sebagai bentuk sedekah jariyah - semoga Allah memberi reward untuk setiap kontribusi, baik teknis maupun non-teknis dan mereka yang berbagi dengan orang lain.

## Pendahuluan

Aplikasi ini memungkinkan masjid untuk menjalankan layar display sholat untuk para jamaah dan juga aplikasi web progresif offline yang berjalan di browser modern mana pun.

Versi aplikasi ini menggantikan [versi asli](https://github.com/Mosque-Screens/Mosque-Screen) yang dibuat bersama dengan [East London Mosque](https://www.eastlondonmosque.org.uk/).

Komentar tentang mengapa kami membangun versi ini dapat ditemukan di blog berikut: [https://medium.com/mosque/design-concept-direction-for-mosque-screens-51c4f9bb82](https://medium.com/mosque/design-concept-direction-for-mosque-screens-51c4f9bb82).

Kontributor asli proyek ini dapat ditemukan [di sini](https://github.com/Mosque-Screens/Mosque-Screen#contributors-wall-of-fame).

Terima kasih khusus harus diberikan kepada [UK Government Digital Service](https://www.gov.uk/government/organisations/government-digital-service) yang menyediakan hari-hari sukarela yang memungkinkan proyek asli menjadi kenyataan.

## Fitur

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

- Akun Google

### Langkah 1: Buat salinan spreadsheet waktu sholat

Buka tautan berikut dan buat salinan spreadsheet:
[https://docs.google.com/spreadsheets/d/1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg/copy](https://docs.google.com/spreadsheets/d/1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg/copy).

### Langkah 2: Bagikan akses "viewer" ke spreadsheet dengan Akun Google kami

Klik tombol bagikan dan tambahkan `mosque.screens786@gmail.com` sebagai viewer. Kami tidak memerlukan akses tulis, jadi mohon jangan berikan kami ini.

Ini memungkinkan API kami mengakses spreadsheet Anda dan membaca data Anda.

### Langkah 3: Hasilkan API Endpoint

Untuk menghasilkan API endpoint, Anda perlu mengekstrak ID spreadsheet dari tautan spreadsheet Anda.

Misalnya, jika URL spreadsheet Anda adalah:

```
https://docs.google.com/spreadsheets/d/1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg/edit
```

ID Anda akan menjadi:

```
1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg
```

Anda kemudian menambahkan ID ini ke URL berikut, seperti ini:

```
https://api.mosque.tech/mosque-data/1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg
```

Anda dapat menggunakan alat berikut untuk secara otomatis menghasilkan API endpoint:
https://codepen.io/DilwoarH/full/mdvOexr

Catatan: Anda tidak perlu menggunakan API endpoint kami, Anda dapat menghasilkan endpoint Anda sendiri tetapi pastikan memiliki semua properti yang diperlukan.

### Langkah 4: Deploy aplikasi Anda

Kami saat ini menggunakan Vercel (kami menemukan yang lain tidak berfungsi dengan baik).

Klik tombol berikut:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMosqueOS%2FMosque-Prayer-Display-Screen&env=MOSQUE_API_ENDPOINT&envDescription=The%20Mosque%20API%20Key%20can%20be%20generated%20by%20following%20the%20README%20documents&envLink=https%3A%2F%2Fgithub.com%2FMosqueOS%2FMosque-Prayer-Display-Screen&project-name=mosque-prayer-display-screen&repository-name=Mosque-Prayer-Display-Screen)

### Langkah 5: Uji display Anda

Setelah aplikasi Anda dideploy, kunjungi URL dan uji layar Anda.
Pastikan berfungsi di TV yang ingin Anda gunakan untuk masjid. Aplikasi kami dirancang untuk layar TV Full HD 1080p.

### Hal opsional yang mungkin ingin Anda lakukan

#### Domain kustom

Anda dapat mengatur domain kustom seperti: prayertime.mymosque.com

Jika Anda ingin memperbarui domain Anda, Anda dapat melakukannya dengan mengikuti dokumentasi Vercel:
[https://vercel.com/docs/projects/domains/add-a-domain](https://vercel.com/docs/projects/domains/add-a-domain)

#### Variabel lingkungan

|KUNCI|NILAI|DEFAULT|DESKRIPSI|
|-|-|-|-|
|MOSQUE_API_ENDPOINT|https://api.mosque.tech/mosque-data/1o9dngtGJbfkFGZK_M7xdlo2PtRuQknGEQU3FxpiPVbg|DIWAJIBKAN - TIDAK ADA DEFAULT|Data dari Mosque API|
|BLACKOUT_PERIOD|13|13 menit|Berapa lama layar masjid Anda redup / mati selama sholat jamaah|
|UPCOMING_PRAYER_DAY|3|3 hari mendatang ditampilkan di slider|Berapa banyak hari mendatang yang ditampilkan di bagian geser|
|SLIDE_TRANSITION_TIME|7|7 detik|Berapa lama setiap slide ditampilkan di bagian geser|

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

## Masih butuh bantuan?

Kami tidak menyediakan dukungan gratis, Anda dapat bergabung dengan channel discord kami untuk mendapatkan bantuan dari komunitas menggunakan tautan undangan berikut: [https://discord.gg/CG7frj2](https://discord.gg/CG7frj2).

Jika Anda ingin dukungan berbayar, Anda dapat menghubungi kami di sini untuk harga: [mosque.screens786@gmail.com](mailto:mosque.screens786@gmail.com).