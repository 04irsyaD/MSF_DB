# 📚 Dokumentasi Database Schema - PLSTX System

> **Generated:** 2026-02-02 14:54:06  
> **Source:** sm.sql  
> **Total Tables:** 23

---

## 📋 Daftar Tables

| No | Nama Table | Deskripsi |
|----|------------|-----------|
| 1 | [`user`](#user) | Tabel user untuk menampung informasi tentang pengguna sistem. |
| 2 | [`L_FAQ`](#l-faq) | Tabel L_FAQ untuk menampung data FAQ |
| 3 | [`t_m_jadwal_shift`](#t-m-jadwal-shift) | Tabel jadwal shift untuk pengelolaan jam kerja |
| 4 | [`t_m_status_shift_kehadiran_member`](#t-m-status-shift-kehadiran-member) | Tabel untuk merekam status kehadiran member dalam shift |
| 5 | [`t_m_reason_rating`](#t-m-reason-rating) | Tabel t_m_reason_rating untuk menampung rating alasan. |
| 6 | [`t_r_jadwal_logon`](#t-r-jadwal-logon) | Tabel t_r_jadwal_logon merekam logon user pada jadwal shift |
| 7 | [`t_m_condition_logon`](#t-m-condition-logon) | Tabel logon kondisi untuk mencatat informasi logon |
| 8 | [`t_t_logon_shift`](#t-t-logon-shift) | Tabel t_t_logon_shift merekam informasi logon shift member. |
| 9 | [`t_t_ticket_member`](#t-t-ticket-member) | Tabel t_t_ticket_member merekam informasi ticket member |
| 10 | [`t_t_rating_member`](#t-t-rating-member) | Tabel t_t_rating_member untuk menampung rating member |
| 11 | [`t_t_rating`](#t-t-rating) | Tabel untuk menampung rating dan komentar dari pengguna. |
| 12 | [`t_m_new_data_logon`](#t-m-new-data-logon) | Tabel logon untuk data baru |
| 13 | [`t_m_division`](#t-m-division) | Tabel t_m_division untuk mengelola bagian-bagian dalam organisasi. |
| 14 | [`t_t_notes_logon`](#t-t-notes-logon) | Tabel logon notes untuk mencatat catatan logon |
| 15 | [`t_t_logon_anomaly`](#t-t-logon-anomaly) | Tabel t_t_logon_anomaly merekam anomali login |
| 16 | [`t_m_status_anomaly_logon`](#t-m-status-anomaly-logon) | Tabel logon anomali status |
| 17 | [`t_t_logon_dispenser`](#t-t-logon-dispenser) | Tabel untuk merekam logon dispenser |
| 18 | [`t_m_status_anomaly_dispenser`](#t-m-status-anomaly-dispenser) | Tabel untuk merekam status anomali dispenser. |
| 19 | [`t_m_status_gangguan_logon`](#t-m-status-gangguan-logon) | Tabel logon status gangguan |
| 20 | [`t_t_logon_gangguan`](#t-t-logon-gangguan) | Tabel logon gangguan untuk merekam gangguan pada proses login. |
| 21 | [`t_t_notes_directions`](#t-t-notes-directions) | Tabel untuk merekam catatan dan arahan |
| 22 | [`t_t_rating_logon`](#t-t-rating-logon) | Tabel logon rating untuk tracking perubahan rating pengguna |
| 23 | [`t_r_rating_logon_relation`](#t-r-rating-logon-relation) | Tabel untuk merekam relasi antara logon dan rating |

---

## 1. `user`

### Deskripsi
Tabel user untuk menampung informasi tentang pengguna sistem.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | email | varchar | Alamat email |
| 3 | username | varchar | Nama pengguna sistem |
| 4 | password | varchar | Kata sandi pengguna sistem |
| 5 | is_active | bool | Status aktif record |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | role_id | int4 | ID peran pengguna dalam sistem |
| 10 | witel_id | int4 | ID wilayah telekomunikasi pengguna |
| 11 | spbu_id | int4 | ID Surat Pemberitahuan Berita Umum pengguna |
| 12 | jabatan | varchar | Jabatan atau posisi pengguna dalam organisasi |
| 13 | pengirim_penerima_id | int4 | ID pengiriman dan penerima surat elektronik |
| 14 | NIK | varchar | Nomor Induk Karyawan pengguna |
| 15 | signature_path | varchar | Rute file signature digital pengguna |
| 16 | phone_number | varchar | Nomor telepon pengguna |
| 17 | updated_by | varchar | ID user pengubah |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| user_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
CREATE TABLE public."user" (
	id uuid NOT NULL,
	email varchar NOT NULL,
	username varchar NULL,
	"password" varchar NOT NULL,
	is_active bool NULL,
	created_at timestamptz(6) NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	role_id int4 NULL,
	witel_id int4 NULL,
	spbu_id int4 NULL,
	jabatan varchar NULL,
	pengirim_penerima_id int4 NULL,
	"NIK" varchar NULL,
	signature_path varchar NULL,
	phone_number varchar NULL,
	updated_by varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
```

</details>

---

## 2. `L_FAQ`

### Deskripsi
Tabel L_FAQ untuk menampung data FAQ

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | faq_id | uuid | ID unik setiap FAQ |
| 3 | activity_log | varchar(200) | Catatan aktivitas FAQ dalam 200 karakter |
| 4 | code_faq | varchar(20) | Kode FAQ yang unik |
| 5 | faq_title_idn | varchar(100) | Judul FAQ dalam bahasa Indonesia |
| 6 | faq_title_eng | varchar(100) | Judul FAQ dalam bahasa Inggris |
| 7 | faq_desc_idn | text | Deskripsi FAQ dalam bahasa Indonesia |
| 8 | faq_desc_eng | text | Deskripsi FAQ dalam bahasa Inggris |
| 9 | order_loc | int4 | Urutan lokasi FAQ |
| 10 | created_by_id | uuid | ID user pembuat |
| 11 | updated_by_id | uuid | ID user pengubah |
| 12 | created_at | timestamptz(6) | Waktu pembuatan record |
| 13 | updated_at | timestamptz(6) | Waktu update terakhir |
| 14 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 15 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| L_FAQ_pkey | PRIMARY KEY | (id) |
| fk_l_faq_id | FOREIGN KEY | faq_id → M_FAQ(id) |

### Relasi (Foreign Keys)

```
L_FAQ
    └──> M_FAQ (faq_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
CREATE TABLE public."L_FAQ" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	faq_id uuid NOT NULL,
	activity_log varchar(200),
	code_faq varchar(20) NULL,
	faq_title_idn varchar(100) NOT NULL,
	faq_title_eng varchar(100) NOT NULL,
	faq_desc_idn text NOT NULL,
	faq_desc_eng text NOT NULL,
	order_loc int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT "L_FAQ_pkey" PRIMARY KEY (id),
	constraint fk_l_faq_id foreign key(faq_id)references "M_FAQ"(id)
);
```

</details>

---

## 3. `t_m_jadwal_shift`

### Deskripsi
Tabel jadwal shift untuk pengelolaan jam kerja

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | nama_shift | varchar(100) | Nama shift yang diberikan |
| 3 | waktu_mulai | time | Waktu mulai shift dalam format time (HH:MM:SS) |
| 4 | waktu_selesai | time | Waktu selesai shift dalam format time (HH:MM:SS) |
| 5 | order_data | SERIAL | Urutan data |
| 6 | created_by_id | uuid | ID user pembuat |
| 7 | updated_by_id | uuid | ID user pengubah |
| 8 | created_at | timestamptz(6) | Waktu pembuatan record |
| 9 | updated_at | timestamptz(6) | Waktu update terakhir |
| 10 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 11 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_jadwal_shift_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
CREATE TABLE public."t_m_jadwal_shift" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    nama_shift varchar(100) NOT NULL,
    waktu_mulai time NOT NULL,
    waktu_selesai time NOT NULL,
    "order_data" SERIAL,
    created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
    CONSTRAINT t_m_jadwal_shift_pk PRIMARY KEY (id)
)
```

</details>

---

## 4. `t_m_status_shift_kehadiran_member`

### Deskripsi
Tabel untuk merekam status kehadiran member dalam shift

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | status_shift | varchar(100) | Status kehadiran member dalam shift |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_status_shift_kehadiran_member_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create Table public."t_m_status_shift_kehadiran_member" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    status_shift varchar(100) NOT NULL,
    "order_data" SERIAL,
    created_by_id uuid NOT NULL,
    updated_by_id uuid NULL,
    created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz(6) NULL,
    deleted_at timestamptz(6) NULL,
    is_active bool DEFAULT true NOT NULL,
    CONSTRAINT t_m_status_shift_kehadiran_member_pk PRIMARY KEY (id)
)
```

</details>

---

## 5. `t_m_reason_rating`

### Deskripsi
Tabel t_m_reason_rating untuk menampung rating alasan.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | reason_rating | varchar(100) | Rating alasan yang dapat diisi hingga 100 karakter. |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_reason_rating_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_m_reason_rating"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	reason_rating varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_reason_rating_pk PRIMARY KEY (id)
)
```

</details>

---

## 6. `t_r_jadwal_logon`

### Deskripsi
Tabel t_r_jadwal_logon merekam logon user pada jadwal shift

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | jadwal_shift_id | UUID | ID jadwal shift yang terkait dengan logon |
| 3 | logon_id | UUID | ID logon yang terkait dengan jadwal shift |
| 4 | DATE_LOGON | date | Tanggal logon user |
| 5 | kondition_id | int4 | Kondisi khusus yang terkait dengan logon |
| 6 | created_by_id | uuid | ID user pembuat |
| 7 | updated_by_id | uuid | ID user pengubah |
| 8 | created_at | timestamptz(6) | Waktu pembuatan record |
| 9 | updated_at | timestamptz(6) | Waktu update terakhir |
| 10 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 11 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_r_jadwal_logon_pk | PRIMARY KEY | (id) |
| fk_t_r_jadwal_logon_jadwal_shift_id | FOREIGN KEY | jadwal_shift_id → t_m_jadwal_shift(id) |
| fk_t_r_jadwal_logon_logon_id | FOREIGN KEY | logon_id → t_t_logon_shift(id) |
| fk_t_r_jadwal_logon_kondition_id | FOREIGN KEY | kondition_id → t_m_condition_logon(id) |

### Relasi (Foreign Keys)

```
t_r_jadwal_logon
    └──> t_m_jadwal_shift (jadwal_shift_id)
    └──> t_t_logon_shift (logon_id)
    └──> t_m_condition_logon (kondition_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create Table public."t_r_jadwal_logon"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	jadwal_shift_id UUID NOT NULL,
	logon_id UUID NOT NULL,
	DATE_LOGON date NOT NULL,
	kondition_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_r_jadwal_logon_pk PRIMARY KEY (id),
	constraint fk_t_r_jadwal_logon_jadwal_shift_id foreign key(jadwal_shift_id)references t_m_jadwal_shift(id),
	constraint fk_t_r_jadwal_logon_logon_id foreign key(logon_id)references t_t_logon_shift(id),
	constraint fk_t_r_jadwal_logon_kondition_id foreign key(kondition_id)references t_m_condition_logon(id)

)
```

</details>

---

## 7. `t_m_condition_logon`

### Deskripsi
Tabel logon kondisi untuk mencatat informasi logon

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | kondition_name | varchar(100) | Nama kondisi logon |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| condition_logon_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create Table public."t_m_condition_logon"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	kondition_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT condition_logon_pk PRIMARY KEY (id)
)
```

</details>

---

## 8. `t_t_logon_shift`

### Deskripsi
Tabel t_t_logon_shift merekam informasi logon shift member.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | user_id | uuid | Identitas pengguna |
| 3 | code_member | varchar(100) | Kode anggota yang terdaftar |
| 4 | role_id | int4 | ID peran anggota |
| 5 | status_shift_kehadiran_member_id | int4 | Status kehadiran member dalam shift |
| 6 | reason_hadir | TEXT | Alasan hadir member |
| 7 | evidence_path | varchar(500) | Rute bukti file |
| 8 | created_by_id | uuid | ID user pembuat |
| 9 | updated_by_id | uuid | ID user pengubah |
| 10 | created_at | timestamptz(6) | Waktu pembuatan record |
| 11 | updated_at | timestamptz(6) | Waktu update terakhir |
| 12 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 13 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_logon_pk | PRIMARY KEY | (id) |
| fk_t_t_logon_user_id | FOREIGN KEY | user_id → user(id) |
| fk_t_t_logon_status_shift_kehadiran_member_id | FOREIGN KEY | status_shift_kehadiran_member_id → t_m_status_shift_kehadiran_member(id) |

### Relasi (Foreign Keys)

```
t_t_logon_shift
    └──> user (user_id)
    └──> t_m_status_shift_kehadiran_member (status_shift_kehadiran_member_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_logon_shift"(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NOT NULL,
	code_member varchar(100) NOT NULL,
	role_id int4 NOT NULL,
	status_shift_kehadiran_member_id int4 NOT NULL,
	reason_hadir TEXT NULL,
	evidence_path varchar(500) NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_user_id foreign key(user_id)references "user"(id),
	constraint fk_t_t_logon_status_shift_kehadiran_member_id foreign key(status_shift_kehadiran_member_id)references t_m_status_shift_kehadiran_member(id)
)
```

</details>

---

## 9. `t_t_ticket_member`

### Deskripsi
Tabel t_t_ticket_member merekam informasi ticket member

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_shift_id | uuid | ID shift login member |
| 3 | ticket_id | uuid | ID tiket yang terhubung dengan member |
| 4 | ticket_take | int4 | Jumlah tiket yang diambil oleh member |
| 5 | ticket_pending | int4 | Jumlah tiket yang menunggu penyelesaian oleh member |
| 6 | ticket_solved | int4 | Jumlah tiket yang telah diselesaikan oleh member |
| 7 | created_by_id | uuid | ID user pembuat |
| 8 | updated_by_id | uuid | ID user pengubah |
| 9 | created_at | timestamptz(6) | Waktu pembuatan record |
| 10 | updated_at | timestamptz(6) | Waktu update terakhir |
| 11 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 12 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_ticket_member_pk | PRIMARY KEY | (id) |
| fk_t_t_ticket_member_logon_shift_id | FOREIGN KEY | logon_shift_id → t_t_logon_shift(id) |
| fk_t_t_ticket_member_ticket_id | FOREIGN KEY | ticket_id → t_m_ticket(id) |

### Relasi (Foreign Keys)

```
t_t_ticket_member
    └──> t_t_logon_shift (logon_shift_id)
    └──> t_m_ticket (ticket_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_ticket_member" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	ticket_id uuid NOT NULL,
	ticket_take int4 NOT NULL DEFAULT 0,
	ticket_pending int4 NOT NULL DEFAULT 0,
	ticket_solved int4 NOT NULL DEFAULT 0,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_ticket_member_pk PRIMARY KEY (id),
	constraint fk_t_t_ticket_member_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_ticket_member_ticket_id foreign key(ticket_id)references t_m_ticket(id)
)
```

</details>

---

## 10. `t_t_rating_member`

### Deskripsi
Tabel t_t_rating_member untuk menampung rating member

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_shift_id | uuid | ID shift login member |
| 3 | rating_value | int4 | Nilai rating member (int4) |
| 4 | note_rating | text | Catatan rating member (text) |
| 5 | reason_rating_id | int4 | ID alasan rating member |
| 6 | created_by_id | uuid | ID user pembuat |
| 7 | updated_by_id | uuid | ID user pengubah |
| 8 | created_at | timestamptz(6) | Waktu pembuatan record |
| 9 | updated_at | timestamptz(6) | Waktu update terakhir |
| 10 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 11 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_rating_member_pk | PRIMARY KEY | (id) |
| fk_t_t_rating_member_logon_shift_id | FOREIGN KEY | logon_shift_id → t_t_logon_shift(id) |
| fk_t_t_rating_member_reason_rating_id | FOREIGN KEY | reason_rating_id → t_m_reason_rating(id) |

### Relasi (Foreign Keys)

```
t_t_rating_member
    └──> t_t_logon_shift (logon_shift_id)
    └──> t_m_reason_rating (reason_rating_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_rating_member" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,
	reason_rating_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_member_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_member_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_rating_member_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)
```

</details>

---

## 11. `t_t_rating`

### Deskripsi
Tabel untuk menampung rating dan komentar dari pengguna.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | rating_value | int4 | Nilai rating yang diberikan oleh pengguna. |
| 3 | note_rating | text | Komentar atau catatan tambahan dari pengguna. |
| 4 | reason_rating_id | int4 | ID alasan rating, terkait dengan tabel t_t_reason. |
| 5 | created_by_id | uuid | ID user pembuat |
| 6 | updated_by_id | uuid | ID user pengubah |
| 7 | created_at | timestamptz(6) | Waktu pembuatan record |
| 8 | updated_at | timestamptz(6) | Waktu update terakhir |
| 9 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 10 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_rating_pk | PRIMARY KEY | (id) |
| fk_t_t_rating_reason_rating_id | FOREIGN KEY | reason_rating_id → t_m_reason_rating(id) |

### Relasi (Foreign Keys)

```
t_t_rating
    └──> t_m_reason_rating (reason_rating_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_rating" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,	
	reason_rating_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)
```

</details>

---

## 12. `t_m_new_data_logon`

### Deskripsi
Tabel logon untuk data baru

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | data_logon_name | varchar(100) | Nama pengguna saat logon |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_new_data_logon_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_m_new_data_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	data_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_new_data_logon_pk PRIMARY KEY (id)
)
```

</details>

---

## 13. `t_m_division`

### Deskripsi
Tabel t_m_division untuk mengelola bagian-bagian dalam organisasi.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | code_division | varchar(50) | Kode unik bagi setiap bagian |
| 3 | division_name | varchar(100) | Nama bagian yang jelas dan singkat |
| 4 | order_data | SERIAL | Urutan data |
| 5 | created_by_id | uuid | ID user pembuat |
| 6 | updated_by_id | uuid | ID user pengubah |
| 7 | created_at | timestamptz(6) | Waktu pembuatan record |
| 8 | updated_at | timestamptz(6) | Waktu update terakhir |
| 9 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 10 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_division_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
Create table public."t_m_division" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code_division varchar(50) NOT NULL,
	division_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_division_pk PRIMARY KEY (id)
)
```

</details>

---

## 14. `t_t_notes_logon`

### Deskripsi
Tabel logon notes untuk mencatat catatan logon

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_shift_id | uuid | UUID identitas shift logon |
| 3 | note_logon | text | Catatan logon singkat |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_notes_logon_pk | PRIMARY KEY | (id) |
| fk_t_t_notes_logon_logon_shift_id | FOREIGN KEY | logon_shift_id → t_t_logon_shift(id) |

### Relasi (Foreign Keys)

```
t_t_notes_logon
    └──> t_t_logon_shift (logon_shift_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_notes_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	note_logon text NOT NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_notes_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_notes_logon_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id)
)
```

</details>

---

## 15. `t_t_logon_anomaly`

### Deskripsi
Tabel t_t_logon_anomaly merekam anomali login

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_jadwal_id | uuid | ID jadwal logon |
| 3 | anomaly_logon_id | uuid | ID anomali logon |
| 4 | ticket_id | int4 | Nomor tiket logon |
| 5 | created_by_id | uuid | ID user pembuat |
| 6 | updated_by_id | uuid | ID user pengubah |
| 7 | created_at | timestamptz(6) | Waktu pembuatan record |
| 8 | updated_at | timestamptz(6) | Waktu update terakhir |
| 9 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 10 | is_active | bool | Status aktif record |
| 11 | cosntraint | fk_t_t_logon_anomaly_ticket_id | Keterkaitan dengan tabel ticket |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_logon_anomaly_pk | PRIMARY KEY | (id) |
| fk_t_t_logon_anomaly_logon_jadwal_id | FOREIGN KEY | logon_jadwal_id → t_r_jadwal_logon(id) |
| fk_t_t_logon_anomaly_anomaly_logon_id | FOREIGN KEY | anomaly_logon_id → t_m_status_anomaly_logon(id) |

### Relasi (Foreign Keys)

```
t_t_logon_anomaly
    └──> t_r_jadwal_logon (logon_jadwal_id)
    └──> t_m_status_anomaly_logon (anomaly_logon_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
Create table public."t_t_logon_anomaly" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	anomaly_logon_id uuid NOT NULL,
	ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_anomaly_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_anomaly_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_anomaly_anomaly_logon_id foreign key(anomaly_logon_id)references t_m_status_anomaly_logon(id),
	cosntraint fk_t_t_logon_anomaly_ticket_id foreign key(ticket_id)references t_ticket(id)

)
```

</details>

---

## 16. `t_m_status_anomaly_logon`

### Deskripsi
Tabel logon anomali status

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | anomaly_logon_name | varchar(100) | Nama anomali logon |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_anomaly_logon_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_m_status_anomaly_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	anomaly_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_anomaly_logon_pk PRIMARY KEY (id)
);
```

</details>

---

## 17. `t_t_logon_dispenser`

### Deskripsi
Tabel untuk merekam logon dispenser

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_jadwal_id | uuid | ID jadwal logon dispenser |
| 3 | dispenser_logon_id | uuid | ID logon dispenser |
| 4 | ticket_id | int4 | ID tiket |
| 5 | created_by_id | uuid | ID user pembuat |
| 6 | updated_by_id | uuid | ID user pengubah |
| 7 | created_at | timestamptz(6) | Waktu pembuatan record |
| 8 | updated_at | timestamptz(6) | Waktu update terakhir |
| 9 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 10 | is_active | bool | Status aktif record |
| 11 | cosntraint | fk_t_t_logon_anomaly_ticket_id | Field cosntraint |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_logon_anomaly_pk | PRIMARY KEY | (id) |
| fk_t_t_logon_anomaly_logon_jadwal_id | FOREIGN KEY | logon_jadwal_id → t_r_jadwal_logon(id) |
| fk_t_t_logon_anomaly_dispenser_logon_id | FOREIGN KEY | dispenser_logon_id → t_m_status_anomaly_dispenser(id) |

### Relasi (Foreign Keys)

```
t_t_logon_dispenser
    └──> t_r_jadwal_logon (logon_jadwal_id)
    └──> t_m_status_anomaly_dispenser (dispenser_logon_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
Create table public."t_t_logon_dispenser" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	dispenser_logon_id uuid  NULL,
	ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_anomaly_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_anomaly_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_anomaly_dispenser_logon_id foreign key(dispenser_logon_id)references t_m_status_anomaly_dispenser(id),
	cosntraint fk_t_t_logon_anomaly_ticket_id foreign key(ticket_id)references t_ticket(id)

)
```

</details>

---

## 18. `t_m_status_anomaly_dispenser`

### Deskripsi
Tabel untuk merekam status anomali dispenser.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | anomaly_logon_name | varchar(100) | Nama pengguna yang terlibat dalam anomali. |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_anomaly_logon_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_m_status_anomaly_dispenser" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	anomaly_logon_name varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_anomaly_logon_pk PRIMARY KEY (id)
);
```

</details>

---

## 19. `t_m_status_gangguan_logon`

### Deskripsi
Tabel logon status gangguan

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | gangguan_logon | varchar(100) | Deskripsi gangguan logon |
| 3 | order_data | SERIAL | Urutan data |
| 4 | created_by_id | uuid | ID user pembuat |
| 5 | updated_by_id | uuid | ID user pengubah |
| 6 | created_at | timestamptz(6) | Waktu pembuatan record |
| 7 | updated_at | timestamptz(6) | Waktu update terakhir |
| 8 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 9 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_m_status_gangguan_logon_pk | PRIMARY KEY | (id) |

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_m_status_gangguan_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	gangguan_logon varchar(100) NOT NULL,
	"order_data" SERIAL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_m_status_gangguan_logon_pk PRIMARY KEY (id)
);
```

</details>

---

## 20. `t_t_logon_gangguan`

### Deskripsi
Tabel logon gangguan untuk merekam gangguan pada proses login.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_jadwal_id | uuid | UUID identitas jadwal logon |
| 3 | gangguan_logon_id | uuid | UUID identitas gangguan logon |
| 4 | ticket_id | int4 | Nomor tiket untuk tracking gangguan |
| 5 | detail_gangguan | text | Deskripsi detail gangguan yang terjadi |
| 6 | time_down | timestamptz(6) | Waktu keterlambatan pada saat gangguan terjadi |
| 7 | time_up | timestamptz(6) | Waktu pengembalian normal setelah gangguan selesai |
| 8 | keterangan | text | Keterangan tambahan tentang gangguan yang terjadi |
| 9 | created_by_id | uuid | ID user pembuat |
| 10 | updated_by_id | uuid | ID user pengubah |
| 11 | created_at | timestamptz(6) | Waktu pembuatan record |
| 12 | updated_at | timestamptz(6) | Waktu update terakhir |
| 13 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 14 | is_active | bool | Status aktif record |
| 15 | cosntraint | fk_t_t_logon_gangguan_ticket_id | Field cosntraint |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_logon_gangguan_pk | PRIMARY KEY | (id) |
| fk_t_t_logon_gangguan_logon_jadwal_id | FOREIGN KEY | logon_jadwal_id → t_r_jadwal_logon(id) |
| fk_t_t_logon_gangguan_gangguan_logon_id | FOREIGN KEY | gangguan_logon_id → t_m_status_gangguan_logon(id) |

### Relasi (Foreign Keys)

```
t_t_logon_gangguan
    └──> t_r_jadwal_logon (logon_jadwal_id)
    └──> t_m_status_gangguan_logon (gangguan_logon_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
CREATE table public."t_t_logon_gangguan" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_jadwal_id uuid NOT NULL,
	gangguan_logon_id uuid  NULL,
	ticket_id int4 NULL,
	detail_gangguan text NULL,
	time_down timestamptz(6) NULL,
	time_up timestamptz(6) NULL,
	keterangan text NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_logon_gangguan_pk PRIMARY KEY (id),
	constraint fk_t_t_logon_gangguan_logon_jadwal_id foreign key(logon_jadwal_id)references t_r_jadwal_logon(id),
	constraint fk_t_t_logon_gangguan_gangguan_logon_id foreign key(gangguan_logon_id)references t_m_status_gangguan_logon(id),
	cosntraint fk_t_t_logon_gangguan_ticket_id foreign key(ticket_id)references t_ticket(id)

)
```

</details>

---

## 21. `t_t_notes_directions`

### Deskripsi
Tabel untuk merekam catatan dan arahan

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_shift_id | uuid | ID shift login |
| 3 | note | text | Catatan singkat |
| 4 | directions | text | Arah atau petunjuk |
| 5 | created_by_id | uuid | ID user pembuat |
| 6 | updated_by_id | uuid | ID user pengubah |
| 7 | created_at | timestamptz(6) | Waktu pembuatan record |
| 8 | updated_at | timestamptz(6) | Waktu update terakhir |
| 9 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 10 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_notes_directions_pk | PRIMARY KEY | (id) |
| fk_t_t_notes_directions_logon_shift_id | FOREIGN KEY | logon_shift_id → t_t_logon_shift(id) |

### Relasi (Foreign Keys)

```
t_t_notes_directions
    └──> t_t_logon_shift (logon_shift_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create Table public."t_t_notes_directions" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	note text NOT NULL,
	directions text NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_notes_directions_pk PRIMARY KEY (id),
	constraint fk_t_t_notes_directions_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id)
)
```

</details>

---

## 22. `t_t_rating_logon`

### Deskripsi
Tabel logon rating untuk tracking perubahan rating pengguna

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_shift_id | uuid | ID shift logon yang terkait dengan rating |
| 3 | rating_value | int4 | Nilai rating yang diberikan oleh pengguna |
| 4 | note_rating | text | Catatan tambahan tentang rating yang diberikan |
| 5 | reason_rating_id | int4 | ID alasan rating yang terkait dengan perubahan rating |
| 6 | t_ticket_id | int4 | ID tiket yang terkait dengan logon dan rating |
| 7 | created_by_id | uuid | ID user pembuat |
| 8 | updated_by_id | uuid | ID user pengubah |
| 9 | created_at | timestamptz(6) | Waktu pembuatan record |
| 10 | updated_at | timestamptz(6) | Waktu update terakhir |
| 11 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 12 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_t_rating_logon_pk | PRIMARY KEY | (id) |
| fk_t_t_rating_logon_logon_shift_id | FOREIGN KEY | logon_shift_id → t_t_logon_shift(id) |
| fk_t_t_rating_logon_reason_rating_id | FOREIGN KEY | reason_rating_id → t_m_reason_rating(id) |
| fk_t_t_rating_logon_ticket_id | FOREIGN KEY | t_ticket_id → t_ticket(id) |

### Relasi (Foreign Keys)

```
t_t_rating_logon
    └──> t_t_logon_shift (logon_shift_id)
    └──> t_m_reason_rating (reason_rating_id)
    └──> t_ticket (t_ticket_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_t_rating_logon" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_shift_id uuid NOT NULL,
	rating_value int4 NOT NULL,
	note_rating text NULL,	
	reason_rating_id int4 NULL,
	t_ticket_id int4 NULL,
	created_by_id uuid NOT NULL,
	updated_by_id uuid NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_t_rating_logon_pk PRIMARY KEY (id),
	constraint fk_t_t_rating_logon_logon_shift_id foreign key(logon_shift_id)references t_t_logon_shift(id),
	constraint fk_t_t_rating_logon_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id),
	constraint fk_t_t_rating_logon_ticket_id foreign key(t_ticket_id)references t_ticket(id)
)
```

</details>

---

## 23. `t_r_rating_logon_relation`

### Deskripsi
Tabel untuk merekam relasi antara logon dan rating

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | ID PK |
| 2 | logon_rating_id | uuid | UUID unik untuk setiap logon dan rating |
| 3 | reason_rating_id | uuid | UUID unik untuk alasan rating |
| 4 | created_at | timestamptz(6) | Waktu pembuatan record |
| 5 | updated_at | timestamptz(6) | Waktu update terakhir |
| 6 | deleted_at | timestamptz(6) | Waktu penghapusan (soft delete) |
| 7 | is_active | bool | Status aktif record |

### Constraints

| Nama | Tipe | Detail |
|------|------|--------|
| t_r_rating_logon_history_pk | PRIMARY KEY | (id) |
| fk_t_r_rating_logon_history_logon_rating_id | FOREIGN KEY | logon_rating_id → t_t_rating_logon(id) |
| fk_t_r_rating_logon_history_reason_rating_id | FOREIGN KEY | reason_rating_id → t_m_reason_rating(id) |

### Relasi (Foreign Keys)

```
t_r_rating_logon_relation
    └──> t_t_rating_logon (logon_rating_id)
    └──> t_m_reason_rating (reason_rating_id)
```

<details>
<summary>📝 <strong>SQL Definition</strong></summary>

```sql
create table public."t_r_rating_logon_relation" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	logon_rating_id uuid NOT NULL,
	reason_rating_id uuid NOT NULL,
	created_at timestamptz(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,	
	updated_at timestamptz(6) NULL,
	deleted_at timestamptz(6) NULL,	
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT t_r_rating_logon_history_pk PRIMARY KEY (id),
	constraint fk_t_r_rating_logon_history_logon_rating_id foreign key(logon_rating_id)references t_t_rating_logon(id),
	constraint fk_t_r_rating_logon_history_reason_rating_id foreign key(reason_rating_id)references t_m_reason_rating(id)
)
```

</details>

---

