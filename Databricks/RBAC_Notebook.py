# Databricks notebook source
# DATABRICKS RBAC & ROW-LEVEL ACCESS CONTROL - NOTEBOOK VERSION
# Copy & Paste this into your Databricks Notebook
# Learning Objective: LO3 - Role-Based Access Control (20 points)

# ============================================================================
# SETUP - Run first
# ============================================================================

# COMMAND ----------

# Import libraries
from pyspark.sql.functions import col, when, lit, count, sum
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
import pandas as pd
from datetime import datetime

# Setup database
catalog = "delivery_system"
schema = "rbac_demo"
database = f"{catalog}.{schema}"

# Create catalog and schema
spark.sql(f"CREATE CATALOG IF NOT EXISTS {catalog}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {database}")

# COMMAND ----------

print(f"✅ Database Setup Complete: {database}")

# ============================================================================
# STEP 1: CREATE SAMPLE DATA TABLE
# ============================================================================

# COMMAND ----------

# Create sample delivery data
data = [
    ('D001', 'North', 'Budi', 'On Route', 'manager', 'Budi', 1500000),
    ('D002', 'South', 'Sari', 'Completed', 'manager', 'Sari', 1600000),
    ('D003', 'East', 'Andi', 'Delayed', 'driver', 'Andi', 1500000),
    ('D004', 'North', 'Rina', 'On Route', 'driver', 'Rina', 1450000),
    ('D005', 'West', 'Budi', 'Completed', 'manager', 'Budi', 1500000),
    ('D006', 'South', 'Andi', 'Pending', 'driver', 'Andi', 1500000),
    ('D007', 'Central', 'Sari', 'On Route', 'manager', 'Sari', 1600000),
    ('D008', 'North', 'Andi', 'Cancelled', 'driver', 'Andi', 1500000),
]

schema = StructType([
    StructField("delivery_id", StringType(), True),
    StructField("region", StringType(), True),
    StructField("driver_name", StringType(), True),
    StructField("status", StringType(), True),
    StructField("access_level", StringType(), True),
    StructField("assigned_driver", StringType(), True),
    StructField("salary", IntegerType(), True),
])

df_base = spark.createDataFrame(data, schema)

# Save as table
table_name = f"{database}.deliveries"
df_base.write.mode("overwrite").option("mergeSchema", "true").saveAsTable(table_name)

print(f"✅ Created table: {table_name}")
print(f"   Total records: {df_base.count()}")
df_base.show()

# COMMAND ----------

# ============================================================================
# STEP 2: CREATE ROLE DEFINITIONS
# ============================================================================

# COMMAND ----------

# Define role permissions
role_permissions = {
    'MANAGER': {
        'description': 'Can view all data and edit status',
        'can_view_all_rows': True,
        'can_view_salary': True,
        'can_edit': True,
        'visible_columns': ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
    },
    'DRIVER': {
        'description': 'Can only view own deliveries',
        'can_view_all_rows': False,
        'can_view_salary': False,
        'can_edit': False,
        'visible_columns': ['delivery_id', 'region', 'driver_name', 'status']
    },
    'ADMIN': {
        'description': 'Full access to all data',
        'can_view_all_rows': True,
        'can_view_salary': True,
        'can_edit': True,
        'visible_columns': ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
    }
}

# Create role permissions table
role_perms = [
    ('MANAGER', 'Can view all data and edit status', True, True, True),
    ('DRIVER', 'Can only view own deliveries', False, False, False),
    ('ADMIN', 'Full access to all data', True, True, True),
]

role_schema = StructType([
    StructField("role", StringType(), True),
    StructField("description", StringType(), True),
    StructField("can_view_all", StringType(), True),
    StructField("can_view_salary", StringType(), True),
    StructField("can_edit", StringType(), True),
])

df_roles = spark.createDataFrame(role_perms, role_schema)
df_roles.write.mode("overwrite").saveAsTable(f"{database}.role_permissions")

print("✅ Role Permissions Defined:")
df_roles.show(truncate=False)

# COMMAND ----------

# ============================================================================
# STEP 3: FUNCTION - Get User Role
# ============================================================================

# COMMAND ----------

def get_user_role(username):
    """Determine role based on username"""
    username_lower = username.lower()
    
    if 'manager' in username_lower or 'admin' in username_lower:
        return 'MANAGER'
    elif username_lower in ['andi', 'budi', 'sari', 'rina']:
        return 'DRIVER'
    else:
        return 'VIEWER'

# Test the function
test_users = ['manager_1', 'Andi', 'Budi', 'admin_user']
for user in test_users:
    role = get_user_role(user)
    print(f"👤 {user:15} → 🔐 {role}")

# COMMAND ----------

# ============================================================================
# STEP 4: FUNCTION - Apply RBAC Filtering
# ============================================================================

# COMMAND ----------

