# 📚 Cara Menggunakan Password Generator

## ⚡ Quick Start
### Opsi 1: Gunakan `quick.py` (paling mudah)

```powershell
# 📚 Cara Menggunakan Password Generator

## ⚡ Quick Start

### Opsi 1: Gunakan `quick.py` (paling mudah)
```powershell
cd pw
python quick.py
```
cd pw
python quick.py
```

**Output:**
```text
1️⃣  Generate 3 Password Random:
    1. 9APvyglW5GMZ
```
1️⃣  Generate 3 Password Random:
   1. 9APvyglW5GMZ
   2. f2nSg35snxl3
   3. aBg4gcZcWYkk
```
    2. f2nSg35snxl3
    3. aBg4gcZcWYkk
```

---
## 📖 File yang Tersedia

### 1. `quick.py` - Untuk penggunaan cepat
```python
 # Import fungsi
 from quick import quick_password, quick_hash, verify

# Generate password random
pwd = quick_password(12)
print(pwd)  # Output: K9@mL2$xQ4pN

# Hash password
hashed = quick_hash("example-password")
print(hashed)  # Output: $2b$10$...

# Verifikasi
is_match = verify("example-password", hashed)

## 📖 File yang Tersedia

### 1. `quick.py` - Untuk penggunaan cepat
```python
# Import fungsi
from quick import quick_password, quick_hash, verify

# Generate password random
pwd = quick_password(12)
print(pwd)  # Output: K9@mL2$xQ4pN

# Hash password
hashed = quick_hash("example-password")
print(hashed)  # Output: $2b$10$...

# Verifikasi
is_match = verify("example-password", hashed)
print(is_match)  # True atau False
```
print(is_match)  # True atau False
```

### 2. `example_usage.py` - Contoh berbagai use case
Menunjukkan 6 contoh penggunaan:

1. Generate password random
2. Hash dengan bcrypt
3. Hash multiple password
4. Siap untuk SQL INSERT
Menunjukkan 6 contoh penggunaan:
1. Generate password random
2. Hash dengan bcrypt
3. Hash multiple password
4. Siap untuk SQL INSERT
5. Batch generate
6. Verifikasi hash yang diberikan

5. Batch generate
6. Verifikasi hash yang diberikan

### 3. `create_generation.py` - Full featured (interactive)
Jalankan dengan input interaktif:

```powershell
python create_generation.py
```

---

## 🔧 Cara Praktis Sesuai Kebutuhan

### ✅ Kebutuhan 1: Generate 1 Password Random

```python
from quick import quick_password

password = quick_password(length=12)
Jalankan dengan input interaktif:
```powershell
python create_generation.py
```

---

## 🔧 Cara Praktis Sesuai Kebutuhan

### ✅ Kebutuhan 1: Generate 1 Password Random
```python
from quick import quick_password

password = quick_password(length=12)
print(f"Password: {password}")
```
print(f"Password: {password}")
```

### ✅ Kebutuhan 2: Hash untuk Database
```python
from quick import quick_hash

username = "john_doe"
email = "john@example.com"
plain_password = "MyPassword123!"

hashed_password = quick_hash(plain_password, rounds=10)
# SQL untuk INSERT
sql = (
    "INSERT INTO users (username, email, password) VALUES "
    f"('{username}', '{email}', '{hashed_password}');"
)
```python
from quick import quick_hash

username = "john_doe"
email = "john@example.com"
plain_password = "MyPassword123!"

hashed_password = quick_hash(plain_password, rounds=10)

# SQL untuk INSERT
sql = f"INSERT INTO users (username, email, password) VALUES ('{username}', '{email}', '{hashed_password}');"
print(sql)
```
print(sql)
```

### ✅ Kebutuhan 3: Verifikasi Login
```python
from quick import verify

# Saat user login
user_input = "MyPassword123!"
stored_hash = "$2b$10$..."  # dari database

is_correct = verify(user_input, stored_hash)
```python
from quick import verify

# Saat user login
user_input = "MyPassword123!"
stored_hash = "$2b$10$..."  # dari database

is_correct = verify(user_input, stored_hash)
if is_correct:
    print("Login berhasil!")
else:
    print("Password salah!")
