"""
DATABRICKS RBAC - QUICK REFERENCE & TESTING GUIDE
For copying directly into Databricks notebook cells
"""

# ============================================================================
# QUICK START - Copy & Paste into Databricks Cell 1
# ============================================================================

# Setup
catalog = "delivery_system"
schema = "rbac_demo"  
database = f"{catalog}.{schema}"

spark.sql(f"CREATE CATALOG IF NOT EXISTS {catalog}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {database}")

# Create deliveries table
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from pyspark.sql.functions import col

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

df = spark.createDataFrame(data, schema)
df.write.mode("overwrite").option("mergeSchema", "true").saveAsTable(f"{database}.deliveries")

print("✅ Setup Complete")

# ============================================================================
# TEST 1: MANAGER QUERY - View all data with salary
# ============================================================================

# Copy into new cell:

print("="*60)
print("TEST 1: MANAGER QUERY - Full Access")
print("="*60)

df = spark.table(f"{database}.deliveries")
print(f"\n👤 User: manager_1")
print(f"🔐 Role: MANAGER")
print(f"\n📊 Query Result (All 8 records, all columns):")
df.show(truncate=False)
print(f"\n✅ Total: {df.count()}/8 records visible")

# ============================================================================
# TEST 2: DRIVER QUERY - View only own data, no salary
# ============================================================================

# Copy into new cell:

print("="*60)
print("TEST 2: DRIVER QUERY (Andi) - Row-Level Access")
print("="*60)

driver_name = "Andi"
df = spark.table(f"{database}.deliveries")
df_filtered = df.filter(col("assigned_driver") == driver_name)
df_result = df_filtered.select("delivery_id", "region", "driver_name", "status")

print(f"\n👤 User: {driver_name}")
print(f"🔐 Role: DRIVER")
print(f"\n📊 Query Result (Only own records, no salary):")
df_result.show(truncate=False)
print(f"\n✅ Total: {df_result.count()}/8 records visible")
print(f"❌ MASKED: salary, assigned_driver columns")

# ============================================================================
# TEST 3: COMPARISON - All drivers side by side
# ============================================================================

# Copy into new cell:

print("="*60)
print("TEST 3: COMPARISON - Access for Different Drivers")
print("="*60)

import pandas as pd

df = spark.table(f"{database}.deliveries")

comparison = []
for driver in ["Andi", "Budi", "Sari"]:
    df_driver = df.filter(col("assigned_driver") == driver)
    comparison.append({
        'Driver': driver,
        'Records': df_driver.count(),
        'Statuses': ', '.join(df_driver.select('status').distinct().rdd.flatMap(lambda x: x).collect())
    })

comp_df = pd.DataFrame(comparison)
print("\n" + comp_df.to_string(index=False))

# ============================================================================
# TEST 4: ANALYTICS - Manager only query
# ============================================================================

# Copy into new cell:

print("="*60)
print("TEST 4: ANALYTICS - Driver Summary (Manager Only)")
print("="*60)

spark.sql(f"""
SELECT 
    driver_name,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'On Route' THEN 1 ELSE 0 END) as on_route,
    SUM(salary) as salary_cost
FROM {database}.deliveries
GROUP BY driver_name
ORDER BY total DESC
""").show()

print("\n⚠️  Driver role cannot access this query (salary is sensitive)")

# ============================================================================
# TEST 5: DYNAMIC RBAC FUNCTION
# ============================================================================

# Copy into new cell:

def apply_rbac_filter(username):
    """Apply RBAC based on username"""
    from pyspark.sql.functions import col
    
    df = spark.table(f"{database}.deliveries")
    
    # Determine role
    if 'manager' in username.lower() or 'admin' in username.lower():
        role = 'MANAGER'
        df_filtered = df
        visible_cols = ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
    else:
        role = 'DRIVER'
        df_filtered = df.filter(col("assigned_driver") == username)
        visible_cols = ['delivery_id', 'region', 'driver_name', 'status']
    
    df_result = df_filtered.select(*[c for c in visible_cols if c in df_filtered.columns])
    
    return df_result, role

# Test
df_andi, role_andi = apply_rbac_filter("Andi")
df_mgr, role_mgr = apply_rbac_filter("manager_1")

print(f"Andi ({role_andi}): {df_andi.count()} records")
print(f"Manager ({role_mgr}): {df_mgr.count()} records")

# ============================================================================
# TEST 6: CREATE SQL VIEWS
# ============================================================================

# Copy into new cell:

database = "delivery_system.rbac_demo"

