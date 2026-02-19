"""
PASSWORD GENERATOR - QUICK START
Gunakan file ini untuk kebutuhan cepat
"""

import secrets
import string

# ============= PILIHAN 1: PASSWORD RANDOM CEPAT =============
def quick_password(length=12):
    """Generate password random dalam 1 baris"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits + "!@#$%^&*") for _ in range(length))


# ============= PILIHAN 2: HASH DENGAN BCRYPT =============
def quick_hash(password, rounds=10):
    """Hash password dengan bcrypt"""
    try:
        import bcrypt
        salt = bcrypt.gensalt(rounds=rounds)
        return bcrypt.hashpw(password.encode(), salt).decode()
    except ImportError:
        print("⚠️  Install bcrypt dulu: pip install bcrypt")
        return None


# ============= PILIHAN 3: VERIFIKASI =============
def verify(password, hashed):
    """Cek apakah password cocok dengan hash"""
    try:
        import bcrypt
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ImportError:
        print("⚠️  Install bcrypt dulu: pip install bcrypt")
        return False


# ===== TEST =====
if __name__ == "__main__":
    print("TEST QUICK PASSWORD GENERATOR\n")
    
    # Test 1
    print("1️⃣  Generate 3 Password Random:")
    for i in range(1, 4):
        print(f"   {i}. {quick_password(12)}")
    
    print("\n2️⃣  Hash password 'admin123':")
    hash_result = quick_hash("admin123", rounds=10)
    if hash_result:
        print(f"   {hash_result}")
        print("\n3️⃣  Verifikasi password:")
        print(f"   'admin123' cocok? {verify('admin123', hash_result)}")
        print(f"   'salah123' cocok? {verify('salah123', hash_result)}")
