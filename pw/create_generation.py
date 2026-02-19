import secrets
import string
import hashlib
import base64

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False
    print("⚠️  bcrypt not installed. Install with: pip install bcrypt")
    print("Using fallback method...\n")

def generate_password(length=16):
    """Generate random password"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*_-+=?"
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password

def hash_password_bcrypt(password, rounds=10):
    """Hash password menggunakan bcrypt (recommended)"""
    if not HAS_BCRYPT:
        raise ImportError("bcrypt tidak terinstall. Install dengan: pip install bcrypt")
    
    salt = bcrypt.gensalt(rounds=rounds)
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def verify_password_bcrypt(password, hashed):
    """Verifikasi password dengan hash bcrypt"""
    if not HAS_BCRYPT:
        raise ImportError("bcrypt tidak terinstall")
    return bcrypt.checkpw(password.encode(), hashed.encode())

def hash_password_sha256(password):
    """Hash sederhana menggunakan SHA256 (fallback)"""
    return hashlib.sha256(password.encode()).hexdigest()

def main():
    print("=" * 50)
    print("Password Generator - Bcrypt Format")
    print("=" * 50)
    
    if HAS_BCRYPT:
        print("\n✅ bcrypt terinstall. Menggunakan metode Bcrypt.\n")
        
        # Opsi 1: Generate password baru
        print("--- Opsi 1: Generate Password Random ---")
        password = generate_password(length=12)
        hashed = hash_password_bcrypt(password, rounds=10)
        print(f"Password: {password}")
        print(f"Hash:     {hashed}\n")
        
        # Opsi 2: Hash password spesifik
        print("--- Opsi 2: Hash Password Spesifik ---")
        your_password = input("Masukkan password: ")
        hashed_custom = hash_password_bcrypt(your_password, rounds=10)
        print(f"Hash: {hashed_custom}\n")
        
        # Opsi 3: Verifikasi
        print("--- Opsi 3: Verifikasi Password ---")
        test_password = input("Masukkan password untuk diverifikasi: ")
        is_valid = verify_password_bcrypt(test_password, hashed_custom)
        print(f"✓ Password cocok: {is_valid}\n")
        
        # Contoh
        print("--- Opsi 4: Test dengan Hash yang Diberikan ---")
        example_hash = "$2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga"
        test_pwd = input("Masukkan password untuk test: ")
        try:
            is_match = verify_password_bcrypt(test_pwd, example_hash)
            print(f"✓ Match: {is_match}")
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("\n⚠️  bcrypt tidak terinstall. Menggunakan fallback SHA256.\n")
        print("--- Generator Password dengan SHA256 ---")
        password = generate_password(length=12)
        hashed = hash_password_sha256(password)
        print(f"Password: {password}")
        print(f"SHA256:   {hashed}\n")
        
        print("Untuk menggunakan Bcrypt (recommended), jalankan:")
        print("  pip install bcrypt")

if __name__ == "__main__":
    main()
