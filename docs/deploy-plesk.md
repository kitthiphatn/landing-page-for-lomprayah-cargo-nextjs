# ขึ้นเว็บจริงบน Plesk (www.lomprayahcargo.com)

หลักการ: **build บน GitHub ไม่ใช่บนเซิร์ฟเวอร์** ทุกครั้งที่ merge เข้า `main` GitHub Actions จะ build แล้วเก็บไฟล์พร้อมรันไว้ใน [Releases](https://github.com/kitthiphatn/landing-page-for-lomprayah-cargo-nextjs/releases) บนเซิร์ฟเวอร์แค่ดาวน์โหลด แตกไฟล์ แล้วรีสตาร์ทเฉพาะเว็บนี้ ไม่มี `npm install` และไม่กิน CPU/RAM ของเว็บอื่น

เว็บนี้ใช้ทุกอย่างของตัวเอง: โฟลเดอร์ของตัวเอง, ไฟล์ฐานข้อมูล SQLite ของตัวเอง, Node.js ที่เปิดเฉพาะโดเมนนี้ ไม่แตะฐานข้อมูล MySQL/MariaDB หรือ Node ของโปรเจคอื่น

## โครงสร้างโฟลเดอร์บนเซิร์ฟเวอร์

ตัวอย่างใช้ `/var/www/vhosts/lomprayahcargo.com/cargo-web` ถ้า www.lomprayahcargo.com อยู่ใน subscription อื่น ให้เปลี่ยนเป็นโฟลเดอร์ใน subscription นั้น

```
cargo-web/
  app/        ตัวเว็บที่รันอยู่ (ถูกแทนที่ทุกครั้งที่ deploy)
  data/       lp-cargo.db ฐานข้อมูล (ไม่ถูกแทนที่)
  media/      รูปที่อัปโหลดจากหลังบ้าน (ไม่ถูกแทนที่)
  backups/    สำเนาฐานข้อมูลก่อน deploy แต่ละครั้ง (เก็บ 10 ชุดล่าสุด)
  releases/   เวอร์ชันก่อนหน้า (เก็บ 3 ชุดล่าสุด)
```

## ตั้งค่าครั้งแรก

### 1. ตรวจว่ามี build แล้ว

เปิดหน้า Actions ของ repo ดูว่า "Release build" ขึ้นเครื่องหมายถูก และหน้า Releases มีไฟล์ `lp-cargo-web.tar.gz`

### 2. สร้างโฟลเดอร์และติดตั้งครั้งแรก (SSH เป็น root)

```bash
SITE=/var/www/vhosts/lomprayahcargo.com/cargo-web
mkdir -p $SITE
chown --reference=/var/www/vhosts/lomprayahcargo.com/httpdocs $SITE
curl -fsSL -o $SITE/deploy.sh https://raw.githubusercontent.com/kitthiphatn/landing-page-for-lomprayah-cargo-nextjs/main/scripts/plesk/deploy.sh
bash $SITE/deploy.sh $SITE
```

สคริปต์จะเปลี่ยนเจ้าของไฟล์เป็น user ของ subscription ให้เอง เว็บจะได้เขียนฐานข้อมูลได้

### 3. ใส่เนื้อหาตั้งต้น (ทำครั้งเดียว ถ้าอยากได้ข่าว/หน้าเกี่ยวกับเราจาก lomprayah.com)

บนเครื่อง Windows ในโฟลเดอร์โปรเจค:

```
npm run seed:production
```

จะได้ไฟล์ `data\production.db` และโฟลเดอร์ `media-production\` (รูปข่าว) อัปโหลดขึ้นเซิร์ฟเวอร์ด้วย File Manager ของ Plesk หรือ WinSCP:

- `data\production.db` → `cargo-web/data/lp-cargo.db`
- ไฟล์ทั้งหมดใน `media-production\` → `cargo-web/media/`

แล้วรันบนเซิร์ฟเวอร์ `chown -R --reference=$SITE $SITE/data $SITE/media`

ข้ามขั้นนี้ได้ ถ้าจะกรอกเนื้อหาเองในหลังบ้าน ฐานข้อมูลเปล่าจะถูกสร้างให้อัตโนมัติตอนเปิดเว็บครั้งแรก

### 4. เปิด Node.js ใน Plesk

Websites & Domains → www.lomprayahcargo.com → **Hosting Settings**: ตั้ง Document root เป็น `cargo-web/app/public`

แล้วเข้า **Node.js** ของโดเมนนี้ ตั้งค่า:

| ช่อง                     | ค่า                         |
| ------------------------ | --------------------------- |
| Node.js Version          | 20.x                        |
| Package Manager          | npm (ไม่ต้องกด NPM install) |
| Document Root            | `/cargo-web/app/public`     |
| Application Mode         | production                  |
| Application Root         | `/cargo-web/app`            |
| Application Startup File | `server.js`                 |

**Custom environment variables** (กดเพิ่มทีละตัว):

| ชื่อ             | ค่า                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | `file:/var/www/vhosts/lomprayahcargo.com/cargo-web/data/lp-cargo.db`                                 |
| `MEDIA_DIR`      | `/var/www/vhosts/lomprayahcargo.com/cargo-web/media`                                                 |
| `PAYLOAD_SECRET` | สุ่มใหม่ด้วย `openssl rand -hex 32` แล้วเก็บไว้ อย่าเปลี่ยนภายหลัง (เปลี่ยนแล้วทุกคนต้องล็อกอินใหม่) |
| `NODE_ENV`       | `production`                                                                                         |

กด **Enable Node.js** แล้วกด **Restart App**

ค่า `NEXT_PUBLIC_SERVER_URL` และ `NEXT_PUBLIC_TRACKING_API` ไม่ต้องตั้งใน Plesk เพราะถูกใส่ไว้ตอน build บน GitHub แล้ว (www.lomprayahcargo.com และ https://api.lomprayahcargo.com/api) ถ้าวันหนึ่งย้ายโดเมน ให้ตั้งที่ GitHub → Settings → Secrets and variables → Actions → Variables แล้ว build ใหม่ และอย่าลืมเพิ่มโดเมนใหม่ใน CORS ของ API ก่อน

### 5. SSL และสร้างผู้ดูแล

- Websites & Domains → SSL/TLS Certificates → ออกใบรับรอง Let's Encrypt ให้ทั้ง `lomprayahcargo.com` และ `www`
- เปิด https://www.lomprayahcargo.com/admin **ทันที** แล้วสร้างบัญชีผู้ดูแลคนแรก (คนแรกที่เปิดหน้านี้จะได้สร้างบัญชี จึงควรทำเลยหลังเปิดเว็บ)

### 6. ตรวจหลังเปิดเว็บ

- หน้าแรก, /th/branches (รายชื่อสาขาโหลดจาก API), ลองค้นเลขพัสดุจริง
- หน้าหลังบ้านอัปโหลดรูปได้
- หน้าเว็บที่ build ไว้เป็นเนื้อหาเปล่า จะอัปเดตเป็นเนื้อหาจากฐานข้อมูลภายใน 1 นาทีหลังมีคนเปิด (หรือทันทีเมื่อกดบันทึกในหลังบ้าน)

## อัปเดตเว็บครั้งต่อไป

merge PR เข้า `main` → รอ Actions เขียว → SSH แล้วรัน

```bash
bash /var/www/vhosts/lomprayahcargo.com/cargo-web/deploy.sh /var/www/vhosts/lomprayahcargo.com/cargo-web
```

ถ้ามี migration ฐานข้อมูลใหม่ ระบบจะ apply ให้เองตอนเว็บเริ่ม (ฐานข้อมูลถูก backup ไว้ใน `backups/` ก่อนแล้ว)

## ย้อนกลับเวอร์ชัน

ดูชื่อ build ที่ต้องการในหน้า Releases เช่น `build-12` แล้วรัน

```bash
bash $SITE/deploy.sh $SITE build-12
```

ถ้าเวอร์ชันใหม่เปลี่ยนโครงสร้างฐานข้อมูลไปแล้ว ให้คืนฐานข้อมูลจาก `backups/` ด้วย: `cp $SITE/backups/lp-cargo-<เวลา>.db $SITE/data/lp-cargo.db` แล้ว Restart App

## Backup

ให้ Plesk Backup Manager รวมโฟลเดอร์ `cargo-web/data` และ `cargo-web/media` หรือคัดลอกสองโฟลเดอร์นี้ออกไปเก็บเป็นระยะ

## ถ้าเว็บไม่ขึ้น

- Plesk → Node.js → ดู log ของแอป หรือไฟล์ `logs/` ของโดเมน
- `SQLITE_CANTOPEN` หรือเขียนไม่ได้: เจ้าของไฟล์ผิด รัน `chown -R --reference=$SITE $SITE/data $SITE/media`
- หน้าเว็บขึ้นแต่ไม่มีสาขา: เซิร์ฟเวอร์เรียก https://api.lomprayahcargo.com ไม่ได้ ลอง `curl https://api.lomprayahcargo.com/api/branches` บนเซิร์ฟเวอร์
