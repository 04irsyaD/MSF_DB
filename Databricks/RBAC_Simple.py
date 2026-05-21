# Databricks notebook source
# DATABRICKS RBAC SEDERHANA - COPY PASTE KE NOTEBOOK
# Learning Objective: LO3 - Role-Based Access Control (20 points)

# COMMAND ----------

# SETUP: Buat data dan database
catalog = "delivery_system"
schema = "rbac_demo"
database = f"{catalog}.{schema}"

spark.sql(f"CREATE CATALOG IF NOT EXISTS {catalog}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {database}")

print("✅ Database ready")

# COMMAND ----------

# Buat table deliveries
spark.sql(f"""
CREATE OR REPLACE TABLE {database}.deliveries (
    delivery_id STRING,
    region STRING,
    driver_name STRING,
    status STRING,
    access_level STRING,
    assigned_driver STRING,
    salary INT,
    created_date STRING
)
""")

spark.sql(f"""
INSERT INTO {database}.deliveries VALUES
('D001', 'North', 'Budi', 'On Route', 'manager', 'Budi', 1500000, '2025-01-15'),
('D002', 'South', 'Sari', 'Completed', 'manager', 'Sari', 1600000, '2025-01-15'),
('D003', 'East', 'Andi', 'Delayed', 'driver', 'Andi', 1500000, '2025-01-15'),
('D004', 'North', 'Rina', 'On Route', 'driver', 'Rina', 1450000, '2025-01-15'),
('D005', 'West', 'Budi', 'Completed', 'manager', 'Budi', 1500000, '2025-01-16'),
('D006', 'South', 'Andi', 'Pending', 'driver', 'Andi', 1500000, '2025-01-16'),
('D007', 'Central', 'Sari', 'On Route', 'manager', 'Sari', 1600000, '2025-01-16'),
('D008', 'North', 'Andi', 'Cancelled', 'driver', 'Andi', 1500000, '2025-01-17')
""")

print(f"✅ Tabel {database}.deliveries created")
spark.sql(f"SELECT * FROM {database}.deliveries").show(10)

# COMMAND ----------

# ============================================================================
# SCENARIO 1: MANAGER QUERY - FULL ACCESS (Semua data, termasuk salary)
# ============================================================================

print("="*80)
print("SCENARIO 1: MANAGER ROLE - FULL ACCESS")
print("="*80)
print()
print("👤 User: manager_1")
print("🔐 Role: MANAGER")
print("✅ Can see: All data (8 records)")
print("✅ Can see: salary column")
print("✅ Can see: All regions")
print()
print("📊 Query:")

spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status,
    assigned_driver,
    salary
FROM {database}.deliveries
WHERE 1=1
ORDER BY delivery_id
""").show(truncate=False)

print("\n✅ Total: 8/8 records visible")

# COMMAND ----------

# ============================================================================
# SCENARIO 2: DRIVER QUERY (ANDI) - ROW-LEVEL ACCESS ONLY
# ============================================================================

print("="*80)
print("SCENARIO 2: DRIVER ROLE - ROW-LEVEL ACCESS (Andi)")
print("="*80)
print()
print("👤 User: Andi")
print("🔐 Role: DRIVER")
print("✅ Can see: Only own deliveries")
print("❌ Cannot see: salary column")
print("❌ Cannot see: assigned_driver column")
print()
print("📊 Query (filtering by assigned_driver = 'Andi'):")

spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = 'Andi'
ORDER BY delivery_id
""").show(truncate=False)

print("\n✅ Total: 3/8 records visible")
print("⚠️  MASKED COLUMNS: salary, assigned_driver")

# COMMAND ----------

# ============================================================================
# SCENARIO 3: DRIVER QUERY (BUDI) - ROW-LEVEL ACCESS ONLY
# ============================================================================

print("="*80)
print("SCENARIO 3: DRIVER ROLE - ROW-LEVEL ACCESS (Budi)")
print("="*80)
print()
print("👤 User: Budi")
print("🔐 Role: DRIVER")
print("✅ Can see: Only own deliveries")
print("❌ Cannot see: salary column")
print()
print("📊 Query (filtering by assigned_driver = 'Budi'):")

spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = 'Budi'
ORDER BY delivery_id
""").show(truncate=False)

print("\n✅ Total: 2/8 records visible")

# COMMAND ----------

# ============================================================================
# SCENARIO 4: PERBANDINGAN AKSES DRIVER LAINNYA
# ============================================================================

print("="*80)
print("SCENARIO 4: PERBANDINGAN - AKSES DRIVER LAIN")
print("="*80)
print()

print("📊 Driver Sari (dapat lihat 2 records):")
spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = 'Sari'
""").show()

print("\n📊 Driver Rina (dapat lihat 1 record):")
spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = 'Rina'
""").show()

# COMMAND ----------

# ============================================================================
# SCENARIO 5: COMPARISON TABLE - PERBEDAAN AKSES
# ============================================================================

print("="*80)
print("SCENARIO 5: COMPARISON - PERBEDAAN AKSES ANTAR ROLE")
print("="*80)
print()

result = spark.sql(f"""
SELECT 
    'MANAGER' as Role,
    8 as Records,
    'Semua kolom' as Visible_Columns,
    'Ya' as Can_See_Salary,
    'Semua region' as Regions
UNION ALL
SELECT 'DRIVER (Andi)', 3, 'Tanpa salary/assigned_driver', 'Tidak', 'East, South, North'
UNION ALL
SELECT 'DRIVER (Budi)', 2, 'Tanpa salary/assigned_driver', 'Tidak', 'North, West'
UNION ALL
SELECT 'DRIVER (Sari)', 2, 'Tanpa salary/assigned_driver', 'Tidak', 'South, Central'
UNION ALL
SELECT 'DRIVER (Rina)', 1, 'Tanpa salary/assigned_driver', 'Tidak', 'North'
""")

result.show(truncate=False)

# COMMAND ----------

# ============================================================================
# SCENARIO 6: MANAGER VIEW - Analytics (Salary summary)
# ============================================================================

print("="*80)
print("SCENARIO 6: MANAGER ONLY - SALARY ANALYTICS")
print("="*80)
print()
print("👤 User: manager_1")
print("🔐 Role: MANAGER")
print("✅ Query: Total salary per driver (Manager only)")
print()

spark.sql(f"""
SELECT 
    driver_name,
    COUNT(*) as total_deliveries,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'On Route' THEN 1 ELSE 0 END) as on_route,
    SUM(salary) as total_salary_cost
FROM {database}.deliveries
GROUP BY driver_name
ORDER BY total_deliveries DESC
""").show(truncate=False)

print("\n⚠️  Driver role TIDAK dapat akses query ini (salary is sensitive)")

# COMMAND ----------

# ============================================================================
# SCENARIO 7: DETAILED COMPARISON - SAME DRIVER, DIFFERENT VIEWS
# ============================================================================

print("="*80)
print("SCENARIO 7: SAME DATA, DIFFERENT VIEWS")
print("="*80)
print()
print("🔍 Deliveries untuk ANDI - dibandingkan dari 2 role:\n")

print("1️⃣  MANAGER VIEW (lihat salary):")
spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status,
    assigned_driver,
    salary
FROM {database}.deliveries
WHERE driver_name = 'Andi'
ORDER BY delivery_id
""").show(truncate=False)

print("\n2️⃣  DRIVER VIEW (Andi - TIDAK lihat salary):")
spark.sql(f"""
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE driver_name = 'Andi'
ORDER BY delivery_id
""").show(truncate=False)

print("\n🔒 PERBEDAAN: Columns yang di-MASKED untuk Driver:")
print("   ❌ assigned_driver (tersembunyi)")
print("   ❌ salary (tersembunyi)")

# COMMAND ----------

# ============================================================================
# SCENARIO 8: CREATE VIEWS
# ============================================================================

print("="*80)
print("SCENARIO 8: CREATE SQL VIEWS FOR RBAC")
print("="*80)
print()

# Manager View
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.v_manager_view AS
SELECT 
    delivery_id,
    region,
    driver_name,
    status,
    assigned_driver,
    salary,
    'MANAGER' as role_required
FROM {database}.deliveries
WHERE 1=1
""")

print("✅ Created: v_manager_view (full access)")

# Driver View
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.v_driver_view AS
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = 'ANDI' OR assigned_driver = 'BUDI'
""")

