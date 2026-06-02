# Sample Output

This file shows the kind of Markdown documentation MSF_DB should generate from SQL schema input.

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

## Overview

This schema contains customer master data and order transaction data.

## Tables

### customers

Stores customer master data.

| Column | Type | Notes |
| --- | --- | --- |
| customer_id | INT | Primary key |
| customer_name | VARCHAR(100) | Customer display name |
| segment | VARCHAR(50) | Business segment |

### orders

Stores customer order transactions.

| Column | Type | Notes |
| --- | --- | --- |
| order_id | INT | Primary key |
| customer_id | INT | Foreign key to customers.customer_id |
| order_date | DATE | Order date |
| total_amount | DECIMAL(12,2) | Order total |

## Relationships

- `orders.customer_id` references `customers.customer_id`

## Documentation Notes

- The relationship is one customer to many orders.
- The generated output should be reviewed before publishing.
```

## Output Goals

A good DBDocs Gen result should include:

- a short schema summary
- table-level descriptions
- column-level notes
- relationship summary
- any safety or governance warnings
- a format that is easy to export to Markdown or PDF
