export interface DDLTemplate {
  id: string;
  name: string;
  dialect: string;
  sql: string;
}

export const DDL_TEMPLATES: DDLTemplate[] = [
  {
    id: "blog",
    name: "📝 Blog Sederhana (3 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 1: Simple Blog System
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  comment_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    id: "ecommerce",
    name: "🛒 Sistem E-Commerce (6 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 2: E-Commerce System
CREATE TABLE customers (
  id INT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20)
);

CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id INT REFERENCES categories(id)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payments (
  id INT PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  payment_method VARCHAR(50),
  status VARCHAR(20)
);`
  },
  {
    id: "hr",
    name: "👥 Manajemen SDM / HR (9 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 3: HR Management System
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE jobs (
  id INT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  min_salary DECIMAL(10,2)
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  department_id INT REFERENCES departments(id),
  job_id INT REFERENCES jobs(id)
);

CREATE TABLE salaries (
  id INT PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL
);

CREATE TABLE attendances (
  id INT PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  date DATE NOT NULL,
  status VARCHAR(20)
);

CREATE TABLE leave_requests (
  id INT PRIMARY KEY,
  employee_id INT REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20)
);

CREATE TABLE projects (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  budget DECIMAL(12,2)
);

CREATE TABLE employee_projects (
  employee_id INT REFERENCES employees(id),
  project_id INT REFERENCES projects(id),
  role VARCHAR(50),
  PRIMARY KEY (employee_id, project_id)
);

CREATE TABLE branches (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT
);`
  },
  {
    id: "academic",
    name: "🏫 Akademik / Sekolah (7 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 4: Academic / School System
CREATE TABLE teachers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100)
);

CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dob DATE
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  teacher_id INT REFERENCES teachers(id)
);

CREATE TABLE classes (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  academic_year VARCHAR(20)
);

CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  class_id INT REFERENCES classes(id),
  enroll_date DATE,
  PRIMARY KEY (student_id, class_id)
);

CREATE TABLE grades (
  id INT PRIMARY KEY,
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  score INT NOT NULL
);

CREATE TABLE parents (
  id INT PRIMARY KEY,
  student_id INT REFERENCES students(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20)
);`
  },
  {
    id: "social",
    name: "💬 Jejaring Sosial (8 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 5: Social Media Network
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE profiles (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(255)
);

CREATE TABLE friend_requests (
  id INT PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  status VARCHAR(20)
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT REFERENCES posts(id),
  user_id INT REFERENCES users(id),
  content TEXT NOT NULL
);

CREATE TABLE likes (
  user_id INT REFERENCES users(id),
  post_id INT REFERENCES posts(id),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE messages (
  id INT PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  content TEXT NOT NULL
);

CREATE TABLE groups (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);`
  },
  {
    id: "saas",
    name: "🚀 SaaS Billing & Subscription (6 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 6: SaaS Billing & Subscription
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  owner_email VARCHAR(100) UNIQUE
);

CREATE TABLE billing_plans (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL
);

CREATE TABLE subscriptions (
  id INT PRIMARY KEY,
  account_id INT REFERENCES accounts(id),
  plan_id INT REFERENCES billing_plans(id),
  status VARCHAR(20)
);

CREATE TABLE invoices (
  id INT PRIMARY KEY,
  subscription_id INT REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE
);

CREATE TABLE usage_logs (
  id INT PRIMARY KEY,
  account_id INT REFERENCES accounts(id),
  resource_type VARCHAR(50) NOT NULL,
  quantity_used INT NOT NULL
);

