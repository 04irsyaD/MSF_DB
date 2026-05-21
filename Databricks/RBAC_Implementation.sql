-- ============================================================================
-- DATABRICKS RBAC & ROW-LEVEL ACCESS CONTROL IMPLEMENTATION
-- Data: rbac_delivery_data - Delivery Management System
-- Learning Objective: LO3 - Role-Based Access Control
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE CATALOG & SCHEMA
-- ============================================================================

CREATE CATALOG IF NOT EXISTS delivery_system;
CREATE SCHEMA IF NOT EXISTS delivery_system.rbac_demo;

-- ============================================================================
-- STEP 2: CREATE BASE TABLE (Delivery Data)
-- ============================================================================

CREATE TABLE IF NOT EXISTS delivery_system.rbac_demo.deliveries (
    delivery_id STRING,
    region STRING,
    driver_name STRING,
    delivery_status STRING,
    access_level STRING,
    assigned_driver STRING,  -- untuk row-level filtering
    created_date DATE
);

-- Insert sample data
INSERT INTO delivery_system.rbac_demo.deliveries VALUES
('D001', 'North', 'Budi', 'On Route', 'manager', 'Budi', '2025-01-15'),
('D002', 'South', 'Sari', 'Completed', 'manager', 'Sari', '2025-01-15'),
('D003', 'East', 'Andi', 'Delayed', 'driver', 'Andi', '2025-01-15'),
('D004', 'North', 'Rina', 'On Route', 'driver', 'Rina', '2025-01-15'),
('D005', 'West', 'Budi', 'Completed', 'manager', 'Budi', '2025-01-16'),
('D006', 'South', 'Andi', 'Pending', 'driver', 'Andi', '2025-01-16'),
('D007', 'Central', 'Sari', 'On Route', 'manager', 'Sari', '2025-01-16'),
('D008', 'North', 'Andi', 'Cancelled', 'driver', 'Andi', '2025-01-17');

-- ============================================================================
-- STEP 3: CREATE ROLE-BASED VIEWS
-- ============================================================================

-- VIEW 1: Manager View - Dapat melihat SEMUA data (full access)
CREATE OR REPLACE VIEW delivery_system.rbac_demo.deliveries_manager_view AS
SELECT 
    delivery_id,
    region,
    driver_name,
    delivery_status,
    access_level,
    assigned_driver,
    created_date,
    'MANAGER' as user_role
FROM delivery_system.rbac_demo.deliveries
WHERE 1=1;  -- No filtering for managers

-- VIEW 2: Driver View - Hanya melihat data delivery mereka sendiri (row-level access)
CREATE OR REPLACE VIEW delivery_system.rbac_demo.deliveries_driver_view AS
SELECT 
    delivery_id,
    region,
    driver_name,
    delivery_status,
    access_level,
    assigned_driver,
    created_date,
    'DRIVER' as user_role
FROM delivery_system.rbac_demo.deliveries
WHERE assigned_driver = CURRENT_USER() 
   OR access_level = 'public';

-- ============================================================================
-- STEP 4: CREATE DYNAMIC ROW-LEVEL FILTER
-- ============================================================================

-- Dynamic view yang filter berdasarkan role user
CREATE OR REPLACE VIEW delivery_system.rbac_demo.deliveries_secure AS
SELECT 
    delivery_id,
    region,
    driver_name,
    delivery_status,
    access_level,
    assigned_driver,
    created_date
FROM delivery_system.rbac_demo.deliveries d
WHERE 
    -- Manager dapat akses semua data
    (CURRENT_USER() LIKE '%manager%' OR CURRENT_USER() LIKE '%admin%')
    OR
    -- Driver hanya akses data mereka sendiri
    (access_level = 'driver' AND assigned_driver = CURRENT_USER())
    OR
    -- Semua bisa akses data public
    (access_level = 'public');

-- ============================================================================
-- STEP 5: CREATE ROLE & USER SIMULATION
-- ============================================================================

-- Simulasi role (dalam Databricks actual, gunakan workspace admin)
-- Role 1: Manager Role
CREATE ROLE IF NOT EXISTS manager_role;
GRANT SELECT ON TABLE delivery_system.rbac_demo.deliveries_manager_view TO manager_role;
GRANT SELECT ON TABLE delivery_system.rbac_demo.deliveries TO manager_role;

-- Role 2: Driver Role  
CREATE ROLE IF NOT EXISTS driver_role;
GRANT SELECT ON VIEW delivery_system.rbac_demo.deliveries_driver_view TO driver_role;

-- ============================================================================
-- STEP 6: CREATE DYNAMIC FUNCTION FOR ROLE CHECKING
-- ============================================================================

CREATE OR REPLACE FUNCTION delivery_system.rbac_demo.get_user_role()
RETURNS STRING
AS $$
  SELECT CASE 
    WHEN CURRENT_USER() LIKE '%manager%' THEN 'MANAGER'
    WHEN CURRENT_USER() LIKE '%andi%' THEN 'DRIVER'
    WHEN CURRENT_USER() LIKE '%budi%' THEN 'DRIVER'
    WHEN CURRENT_USER() LIKE '%sari%' THEN 'DRIVER'
    WHEN CURRENT_USER() LIKE '%rina%' THEN 'DRIVER'
    ELSE 'UNKNOWN'
  END;
$$;

-- ============================================================================
-- STEP 7: CREATE COMPREHENSIVE RBAC TABLE WITH METADATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS delivery_system.rbac_demo.role_permissions (
    role_id STRING,
    role_name STRING,
    permission_type STRING,
    can_view_all_regions BOOLEAN,
    can_view_own_deliveries BOOLEAN,
    can_edit_status BOOLEAN,
    can_view_driver_contact BOOLEAN,
    can_view_salary BOOLEAN,
    description STRING
);

INSERT INTO delivery_system.rbac_demo.role_permissions VALUES
('R001', 'MANAGER', 'READ', true, true, true, true, true, 'Manager dapat melihat dan mengedit semua data'),
('R002', 'DRIVER', 'READ', false, true, false, false, false, 'Driver hanya dapat melihat delivery mereka sendiri'),
('R003', 'ADMIN', 'FULL', true, true, true, true, true, 'Admin memiliki akses penuh'),
('R004', 'VIEWER', 'READ', true, false, false, false, false, 'Viewer hanya dapat melihat summary data');

-- ============================================================================
-- DISPLAY STRUCTURE
-- ============================================================================

SELECT * FROM delivery_system.rbac_demo.deliveries LIMIT 5;
SELECT * FROM delivery_system.rbac_demo.role_permissions;
