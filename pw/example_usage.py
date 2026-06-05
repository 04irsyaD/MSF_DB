"""
Contoh Penggunaan Password Generator
Jalankan: python example_usage.py
"""

import secrets
import string
import hashlib

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False

# ============================================================================
# EXAMPLE 1: Generate password random 1 baris
# ============================================================================
print("=" * 70)
print("CONTOH 1: Generate Password Random")
print("=" * 70)

password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
print(f"Password yang dihasilkan: {password}\n")


# ============================================================================
# EXAMPLE 2: Hash password dengan Bcrypt
# ============================================================================
print("=" * 70)
print("CONTOH 2: Hash Password dengan Bcrypt")
print("=" * 70)

if HAS_BCRYPT:
    password = "MySecurePassword123"
    
    # Cost factor 10 = $2b$10$...
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode(), salt)
    hashed_string = hashed.decode()
    
    print(f"Password awal: {password}")
    print(f"Hash bcrypt:   {hashed_string}\n")
    
    # Verifikasi
    test_password = "MySecurePassword123"
    is_match = bcrypt.checkpw(test_password.encode(), hashed_string.encode())
    print(f"Password '{test_password}' cocok? {is_match}\n")
else:
    print("⚠️  bcrypt belum diinstall. Install dengan: pip install bcrypt\n")


# ============================================================================
# EXAMPLE 3: Hash beberapa password sekaligus
# ============================================================================
print("=" * 70)
print("CONTOH 3: Generate Banyak Password & Hash")
print("=" * 70)

if HAS_BCRYPT:
    passwords = {
        "user1": "admin@12345",
        "user2": "secure123456",
        "user3": "password999"
    }
    
    print("Username | Password         | Bcrypt Hash")
    print("-" * 90)
    
    for username, pwd in passwords.items():
        hashed = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt(rounds=10)).decode()
        print(f"{username:8} | {pwd:16} | {hashed}")
    print()


# ============================================================================
# EXAMPLE 4: Gunakan untuk database INSERT
# ============================================================================
print("=" * 70)
print("CONTOH 4: Siap untuk SQL INSERT")
print("=" * 70)

if HAS_BCRYPT:
    username = "john_doe"
    email = "john@example.com"
    plain_password = "JohnPassword123!"
    
    hashed_pwd = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt(rounds=10)).decode()
    
    # SQL INSERT statement
    sql = f"""INSERT INTO users (username, email, password) VALUES 
    ('{username}', '{email}', '{hashed_pwd}');"""
    
    print("SQL untuk database:")
    print(sql)
    print()


# ============================================================================
# EXAMPLE 5: Batch generate random passwords
# ============================================================================
print("=" * 70)
print("CONTOH 5: Batch Generate 5 Password Random")
print("=" * 70)

print("Password random yang dihasilkan:")
for i in range(1, 6):
    pwd = ''.join(secrets.choice(string.ascii_letters + string.digits + "!@#$%") for _ in range(14))
    print(f"  {i}. {pwd}")

print("\n")

# ============================================================================
# EXAMPLE 6: Verifikasi password dari hash yang diberikan
# ============================================================================
print("=" * 70)
print("CONTOH 6: Verifikasi Hash yang Diberikan")
print("=" * 70)

if HAS_BCRYPT:
    given_hash = "$2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga"
    
    # Coba berbagai password
    candidates = ["example-password", "sample-password", "demo-password", "bcrypt-example"]
    
    print(f"Mencoba verifikasi hash:\n{given_hash}\n")
    print("Mencoba password:")
    for pwd in candidates:
        try:
            match = bcrypt.checkpw(pwd.encode(), given_hash.encode())
            status = "✓ COCOK!" if match else "✗ Tidak cocok"
            print(f"  '{pwd}' → {status}")
        except Exception as e:
            print(f"  '{pwd}' → Error: {str(e)[:50]}")
    
    print()

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 70)
print("SUMMARY - Cara Menggunakan")
print("=" * 70)
print("""
1. IMPORT FUNGSI:
   from create_generation import generate_password, hash_password_bcrypt

2. GENERATE PASSWORD RANDOM:
   pwd = generate_password(length=12)
   print(pwd)  # Contoh output: K9@mL2$xQ4pN

3. HASH PASSWORD:
   hashed = hash_password_bcrypt("example-password", rounds=10)
   print(hashed)  # Contoh: $2b$10$...

4. VERIFIKASI:
   import bcrypt
   match = bcrypt.checkpw("example-password".encode(), hashed.encode())
   
5. UNTUK PRODUCTION:
   - Selalu gunakan rounds=10 atau lebih
   - Jangan simpan plain password
   - Selalu hash sebelum simpan ke database
   - Verifikasi password dengan checkpw saat login

INSTALL BCRYPT:
   pip install bcrypt
""")
