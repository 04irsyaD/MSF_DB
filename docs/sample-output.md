# Sample Output

This file shows the kind of Markdown documentation MSF_DB should generate from SQL DDL.

## Example Input

```sql
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  segment VARCHAR(50)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  total_amount DECIMAL(12,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

## Example Output

```md
# Database Documentation

## Table: customers
Purpose: Stores customer master data.

### Columns
| Column | Type | Description |
|---|---|---|
| customer_id | INT | Unique customer identifier |
| customer_name | VARCHAR(100) | Customer full name |
| segment | VARCHAR(50) | Customer business segment |

## Table: orders
Purpose: Stores customer order transactions.

### Relationships
- orders.customer_id references customers.customer_id
```
