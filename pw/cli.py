"""
INSTANT PASSWORD GENERATOR
Langsung keluar hasil di terminal - bisa langsung dikopi!

Penggunaan:
    python cli.py                    # Generate 1 password random
    python cli.py -n 5              # Generate 5 password
    python cli.py -hash admin123    # Hash password spesifik
    python cli.py -v admin123 (hash) # Verifikasi password
"""

import sys
import secrets
import string
from quick import quick_password, quick_hash, verify

def main():
    if len(sys.argv) == 1:
        # Default: Generate 1 password random
        pwd = quick_password(12)
        print(pwd)
        return
    
    command = sys.argv[1]
    
    # ----- GENERATE MULTIPLE PASSWORD -----
    if command == "-n" and len(sys.argv) > 2:
        count = int(sys.argv[2])
        for i in range(count):
            print(quick_password(12))
    
    # ----- GENERATE PASSWORD DENGAN PANJANG CUSTOM -----
    elif command == "-len" and len(sys.argv) > 2:
        length = int(sys.argv[2])
        pwd = quick_password(length)
        print(pwd)
    
    # ----- HASH PASSWORD -----
    elif command == "-hash" and len(sys.argv) > 2:
        password = sys.argv[2]
        hashed = quick_hash(password, rounds=10)
        print(hashed)
    
    # ----- HASH DENGAN ROUNDS CUSTOM -----
    elif command == "-hash-rounds" and len(sys.argv) > 3:
        password = sys.argv[2]
        rounds = int(sys.argv[3])
        hashed = quick_hash(password, rounds=rounds)
        print(hashed)
    
    # ----- VERIFIKASI -----
    elif command == "-verify" and len(sys.argv) > 3:
        password = sys.argv[2]
        hashed = sys.argv[3]
        result = verify(password, hashed)
        print("COCOK" if result else "TIDAK COCOK")
    
    # ----- HELP -----
    elif command in ["-h", "--help", "-help"]:
        print("""
=====================================================
INSTANT PASSWORD GENERATOR - CLI
=====================================================

COMMAND:

1. Generate 1 password random (12 char):
   python cli.py
   
   Output: K9@mL2$xQ4pN

2. Generate 5 password:
   python cli.py -n 5
   
   Output:
   K9@mL2$xQ4pN
   aB3xL8$mQ2pR
   ...

3. Generate password dengan panjang custom:
   python cli.py -len 20
   
   Output: K9@mL2$xQ4pNaB3xL8$m

4. Hash password:
   python cli.py -hash admin123
   
   Output: $2b$10$NM7Odhof400Pfu6j90WWL.i.JYCrp0CL7jfvKK3W/FPj9LdqGwWga

5. Hash dengan rounds custom:
   python cli.py -hash-rounds admin123 12
   
   Output: $2b$12$...

6. Verifikasi password:
   python cli.py -verify admin123 "$2b$10$..."
   
   Output: COCOK atau TIDAK COCOK

7. Show help:
   python cli.py -h

=====================================================
        """)
    
    else:
        print("❌ Command tidak dikenali. Gunakan: python cli.py -h")

if __name__ == "__main__":
    main()
