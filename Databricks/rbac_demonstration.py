"""
============================================================================
DATABRICKS RBAC & ROW-LEVEL ACCESS CONTROL - DEMONSTRATION
============================================================================
Purpose: Demonstrate role-based access control dengan data delivery
Learning Objective: LO3 - Role-Based Access Control (20 points)
"""

import pandas as pd
from typing import List, Dict, Tuple
import json
from datetime import datetime

# ============================================================================
# 1. SAMPLE DATA - Simulating Database
# ============================================================================

class DeliveryDatabase:
    """Simulating Databricks delivery database"""
    
    def __init__(self):
        self.deliveries = [
            {'delivery_id': 'D001', 'region': 'North', 'driver_name': 'Budi', 
             'status': 'On Route', 'assigned_driver': 'Budi', 'salary': 1500000},
            {'delivery_id': 'D002', 'region': 'South', 'driver_name': 'Sari', 
             'status': 'Completed', 'assigned_driver': 'Sari', 'salary': 1600000},
            {'delivery_id': 'D003', 'region': 'East', 'driver_name': 'Andi', 
             'status': 'Delayed', 'assigned_driver': 'Andi', 'salary': 1500000},
            {'delivery_id': 'D004', 'region': 'North', 'driver_name': 'Rina', 
             'status': 'On Route', 'assigned_driver': 'Rina', 'salary': 1450000},
            {'delivery_id': 'D005', 'region': 'West', 'driver_name': 'Budi', 
             'status': 'Completed', 'assigned_driver': 'Budi', 'salary': 1500000},
            {'delivery_id': 'D006', 'region': 'South', 'driver_name': 'Andi', 
             'status': 'Pending', 'assigned_driver': 'Andi', 'salary': 1500000},
            {'delivery_id': 'D007', 'region': 'Central', 'driver_name': 'Sari', 
             'status': 'On Route', 'assigned_driver': 'Sari', 'salary': 1600000},
            {'delivery_id': 'D008', 'region': 'North', 'driver_name': 'Andi', 
             'status': 'Cancelled', 'assigned_driver': 'Andi', 'salary': 1500000},
        ]

# ============================================================================
# 2. ROLE DEFINITIONS & PERMISSIONS
# ============================================================================

class RBACPermissions:
    """Mendefinisikan permissions untuk setiap role"""
    
    PERMISSIONS = {
        'MANAGER': {
            'can_view_all_rows': True,
            'can_view_all_regions': True,
            'can_view_driver_salary': True,
            'can_edit_delivery_status': True,
            'can_delete_records': False,
            'columns_access': ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
        },
        'DRIVER': {
            'can_view_all_rows': False,
            'can_view_all_regions': False,
            'can_view_driver_salary': False,
            'can_edit_delivery_status': False,
            'can_delete_records': False,
            'columns_access': ['delivery_id', 'region', 'driver_name', 'status']
        },
        'ADMIN': {
            'can_view_all_rows': True,
            'can_view_all_regions': True,
            'can_view_driver_salary': True,
            'can_edit_delivery_status': True,
            'can_delete_records': True,
            'columns_access': ['delivery_id', 'region', 'driver_name', 'status', 'assigned_driver', 'salary']
        }
    }
    
    @staticmethod
    def get_permissions(role: str) -> Dict:
        return RBACPermissions.PERMISSIONS.get(role, {})

# ============================================================================
# 3. ROW-LEVEL ACCESS CONTROL ENGINE
# ============================================================================

class RowLevelAccessControl:
    """Mengimplementasikan row-level filtering berdasarkan role"""
    
    @staticmethod
    def apply_row_filter(data: List[Dict], role: str, current_user: str) -> List[Dict]:
        """
        Apply row-level filtering based on role dan current user
        
        Args:
            data: List of delivery records
            role: User role (MANAGER, DRIVER, ADMIN)
            current_user: Current logged-in user
            
        Returns:
            Filtered data based on role permissions
        """
        
        if role == 'MANAGER':
            # Manager dapat melihat SEMUA delivery data
            return data
        
        elif role == 'DRIVER':
            # Driver hanya dapat melihat delivery yang di-assign ke mereka
            filtered = [record for record in data 
                       if record['assigned_driver'] == current_user]
            return filtered
        
        elif role == 'ADMIN':
            # Admin dapat melihat semua
            return data
        
        else:
            # Default: no access
            return []
    
    @staticmethod
    def apply_column_filter(data: pd.DataFrame, role: str) -> pd.DataFrame:
        """
        Apply column-level filtering (sensitive columns)
        """
        permissions = RBACPermissions.get_permissions(role)
        allowed_columns = permissions.get('columns_access', [])
        
        # Hanya ambil kolom yang diizinkan untuk role tersebut
        available_columns = [col for col in allowed_columns if col in data.columns]
        return data[available_columns]

# ============================================================================
# 4. DEMONSTRATION SCENARIOS
# ============================================================================

