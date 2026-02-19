"""
CONTOH PRAKTIS: Integrasi dengan Database
Menunjukkan cara real-world untuk aplikasi
"""

from quick import quick_password, quick_hash, verify

# =============================================================================
# SCENARIO 1: User Registration (Saat daftar user baru)
# =============================================================================
print("=" * 70)
print("SCENARIO 1: USER REGISTRATION")
print("=" * 70)

def register_user(username, email, plain_password):
    """
    Fungsi untuk daftar user (simulasi)
    """
    # Hash password sebelum simpan
    hashed_password = quick_hash(plain_password, rounds=10)
    
    # SQL INSERT (contoh)
    sql = f"""
    INSERT INTO users (username, email, password, created_at) 
    VALUES ('{username}', '{email}', '{hashed_password}', NOW());
    """
    
    print(f"\n📝 Register User: {username}")
    print(f"Email: {email}")
    print(f"Password: {plain_password}")
    print(f"\n✓ Password hashed untuk database:")
    print(f"Hash: {hashed_password}")
    print(f"\nSQL Command:\n{sql}")
    
    return {
        "username": username,
        "email": email,
        "password_hash": hashed_password
    }

# Test register
user = register_user("john_doe", "john@example.com", "MySecure@Pass123")


# =============================================================================
# SCENARIO 2: User Login (Saat user login)
# =============================================================================
print("\n" + "=" * 70)
print("SCENARIO 2: USER LOGIN")
print("=" * 70)

def login_user(username, plain_password, stored_hash):
    """
    Fungsi untuk login (simulasi)
    Stored hash adalah dari database
    """
    print(f"\n🔐 Login Attempt")
    print(f"Username: {username}")
    print(f"Password: {plain_password}")
    
    # Verifikasi password
    is_correct = verify(plain_password, stored_hash)
    
    if is_correct:
        print(f"✓ Password cocok! Login berhasil.")
        return True
    else:
        print(f"✗ Password salah! Login gagal.")
        return False

# Test login dengan password benar
print("\n--- Test 1: Password Benar ---")
login_user("john_doe", "MySecure@Pass123", user["password_hash"])

# Test login dengan password salah
print("\n--- Test 2: Password Salah ---")
login_user("john_doe", "WrongPassword", user["password_hash"])


# =============================================================================
# SCENARIO 3: Reset Password
# =============================================================================
print("\n" + "=" * 70)
print("SCENARIO 3: RESET PASSWORD")
print("=" * 70)

def reset_password(username, new_password, old_hash):
    """
    Fungsi untuk reset password
    """
    print(f"\n🔄 Reset Password untuk: {username}")
    print(f"Password baru: {new_password}")
    
    # Hash password baru
    new_hash = quick_hash(new_password, rounds=10)
    
    # SQL UPDATE
    sql = f"UPDATE users SET password = '{new_hash}' WHERE username = '{username}';"
    
    print(f"\n✓ Password baru di-hash:")
    print(f"Hash lama: {old_hash[:40]}...")
    print(f"Hash baru: {new_hash}")
    print(f"\nSQL Command:\n{sql}")
    
    return new_hash

new_hash = reset_password("john_doe", "NewSecure@Pass456", user["password_hash"])


# =============================================================================
# SCENARIO 4: Bulk User Import (Import multiple users)
# =============================================================================
print("\n" + "=" * 70)
print("SCENARIO 4: BULK USER IMPORT")
print("=" * 70)

users_to_import = [
    {"username": "alice", "email": "alice@example.com", "password": "Alice@123456"},
    {"username": "bob", "email": "bob@example.com", "password": "Bob@789012"},
    {"username": "charlie", "email": "charlie@example.com", "password": "Charlie@345678"},
]

print("\n📋 Bulk Import 3 Users\n")
print("Username  | Email                 | Password Hash")
print("-" * 90)

sql_statements = []
for user_data in users_to_import:
    hashed = quick_hash(user_data["password"], rounds=10)
    print(f"{user_data['username']:9} | {user_data['email']:21} | {hashed[:30]}...")
    
    sql = f"INSERT INTO users (username, email, password) VALUES ('{user_data['username']}', '{user_data['email']}', '{hashed}');"
    sql_statements.append(sql)

print("\n✓ SQL Bulk Insert:\n")
for sql in sql_statements:
    print(sql)


# =============================================================================
# SCENARIO 5: Verify External Hash
# =============================================================================
print("\n" + "=" * 70)
print("SCENARIO 5: VERIFY EXTERNAL HASH")
print("=" * 70)

external_hash = "$2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga"
print(f"\nDiberikan hash dari sistem lain:")
print(f"{external_hash}\n")

test_passwords = ["password", "admin123", "secret123", "bcrypt123"]
print("Mencoba untuk menemukan password:")
for pwd in test_passwords:
    match = verify(pwd, external_hash)
    status = "✓ COCOK!" if match else "✗"
    print(f"  '{pwd}' → {status}")


# =============================================================================
# SCENARIO 6: Generate Temporary Password
# =============================================================================
print("\n" + "=" * 70)
print("SCENARIO 6: GENERATE TEMPORARY PASSWORD")
print("=" * 70)

print("\nGenerate 3 temporary passwords untuk 3 user baru:\n")
for i in range(1, 4):
    temp_pwd = quick_password(length=12)
    hashed_temp = quick_hash(temp_pwd, rounds=10)
    print(f"User {i}:")
    print(f"  Temp Password: {temp_pwd}")
    print(f"  Hash: {hashed_temp}\n")


# =============================================================================
# SUMMARY
# =============================================================================
print("=" * 70)
print("SUMMARY - Cara Integrasi ke Database")
print("=" * 70)
print("""
✅ WORKFLOW:

1. REGISTER:
   - plain_password dari user input
   - Quick_hash() → simpan di database
   
2. LOGIN:
   - plain_password dari user input
   - verify() dengan hash dari database
   - Jika cocok → login success
   
3. RESET PASSWORD:
   - new_password dari user
   - quick_hash() → update di database
   
4. IMPORT BULK:
   - Loop foreach user
   - Hash masing-masing password
   - Bulk INSERT ke database
   
5. VERIFIKASI EXTERNAL:
   - verify() dengan hash dari sistem lain
   - Untuk migrasi atau sinkronisasi

🔐 SECURITY TIPS:
   - Selalu use HTTPS saat kirim password
   - Jangan log plain password
   - Gunakan rounds=10 minimum
   - Add salt atau pepper untuk extra security
   - Limit login attempts (brute force protection)
""")
