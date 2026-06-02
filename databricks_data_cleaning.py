"""
Databricks Data Cleaning Script
Normalize: date, unit_price, product_name, customer_segment
Table: teamassgement.tadidw2.retail_laptop_pc_gaming_150_k
"""

from pyspark.sql import functions as F
import re
from datetime import datetime

# ===== CONFIGURATION =====
CATALOG = "teamassgement"
SCHEMA = "tadidw2"
TABLE = "retail_laptop_pc_gaming_150_k"
FULL_TABLE = f"{CATALOG}.{SCHEMA}.{TABLE}"

# ===== READ DATA =====
print(f"📖 Reading table: {FULL_TABLE}")
try:
    df = spark.sql(f"SELECT * FROM {FULL_TABLE}")
    print(f"✓ Loaded {df.count()} rows\n")
except Exception as e:
    print(f"❌ Error reading table: {e}")
    raise

print("=" * 80)
print("ORIGINAL DATA")
print("=" * 80)
df.show(5)
print(f"\nSchema:")
df.printSchema()

# ===== 1. CLEAN DATE COLUMN =====
print("\n" + "=" * 80)
print("CLEANING: date")
print("=" * 80)

def parse_date(date_str):
    """Parse various date formats to YYYY-MM-DD"""
    if date_str is None:
        return None
    
    date_str = str(date_str).strip()
    
    formats = [
        "%Y-%m-%d",      # 2025-02-01
        "%d/%m/%Y",      # 01/02/2025
        "%Y/%m/%d",      # 2025/02/01
        "%m-%d-%Y",      # 02-01-2025
        "%d-%m-%Y",      # 01-02-2025
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except:
            continue
    
    return None

parse_date_udf = F.udf(parse_date)
df = df.withColumn("date", parse_date_udf(F.col("date")))
print("✓ Date normalized to YYYY-MM-DD format")

# ===== 2. CLEAN UNIT_PRICE COLUMN =====
print("\n" + "=" * 80)
print("CLEANING: unit_price")
print("=" * 80)

def parse_price(price_str):
    """Parse various price formats to numeric"""
    if price_str is None:
        return None
    
    price_str = str(price_str).strip()
    
    # Remove "Rp", "IDR", spaces
    price_str = re.sub(r'[Rp\s]', '', price_str)
    # Remove thousand separators (dots/commas)
    price_str = re.sub(r'[,.](?=\d{3}(?:[,.]|$))', '', price_str)
    # Keep only digits and decimal point
    price_str = re.sub(r'[^\d.]', '', price_str)
    
    try:
        return float(price_str) if price_str else None
    except:
        return None

parse_price_udf = F.udf(parse_price)
df = df.withColumn("unit_price", parse_price_udf(F.col("unit_price")).cast("double"))
print("✓ Price normalized to numeric format (DOUBLE)")

# ===== 3. CLEAN PRODUCT_NAME COLUMN =====
print("\n" + "=" * 80)
print("CLEANING: product_name")
print("=" * 80)

df = df.withColumn("product_name", F.trim(F.upper(F.col("product_name"))))
print("✓ Product name normalized to UPPERCASE")

# ===== 4. CLEAN CUSTOMER_SEGMENT COLUMN =====
print("\n" + "=" * 80)
print("CLEANING: customer_segment")
print("=" * 80)

df = df.withColumn("customer_segment", F.trim(F.upper(F.col("customer_segment"))))
print("✓ Customer segment normalized to UPPERCASE")

# ===== FINAL RESULT =====
print("\n" + "=" * 80)
print("CLEANED DATA")
print("=" * 80)
df.show(5)
print(f"\nTotal rows: {df.count()}")

print("\nFinal Schema:")
df.printSchema()