def demonstrate_rbac():
    """Mendemonstrasikan RBAC dan row-level access control"""
    
    db = DeliveryDatabase()
    data = pd.DataFrame(db.deliveries)
    
    print("=" * 100)
    print("DATABRICKS RBAC & ROW-LEVEL ACCESS CONTROL DEMONSTRATION")
    print("Learning Objective: LO3 - Role-Based Access Control (20 points)")
    print("=" * 100)
    print()
    
    # ========================================================================
    # SCENARIO 1: MANAGER ROLE
    # ========================================================================
    print("\n" + "=" * 100)
    print("SCENARIO 1: MANAGER ROLE - FULL ACCESS")
    print("=" * 100)
    print()
    
    manager_user = "manager_1@company.com"
    manager_role = "MANAGER"
    
    print(f"👤 User: {manager_user}")
    print(f"🔐 Role: {manager_role}")
    print(f"⚙️  Permissions: {json.dumps(RBACPermissions.get_permissions(manager_role), indent=2)}")
    print()
    
    # Apply row-level filtering
    manager_data = RowLevelAccessControl.apply_row_filter(
        db.deliveries, manager_role, manager_user
    )
    
    # Convert to DataFrame dan apply column filtering
    manager_df = pd.DataFrame(manager_data)
    manager_df = RowLevelAccessControl.apply_column_filter(manager_df, manager_role)
    
    print("📊 QUERY RESULT untuk MANAGER:")
    print(manager_df.to_string(index=False))
    print()
    print(f"✅ Total Records Accessible: {len(manager_df)} dari {len(data)}")
    print()
    
    # Analysis
    print("📈 Manager Data Analysis:")
    print(f"  • Deliveries by Status: \n{manager_df['status'].value_counts().to_string()}")
    print(f"  • Deliveries by Region: \n{manager_df['region'].value_counts().to_string()}")
    print(f"  • Total Salary Cost: Rp {manager_df['salary'].sum():,.0f}")
    print()
    
    # ========================================================================
    # SCENARIO 2: DRIVER ROLE (Andi)
    # ========================================================================
    print("\n" + "=" * 100)
    print("SCENARIO 2A: DRIVER ROLE - ROW-LEVEL ACCESS (Driver: Andi)")
    print("=" * 100)
    print()
    
    driver_andi = "Andi"
    driver_role = "DRIVER"
    
    print(f"👤 User: {driver_andi}")
    print(f"🔐 Role: {driver_role}")
    print(f"⚙️  Permissions: {json.dumps(RBACPermissions.get_permissions(driver_role), indent=2)}")
    print()
    
    # Apply row-level filtering untuk Andi
    andi_data = RowLevelAccessControl.apply_row_filter(
        db.deliveries, driver_role, driver_andi
    )
    
    andi_df = pd.DataFrame(andi_data)
    andi_df = RowLevelAccessControl.apply_column_filter(andi_df, driver_role)
    
    print("📊 QUERY RESULT untuk DRIVER (Andi):")
    print(andi_df.to_string(index=False))
    print()
    print(f"✅ Total Records Accessible: {len(andi_df)} dari {len(data)}")
    print("⚠️  SENSITIVE COLUMNS BLOCKED: assigned_driver, salary")
    print()
    
    # ========================================================================
    # SCENARIO 3: DRIVER ROLE (Budi)
    # ========================================================================
    print("\n" + "=" * 100)
    print("SCENARIO 2B: DRIVER ROLE - ROW-LEVEL ACCESS (Driver: Budi)")
    print("=" * 100)
    print()
    
    driver_budi = "Budi"
    
    print(f"👤 User: {driver_budi}")
    print(f"🔐 Role: {driver_role}")
    print()
    
    budi_data = RowLevelAccessControl.apply_row_filter(
        db.deliveries, driver_role, driver_budi
    )
    
    budi_df = pd.DataFrame(budi_data)
    budi_df = RowLevelAccessControl.apply_column_filter(budi_df, driver_role)
    
    print("📊 QUERY RESULT untuk DRIVER (Budi):")
    print(budi_df.to_string(index=False))
    print()
    print(f"✅ Total Records Accessible: {len(budi_df)} dari {len(data)}")
    print()
    
    # ========================================================================
    # COMPARISON: Differences in Access
    # ========================================================================
    print("\n" + "=" * 100)
    print("SCENARIO 3: COMPARISON - PERBEDAAN AKSES ANTAR ROLE")
    print("=" * 100)
    print()
    
    comparison_data = {
        'Role': ['MANAGER', 'DRIVER (Andi)', 'DRIVER (Budi)'],
        'Total Visible Records': [len(manager_df), len(andi_df), len(budi_df)],
        'Can View Salary': [True, False, False],
        'Can View All Regions': [True, False, False],
        'Can Edit Status': [True, False, False],
        'Visible Columns': [
            len(RBACPermissions.get_permissions('MANAGER')['columns_access']),
            len(RBACPermissions.get_permissions('DRIVER')['columns_access']),
            len(RBACPermissions.get_permissions('DRIVER')['columns_access'])
        ]
    }
    
    comparison_df = pd.DataFrame(comparison_data)
    print("📊 RBAC Comparison Matrix:")
    print(comparison_df.to_string(index=False))
    print()
    
    # ========================================================================
    # DETAILED COMPARISON: Data Visibility
    # ========================================================================
    print("\n" + "=" * 100)
    print("SCENARIO 4: DETAILED DATA VISIBILITY FOR SAME DRIVER")
    print("=" * 100)
    print()
    
    print("🔍 Deliveries assigned to ANDI:")
    print()
    print("FROM MANAGER VIEW (dapat melihat field: salary):")
    manager_andi_view = manager_df[manager_df['driver_name'] == 'Andi']
    print(manager_andi_view.to_string(index=False))
    print()
    
    print("FROM DRIVER VIEW (Andi tidak bisa melihat field: salary):")
    print(andi_df[['delivery_id', 'region', 'driver_name', 'status']].to_string(index=False))
    print()
    
    # ========================================================================
    # SQL QUERIES EQUIVALENT
    # ========================================================================
    print("\n" + "=" * 100)
    print("SQL QUERIES EQUIVALENT DI DATABRICKS")
    print("=" * 100)
    print()
    
    print("1️⃣  MANAGER QUERY (Full Access):")
    print("""
    SELECT delivery_id, region, driver_name, status, assigned_driver, salary
    FROM delivery_system.rbac_demo.deliveries
    WHERE 1=1;  -- No filtering, manager dapat lihat semua
    """)
    
    print("2️⃣  DRIVER QUERY (Row-Level Filtering - Andi):")
    print("""
    SELECT delivery_id, region, driver_name, status
    FROM delivery_system.rbac_demo.deliveries
    WHERE assigned_driver = 'Andi'
    AND CURRENT_USER() = 'Andi';
    """)
    
    print("3️⃣  USING ROW-LEVEL SECURITY (Dynamic Filter):")
    print("""
    SELECT delivery_id, region, driver_name, status
    FROM delivery_system.rbac_demo.deliveries_secure
    WHERE assigned_driver = CURRENT_USER()
    AND access_level = 'driver';
    """)
    
    # ========================================================================
    # SECURITY AUDIT LOG
    # ========================================================================
    print("\n" + "=" * 100)
    print("SECURITY AUDIT - Access Attempts Log")
    print("=" * 100)
    print()
    
    audit_log = [
        {
            'timestamp': datetime.now().isoformat(),
            'user': 'manager_1@company.com',
            'role': 'MANAGER',
            'action': 'VIEW_DATA',
            'records_accessed': len(manager_df),
            'sensitive_columns_accessed': 'salary',
            'status': '✅ ALLOWED'
        },
        {
            'timestamp': datetime.now().isoformat(),
            'user': 'Andi',
            'role': 'DRIVER',
            'action': 'VIEW_DATA',
            'records_accessed': len(andi_df),
            'sensitive_columns_accessed': 'salary (BLOCKED)',
            'status': '✅ ALLOWED - Limited Access'
        },
        {
            'timestamp': datetime.now().isoformat(),
            'user': 'Andi',
            'role': 'DRIVER',
            'action': 'VIEW_DATA_OTHER_DRIVER',
            'records_accessed': 0,
            'sensitive_columns_accessed': 'N/A',
            'status': '❌ DENIED - No access to other drivers data'
        },
    ]
    
    audit_df = pd.DataFrame(audit_log)
    print(audit_df.to_string(index=False))
    print()
    
    # ========================================================================
    # SUMMARY & KEY LEARNINGS
    # ========================================================================
    print("\n" + "=" * 100)
    print("🎓 KEY LEARNINGS - LO3: Role-Based Access Control")
    print("=" * 100)
    print()
    
    print("""
    1. ROW-LEVEL ACCESS CONTROL (Row Filtering):
       ✓ Manager: Dapat melihat SEMUA delivery dari semua driver
       ✓ Driver: Hanya dapat melihat delivery yang di-assign ke mereka
       ✓ Impact: Andi hanya lihat 3 deliveries, Budi hanya lihat 2 deliveries
    
    2. COLUMN-LEVEL ACCESS CONTROL (Column Masking):
       ✓ Manager: Dapat melihat semua columns (termasuk salary)
       ✓ Driver: Tidak dapat melihat sensitive columns (salary, assigned_driver)
       ✓ Impact: Informasi gaji tidak terekspos ke driver
    
    3. DYNAMIC FILTERING BASED ON CURRENT_USER():
       ✓ Filter otomatis berdasarkan user yang sedang login
       ✓ Tidak perlu hard-code nama user di setiap query
       ✓ Lebih aman dan scalable
    
    4. PERMISSION MATRIX:
       ✓ Setiap role memiliki set permissions yang jelas
       ✓ Central management dari access control
       ✓ Mudah untuk audit dan compliance
    
    5. SECURITY BENEFITS:
       ✓ Data isolation antar user/driver
       ✓ Sensitive data protection (salary masking)
       ✓ Compliance dengan data privacy regulations
       ✓ Audit trail untuk tracking akses
    """)
    
    print()
    print("=" * 100)


# ============================================================================
# RUN DEMONSTRATION
# ============================================================================

if __name__ == "__main__":
    demonstrate_rbac()