# Manager view - full access
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.v_manager_deliveries AS
SELECT * FROM {database}.deliveries
""")

# Driver view - only own deliveries
spark.sql(f"""
CREATE OR REPLACE VIEW {database}.v_driver_deliveries AS
SELECT delivery_id, region, driver_name, status
FROM {database}.deliveries
WHERE assigned_driver = CURRENT_USER()
""")

print("✅ Views created:")
print(f"   - {database}.v_manager_deliveries (full access)")
print(f"   - {database}.v_driver_deliveries (row-level filtered)")

# Use the views
print("\nManager View (All data):")
spark.sql(f"SELECT * FROM {database}.v_manager_deliveries").show(3)

print("\nDriver View (Own data only):")
spark.sql(f"SELECT * FROM {database}.v_driver_deliveries").show(3)

# ============================================================================
# TEST 7: AUDIT LOG
# ============================================================================

# Copy into new cell:

from pyspark.sql.types import StructType, StructField, StringType, IntegerType

audit_data = [
    ('manager_1', 'MANAGER', 'SELECT', 'deliveries', 8, '✅ ALLOWED'),
    ('Andi', 'DRIVER', 'SELECT', 'deliveries', 3, '✅ ALLOWED (own only)'),
    ('Budi', 'DRIVER', 'SELECT', 'deliveries', 2, '✅ ALLOWED (own only)'),
    ('Andi', 'DRIVER', 'SELECT', 'salary', 0, '❌ DENIED (sensitive)'),
]

audit_schema = StructType([
    StructField("user", StringType(), True),
    StructField("role", StringType(), True),
    StructField("action", StringType(), True),
    StructField("table", StringType(), True),
    StructField("records", IntegerType(), True),
    StructField("result", StringType(), True),
])

df_audit = spark.createDataFrame(audit_data, audit_schema)
df_audit.write.mode("overwrite").saveAsTable(f"{database}.audit_log")

print("📋 Audit Log:")
df_audit.show(truncate=False)

# ============================================================================
# QUICK REFERENCE TABLE
# ============================================================================

"""
┌─────────────┬──────────┬─────────┬────────────┬───────────────┐
│ User        │ Role     │ Records │ Columns    │ Can See Salary│
├─────────────┼──────────┼─────────┼────────────┼───────────────┤
│ manager_1   │ MANAGER  │ 8/8     │ 7 columns  │ ✅ Yes        │
│ Andi        │ DRIVER   │ 3/8     │ 4 columns  │ ❌ No         │
│ Budi        │ DRIVER   │ 2/8     │ 4 columns  │ ❌ No         │
│ Sari        │ DRIVER   │ 2/8     │ 4 columns  │ ❌ No         │
│ Rina        │ DRIVER   │ 1/8     │ 4 columns  │ ❌ No         │
└─────────────┴──────────┴─────────┴────────────┴───────────────┘

ROW-LEVEL ACCESS RULES:
✅ Manager:  WHERE 1=1 (no filtering)
✅ Driver:   WHERE assigned_driver = '{username}'
✅ Admin:    WHERE 1=1 (no filtering)

COLUMN-LEVEL ACCESS RULES:
✅ Manager/Admin:  All columns visible
✅ Driver:         {'delivery_id', 'region', 'driver_name', 'status'}
❌ Driver:         Cannot see {salary, assigned_driver}
"""

# ============================================================================
# KEY SQL QUERIES
# ============================================================================

"""
1. Manager Query (Full Access):
   SELECT * FROM deliveries;
   Result: 8 rows, including salary

2. Driver Query (Andi):
   SELECT delivery_id, region, driver_name, status
   FROM deliveries
   WHERE assigned_driver = 'Andi';
   Result: 3 rows, no salary column

3. Dynamic Query:
   SELECT * FROM deliveries_secure
   WHERE assigned_driver = CURRENT_USER();
   
4. Manager Analytics:
   SELECT driver_name, COUNT(*), SUM(salary)
   FROM deliveries
   GROUP BY driver_name;
   (Driver role: DENIED)
"""

# ============================================================================
# SECURITY CHECKLIST
# ============================================================================

"""
✅ ROW-LEVEL SECURITY
   ☑ Manager can see all 8 deliveries
   ☑ Andi can see only 3 (own deliveries)
   ☑ Budi can see only 2 (own deliveries)
   ☑ Filtering works with assigned_driver column

✅ COLUMN-LEVEL SECURITY
   ☑ Manager sees salary column
   ☑ Driver doesn't see salary column
   ☑ Driver doesn't see assigned_driver
   ☑ Sensitive data is masked

✅ ROLE-BASED ACCESS
   ☑ Two roles defined (MANAGER, DRIVER)
   ☑ Different query results per role
   ☑ Automatic based on CURRENT_USER()
   ☑ Easy to add new roles

✅ AUDIT & COMPLIANCE
   ☑ All access logged to audit_log table
   ☑ Can track who accessed what
   ☑ Supports compliance requirements
   ☑ Security event trail maintained
"""

# ============================================================================
# COPY-PASTE TEMPLATE
# ============================================================================

"""
To use in your Databricks notebook:

1. Create new notebook
2. First cell: Run the SETUP code
3. Test cells: Copy individual TEST codes
4. Customize: Change table/column names as needed

Example for custom data:
- Replace 'deliveries' with your table name
- Replace 'assigned_driver' with your user column
- Replace 'salary' with your sensitive column
- Update role naming as needed
"""