```
if is_correct:
    print("Login berhasil!")
else:
    print("Password salah!")
```

### ✅ Kebutuhan 4: Generate Banyak Password
```python
from quick import quick_password

# Generate 5 password untuk 5 user
for i in range(1, 6):
```python
from quick import quick_password

# Generate 5 password untuk 5 user
for i in range(1, 6):
    pwd = quick_password(14)
    print(f"User {i}: {pwd}")
```
    pwd = quick_password(14)
    print(f"User {i}: {pwd}")
```

### ✅ Kebutuhan 5: Verifikasi Hash yang Diberikan
```python
from quick import verify

given_hash = "$2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga"
test_password = "example-password"
```python
from quick import verify

given_hash = "$2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga"
test_password = "example-password"

if verify(test_password, given_hash):
    print("✓ Password cocok!")
else:
    print("✗ Password tidak cocok")
```
if verify(test_password, given_hash):
    print("✓ Password cocok!")
else:
    print("✗ Password tidak cocok")
```


## 🚀 Install Bcrypt (untuk fitur lengkap)
Agar bisa hash dengan format `$2b$10$...`, install bcrypt:

```powershell

Agar bisa hash dengan format `$2b$10$...`, install bcrypt:

```powershell
pip install bcrypt
```
pip install bcrypt
```


## 🔐 Best Practices

✅ **DO:**
 - Hash password sebelum simpan ke database
 - Gunakan `rounds=10` atau lebih
 - Verifikasi password dengan `checkpw()` saat login
 - Jangan pernah simpan plain password

❌ **DON'T:**
 - Tidak boleh menyimpan plain password
 - Jangan gunakan rounds < 8
 - Jangan decode hash bcrypt dengan manual

✅ **DO:**
- Hash password sebelum simpan ke database
- Gunakan `rounds=10` atau lebih
- Verifikasi password dengan `checkpw()` saat login
- Jangan pernah simpan plain password

❌ **DON'T:**
- Tidak boleh menyimpan plain password
- Jangan gunakan rounds < 8
- Jangan decode hash bcrypt dengan manual
- Jangan hardcode password

 - Jangan hardcode password


## 📝 Contoh Lengkap untuk Database

### Laravel/PHP:
```python
 # Generate hash
from quick import quick_hash

### Laravel/PHP:
```python
# Generate hash
from quick import quick_hash

password = quick_hash("user_password", rounds=10)
# Gunakan di database: DB::table('users')->insert(['password' => password])
```
password = quick_hash("user_password", rounds=10)
# Gunakan di database: DB::table('users')->insert(['password' => password])
```

### Node.js kompatibel:
```python
from quick import quick_hash

# Output format kompatibel dengan bcryptjs di Node.js
hash_result = quick_hash("password123")
```python
from quick import quick_hash

# Output format kompatibel dengan bcryptjs di Node.js
hash_result = quick_hash("password123")
print(hash_result)
```
print(hash_result)
```


## ❓ FAQ

**Q: Mengapa harus bcrypt?**
A: Bcrypt lebih aman karena slow hashing (anti brute force)
**Q: Bisa ganti rounds?**
A: Ya, tapi jangan kurang dari 8. Semakin tinggi = lebih aman tapi lebih lambat.
**Q: Berapa password character minimal?**
A: Min 12 karakter, 14-16 lebih aman.

**Q: Mengapa harus bcrypt?**
A: Bcrypt lebih aman karena slow hashing (anti brute force)

**Q: Bisa ganti rounds?**
A: Ya, tapi jangan kurang dari 8. Semakin tinggi = lebih aman tapi lebih lambat.

**Q: Berapa password character minimal?**
A: Min 12 karakter, 14-16 lebih aman.

**Q: Apa itu cost factor 10?**
A: Artinya hash akan di-compute 2^10 = 1024 kali (untuk keamanan)
**Q: Apa itu cost factor 10?**
A: Artinya hash akan di-compute 2^10 = 1024 kali (untuk keamanan)


## 📞 Pertanyaan?

Lihat contoh di `example_usage.py` atau jalankan `quick.py` untuk test.

Lihat contoh di `example_usage.py` atau jalankan `quick.py` untuk test.