def apply_rbac(username):
    """
    Apply both row-level and column-level access control
    Returns: (filtered_dataframe, filter_description)
    """
    # Read base table
    df = spark.table(f"{database}.deliveries")
    
    # Get user role
    role = get_user_role(username)
    
    # Apply row-level filtering
    if role == 'MANAGER' or role == 'ADMIN':
        # Can see all rows
        df_filtered = df
        row_filter = "No filtering (Full access)"
    elif role == 'DRIVER':
        # Can only see own deliveries
        df_filtered = df.filter(col("assigned_driver") == username)
        row_filter = f"assigned_driver = '{username}'"
    else:
        # No access
        df_filtered = df.filter(col("delivery_id") == "NONE")  # Empty result
        row_filter = "No access (Viewer role)"
    
    # Apply column-level filtering
    if role == 'MANAGER' or role == 'ADMIN':
        # Can see all columns
        visible_cols = ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
    else:
        # Cannot see salary and assigned_driver
        visible_cols = ['delivery_id', 'region', 'driver_name', 'status']
    
    # Select only visible columns
    available_cols = [c for c in visible_cols if c in df_filtered.columns]
    df_final = df_filtered.select(*available_cols)
    
    return df_final, role, row_filter

# COMMAND ----------

# ============================================================================
# SCENARIO 1: MANAGER QUERY
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 1: MANAGER ROLE - FULL ACCESS")
print("=" * 80)
print()

manager = "manager_1"
df_manager, role, filter_desc = apply_rbac(manager)

print(f"👤 User: {manager}")
print(f"🔐 Role: {role}")
print(f"🔍 Row Filter: {filter_desc}")
print(f"📋 Visible Columns: {', '.join(df_manager.columns)}")
print(f"✅ Records Visible: {df_manager.count()}/8")
print()
print("📊 Query Result:")
df_manager.show(truncate=False)

# COMMAND ----------

# ============================================================================
# SCENARIO 2: DRIVER QUERY (Andi)
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 2: DRIVER ROLE - ROW-LEVEL ACCESS (Andi)")
print("=" * 80)
print()

driver_andi = "Andi"
df_andi, role, filter_desc = apply_rbac(driver_andi)

print(f"👤 User: {driver_andi}")
print(f"🔐 Role: {role}")
print(f"🔍 Row Filter: {filter_desc}")
print(f"📋 Visible Columns: {', '.join(df_andi.columns)}")
print(f"❌ Masked Columns: salary, assigned_driver")
print(f"✅ Records Visible: {df_andi.count()}/8")
print()
print("📊 Query Result:")
df_andi.show(truncate=False)

# COMMAND ----------

# ============================================================================
# SCENARIO 3: DRIVER QUERY (Budi)
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 3: DRIVER ROLE - ROW-LEVEL ACCESS (Budi)")
print("=" * 80)
print()

driver_budi = "Budi"
df_budi, role, filter_desc = apply_rbac(driver_budi)

print(f"👤 User: {driver_budi}")
print(f"🔐 Role: {role}")
print(f"🔍 Row Filter: {filter_desc}")
print(f"📋 Visible Columns: {', '.join(df_budi.columns)}")
print(f"❌ Masked Columns: salary, assigned_driver")
print(f"✅ Records Visible: {df_budi.count()}/8")
print()
print("📊 Query Result:")
df_budi.show(truncate=False)

# COMMAND ----------

# ============================================================================
# SCENARIO 4: COMPARISON TABLE
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 4: COMPARISON - PERBEDAAN AKSES ANTAR ROLE")
print("=" * 80)
print()

users = ["manager_1", "Andi", "Budi", "Sari"]
comparison_data = []

for user in users:
    df_temp, role, _ = apply_rbac(user)
    comparison_data.append({
        'User': user,
        'Role': role,
        'Records Visible': df_temp.count(),
        'Visible Columns': len(df_temp.columns),
        'Can View Salary': '✅ Yes' if role in ['MANAGER', 'ADMIN'] else '❌ No',
        'Can Edit': '✅ Yes' if role in ['MANAGER', 'ADMIN'] else '❌ No'
    })

comparison_df = pd.DataFrame(comparison_data)
print(comparison_df.to_string(index=False))

# COMMAND ----------

# ============================================================================
# SCENARIO 5: DETAILED COMPARISON - SAME DRIVER, DIFFERENT VIEWS
# ============================================================================

# COMMAND ----------

print("\n" + "=" * 80)
print("SCENARIO 5: SAME DATA, DIFFERENT VIEWS")
print("=" * 80)
print()

print("🔍 All Deliveries Assigned to ANDI:\n")

print("1️⃣  MANAGER VIEW (dapat melihat salary):")
df = spark.table(f"{database}.deliveries")
df.filter(col("driver_name") == "Andi").select('delivery_id', 'region', 'driver_name', 'status', 'salary').show()

print("\n2️⃣  DRIVER VIEW (TIDAK dapat melihat salary):")
df_andi, _, _ = apply_rbac("Andi")
df_andi.show()

print("\n🔒 Perbedaan: SALARY column di-MASK untuk Driver role")

# COMMAND ----------

# ============================================================================
# SCENARIO 6: CREATE SQL VIEW WITH DYNAMIC RBAC
# ============================================================================

# COMMAND ----------

# Create manager view (full access)
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.deliveries_manager_view AS
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

# Create driver view (row-level filtering)
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.deliveries_driver_view AS
SELECT 
    delivery_id,
    region,
    driver_name,
    status