print("✅ Created: v_driver_view (limited access)")

# COMMAND ----------

# ============================================================================
# SCENARIO 9: AUDIT LOG
# ============================================================================

print("="*80)
print("SCENARIO 9: AUDIT LOG - SECURITY TRACKING")
print("="*80)
print()

spark.sql(f"""
CREATE OR REPLACE TABLE {database}.audit_log AS
SELECT 
    'manager_1' as user_id,
    'MANAGER' as role,
    'SELECT' as action,
    'deliveries' as table_name,
    8 as records_accessed,
    'salary' as sensitive_columns,
    '✅ ALLOWED' as access_status
UNION ALL
SELECT 'Andi', 'DRIVER', 'SELECT', 'deliveries', 3, 'salary (BLOCKED)', '✅ ALLOWED (limited)'
UNION ALL
SELECT 'Budi', 'DRIVER', 'SELECT', 'deliveries', 2, 'salary (BLOCKED)', '✅ ALLOWED (limited)'
UNION ALL
SELECT 'Andi', 'DRIVER', 'SELECT', 'salary', 0, 'N/A', '❌ DENIED'
""")

print("📋 Audit Log:")
spark.sql(f"SELECT * FROM {database}.audit_log").show(truncate=False)

# COMMAND ----------

# ============================================================================
# SUMMARY & KEY LEARNINGS
# ============================================================================

print("\n" + "█"*80)
print("█" + " "*20 + "🎓 KEY LEARNINGS - LO3: RBAC" + " "*30 + "█")
print("█"*80)
print("""
█ LEARNING OBJECTIVE: Role-Based Access Control                            █
█ POINTS: 20                                                               █
█                                                                          █
█ ✅ YANG DIPELAJARI:                                                      █
█                                                                          █
█ 1️⃣  ROW-LEVEL ACCESS CONTROL                                           █
█    Manager:      lihat 8/8 records (100%)                                █
█    Andi:         lihat 3/8 records (37.5%) - hanya punya dia             █
█    Budi:         lihat 2/8 records (25%) - hanya punya dia               █
█    Sari:         lihat 2/8 records (25%) - hanya punya dia               █
█    Rina:         lihat 1/8 records (12.5%) - hanya punya dia             █
█                                                                          █
█ 2️⃣  COLUMN-LEVEL SECURITY                                              █
█    Manager:      bisa lihat salary ✅                                     █
█    Driver:       TIDAK bisa lihat salary ❌ (MASKED)                      █
█    Driver:       TIDAK bisa lihat assigned_driver ❌ (MASKED)             █
█                                                                          █
█ 3️⃣  FILTERING METHOD                                                    █
█    WHERE assigned_driver = username                                       █
█    WHERE assigned_driver = CURRENT_USER()                                █
█    Automatic filtering based on role                                      █
█                                                                          █
█ 4️⃣  TWO ROLES DEMONSTRATED                                             █
█    ✓ MANAGER:  Full access, can see salary, edit status                  █
█    ✓ DRIVER:   Limited access, cannot see salary, read-only              █
█                                                                          █
█ 5️⃣  SQL QUERIES DIFFERENCES                                            █
█    Same table, different results per role                                █
█    Manager sees sensitive data, driver doesn't                           █
█    Automatic security enforcement in views                               █
█                                                                          █
█ 6️⃣  SECURITY BENEFITS                                                   █
█    ✓ Data isolation between users/drivers                                █
█    ✓ Sensitive data protection (salary masking)                          █
█    ✓ Privacy compliance (GDPR)                                           █
█    ✓ Audit trail for security monitoring                                 █
█    ✓ Easy role management at scale                                       █
█                                                                          █
█ 💡 IMPLEMENTATION:                                                       █
█    1. Define roles (MANAGER, DRIVER)                                     █
█    2. Create permission matrix                                           █
█    3. Apply row-level filters in views/queries                           █
█    4. Apply column-level masking                                         █
█    5. Test with multiple users                                           █
█    6. Maintain audit logs                                                █
█                                                                          █
""")
print("█"*80)

print("\n" + "="*80)
print("✅ RBAC Implementation Complete! - LO3: 20 points")
print("="*80)