CREATE TABLE coupons (
  code VARCHAR(20) PRIMARY KEY,
  discount_percent INT NOT NULL,
  expiry_date DATE
);`
  },
  {
    id: "booking",
    name: "🎟️ Pemesanan Tiket Bioskop (8 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 7: Ticket Booking System
CREATE TABLE theaters (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50)
);

CREATE TABLE movies (
  id INT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  duration INT
);

CREATE TABLE showtimes (
  id INT PRIMARY KEY,
  theater_id INT REFERENCES theaters(id),
  movie_id INT REFERENCES movies(id),
  start_time TIMESTAMP NOT NULL
);

CREATE TABLE seats (
  id INT PRIMARY KEY,
  theater_id INT REFERENCES theaters(id),
  row_num VARCHAR(5) NOT NULL,
  col_num INT NOT NULL
);

CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

CREATE TABLE bookings (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  showtime_id INT REFERENCES showtimes(id),
  booking_date TIMESTAMP
);

CREATE TABLE tickets (
  id INT PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  seat_id INT REFERENCES seats(id)
);

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  movie_id INT REFERENCES movies(id),
  customer_id INT REFERENCES customers(id),
  rating INT,
  comment TEXT
);`
  },
  {
    id: "warehouse",
    name: "📦 Gudang & Inventaris (7 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 8: Warehouse Inventory
CREATE TABLE suppliers (
  id INT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50)
);

CREATE TABLE warehouses (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE items (
  id INT PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE stock_levels (
  warehouse_id INT REFERENCES warehouses(id),
  item_id INT REFERENCES items(id),
  quantity_on_hand INT NOT NULL,
  PRIMARY KEY (warehouse_id, item_id)
);

CREATE TABLE stock_movements (
  id INT PRIMARY KEY,
  item_id INT REFERENCES items(id),
  source_warehouse_id INT REFERENCES warehouses(id),
  dest_warehouse_id INT REFERENCES warehouses(id),
  quantity INT NOT NULL
);

CREATE TABLE dispatch_orders (
  id INT PRIMARY KEY,
  warehouse_id INT REFERENCES warehouses(id),
  dispatch_date DATE,
  status VARCHAR(20)
);

CREATE TABLE inventory_audits (
  id INT PRIMARY KEY,
  warehouse_id INT REFERENCES warehouses(id),
  audit_date DATE,
  auditor_name VARCHAR(100)
);`
  },
  {
    id: "library",
    name: "📚 Manajemen Perpustakaan (6 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 9: Library Management
CREATE TABLE authors (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT
);

CREATE TABLE genres (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE books (
  id INT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author_id INT REFERENCES authors(id),
  genre_id INT REFERENCES genres(id)
);

CREATE TABLE members (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  membership_date DATE
);

CREATE TABLE loans (
  id INT PRIMARY KEY,
  book_id INT REFERENCES books(id),
  member_id INT REFERENCES members(id),
  loan_date DATE NOT NULL,
  return_date DATE
);

CREATE TABLE fines (
  id INT PRIMARY KEY,
  loan_id INT REFERENCES loans(id),
  amount DECIMAL(8,2) NOT NULL,
  status VARCHAR(20)
);`
  },
  {
    id: "hospital",
    name: "🏥 Sistem Layanan RS / Hospital (10 Tabel)",
    dialect: "postgresql",
    sql: `-- Template 10: Hospital Management System
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE doctors (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  department_id INT REFERENCES departments(id)
);

CREATE TABLE patients (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dob DATE,
  gender VARCHAR(10)
);

CREATE TABLE appointments (
  id INT PRIMARY KEY,
  patient_id INT REFERENCES patients(id),
  doctor_id INT REFERENCES doctors(id),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(20)
);

CREATE TABLE medical_records (
  id INT PRIMARY KEY,
  patient_id INT REFERENCES patients(id),
  doctor_id INT REFERENCES doctors(id),
  diagnosis TEXT,
  record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
  id INT PRIMARY KEY,
  medical_record_id INT REFERENCES medical_records(id) ON DELETE CASCADE,
  issued_date DATE
);

CREATE TABLE medicines (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50)
);

CREATE TABLE prescription_items (
  prescription_id INT REFERENCES prescriptions(id),
  medicine_id INT REFERENCES medicines(id),
  dosage VARCHAR(50),
  PRIMARY KEY (prescription_id, medicine_id)
);

CREATE TABLE billings (
  id INT PRIMARY KEY,
  patient_id INT REFERENCES patients(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20)
);

CREATE TABLE wards (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INT
);`
  }
];