FROM {database}.deliveries
WHERE assigned_driver = CURRENT_USER()
""")

print(f"✅ Created manager_view")
print(f"✅ Created driver_view")

# Show views
print("\n🔍 Manager View (Full Access):")
spark.sql(f"SELECT * FROM {database}.deliveries_manager_view LIMIT 5").show()

# COMMAND ----------

# ============================================================================
# SCENARIO 7: ANALYTICS - MANAGER ONLY
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 6: ANALYTICS QUERY - MANAGER ONLY")
print("=" * 80)
print()

print("📊 Total Deliveries by Driver (with Salary Info - Manager Only):\n")

spark.sql(f"""
SELECT 
    driver_name,
    COUNT(*) as total_deliveries,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'On Route' THEN 1 ELSE 0 END) as on_route,
    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as delayed,
    SUM(salary) as total_salary_cost
FROM {database}.deliveries
GROUP BY driver_name
ORDER BY total_deliveries DESC
""").show()

print("\n⚠️  Note: Driver role CANNOT access this query (salary data is sensitive)")

# COMMAND ----------

# ============================================================================
# SCENARIO 8: AUDIT LOG
# ============================================================================

# COMMAND ----------

print("=" * 80)
print("SCENARIO 7: AUDIT LOG - SECURITY TRACKING")
print("=" * 80)
print()

audit_data = [
    ('manager_1', 'MANAGER', 'SELECT', 'deliveries', 8, 'Full access'),
    ('Andi', 'DRIVER', 'SELECT', 'deliveries', 3, 'Own records only'),
    ('Budi', 'DRIVER', 'SELECT', 'deliveries', 2, 'Own records only'),
    ('Andi', 'DRIVER', 'SELECT', 'salary', 0, 'DENIED'),
    ('manager_1', 'MANAGER', 'SELECT', 'salary', 8, 'Full access'),
]

audit_schema = StructType([
    StructField("user", StringType(), True),
    StructField("role", StringType(), True),
    StructField("action", StringType(), True),
    StructField("table", StringType(), True),
    StructField("records_accessed", IntegerType(), True),
    StructField("result", StringType(), True),
])

df_audit = spark.createDataFrame(audit_data, audit_schema)
df_audit.write.mode("overwrite").saveAsTable(f"{database}.audit_log")

print("📋 Audit Log - Access Tracking:\n")
df_audit.show(truncate=False)

# COMMAND ----------

# ============================================================================
# SUMMARY & KEY LEARNINGS
# ============================================================================

# COMMAND ----------

print("\n" + "█"*80)
print("█" + " "*25 + "🎓 KEY LEARNINGS - LO3" + " "*30 + "█")
print("█"*80)
print("""
█ LEARNING OBJECTIVE: Role-Based Access Control (RBAC)                        █
█ POINTS: 20                                                                  █
█                                                                             █
█ ✅ WHAT YOU LEARNED:                                                       █
█                                                                             █
█ 1. ROW-LEVEL ACCESS CONTROL                                                █
█    • Manager: Lihat 8/8 records (100%)                                     █
█    • Andi (Driver): Lihat 3/8 records (37.5%) - hanya miliknya             █
█    • Budi (Driver): Lihat 2/8 records (25%) - hanya miliknya               █
█                                                                             █
█ 2. COLUMN-LEVEL ACCESS CONTROL                                             █
█    • Manager: Bisa lihat salary column                                      █
█    • Driver: TIDAK bisa lihat salary (masked)                              █
█    • Sensitive data protection terjaga                                      █
█                                                                             █
█ 3. DYNAMIC FILTERING                                                        █
█    • Filter otomatis berdasarkan assigned_driver                            █
█    • WHERE assigned_driver = CURRENT_USER()                                █
█    • Scalable untuk banyak users                                           █
█                                                                             █
█ 4. TWO ROLE SIMULATION                                                      █
█    • Manager Role: Full access, can view salary                             █
█    • Driver Role: Limited access, cannot view salary                        █
█    • Access control rules applied automatically                             █
█                                                                             █
█ 5. DIFFERENCE IN QUERY RESULTS                                              █
█    • Same table, different results based on role                            █
█    • Manager sees complete picture                                          █
█    • Driver sees only relevant data                                         █
█    • Privacy and security maintained                                        █
█                                                                             █
█ 6. SECURITY BEST PRACTICES                                                  █
█    • Use views for centralized access control                               █
█    • Keep audit logs for compliance                                         █
█    • Mask sensitive columns from non-managers                               █
█    • Test access with multiple user roles                                   █
█                                                                             █
█ 💡 PRACTICAL BENEFITS:                                                     █
█    ✓ Data isolation between users                                          █
█    ✓ Privacy protection (salary not exposed)                               █
█    ✓ Compliance with data protection laws                                  █
█    ✓ Easy role management at scale                                         █
█    ✓ Audit trail for security monitoring                                   █
█                                                                             █
""")
print("█"*80)

# COMMAND ----------

print("\n✅ RBAC Implementation Complete!")
print("🎓 LO3: Role-Based Access Control - 20 points")
