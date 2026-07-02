# Data Cleaning & Standardization Pipeline

Complete Python solution untuk **analyze, detect, dan clean data inconsistencies** dari Databricks.

## 📋 Daftar Files

### 1. **databricks_data_cleaner.py**
Main script untuk read data dari Databricks dan analyze quality.

**Fitur:**
- ✅ Koneksi ke Databricks table
- ✅ Analyze column types dan statistics
- ✅ Detect date format inconsistencies
- ✅ Detect numeric inconsistencies
- ✅ Generate data quality report
- ✅ Standardisir date columns
- ✅ Save cleaned data (CSV, Parquet, Excel)

**Class Utama:**

```python
DatabricksDataCleaner(catalog, schema, table)
```

**Method:**
- `read_data()` - Baca data dari Databricks
- `analyze_column_types()` - Analyze tipe data setiap column
- `detect_inconsistent_dates()` - Detect date format yang berbeda
- `detect_numeric_inconsistencies()` - Detect numeric values yang mixed dengan string
- `display_data_quality_report()` - Print report
- `standardize_dates(columns, format)` - Standardisir date columns
- `standardize_numerics(columns)` - Standardisir numeric columns
- `save_cleaned_data(path, format)` - Export data

**Contoh Penggunaan:**

```python
from databricks_data_cleaner import DatabricksDataCleaner

# Initialize
cleaner = DatabricksDataCleaner(
    catalog="teamassgement",
    schema="cleandata_electronis", 
    table="retail_electronics_sample_150_k"
)

# Read & Analyze
df = cleaner.read_data()
cleaner.analyze_column_types()
cleaner.detect_inconsistent_dates()
cleaner.detect_numeric_inconsistencies()

# Display report
cleaner.display_data_quality_report()

# Standardize & Save
df_clean = cleaner.standardize_dates(['created_date', 'updated_date'])
cleaner.df = df_clean
cleaner.save_cleaned_data('./output/cleaned_data.csv', format='csv')
```

---

### 2. **advanced_data_cleaner.py**
Advanced cleaning techniques untuk specific data quality issues.

**Fitur:**
- ✅ Standardisir phone numbers
- ✅ Standardisir email (lowercase, trim)
- ✅ Standardisir text case (title, lower, upper)
- ✅ Detect outliers (IQR, Z-score methods)
- ✅ Remove duplicates
- ✅ Fill missing values (forward fill, backward fill, mean, median, mode)
- ✅ Validate data types

**Static Methods:**

```python
AdvancedDataCleaner.standardize_phone_numbers()
AdvancedDataCleaner.standardize_email()
AdvancedDataCleaner.standardize_text_case()
AdvancedDataCleaner.detect_outliers()
AdvancedDataCleaner.remove_duplicates()
AdvancedDataCleaner.fill_missing_values()
AdvancedDataCleaner.validate_data_types()
```

**Contoh Penggunaan:**

```python
from advanced_data_cleaner import AdvancedDataCleaner

# Remove duplicates
df_clean, removed_count = AdvancedDataCleaner.remove_duplicates(df)
print(f"Removed {removed_count} duplicate rows")

# Standardize emails
df_clean = AdvancedDataCleaner.standardize_email(df_clean, ['email', 'contact_email'])

# Standardize phone
df_clean = AdvancedDataCleaner.standardize_phone_numbers(df_clean, ['phone', 'mobile'])

# Standardize text case
df_clean = AdvancedDataCleaner.standardize_text_case(
    df_clean, 
    ['product_name', 'category'], 
    case_type='title'
)

# Detect outliers
outliers = AdvancedDataCleaner.detect_outliers(df_clean, ['price', 'quantity'])

# Fill missing values
fill_strategy = {
    'price': 'median',
    'description': 'mode',
    'quantity': 'forward_fill'
}
df_clean = AdvancedDataCleaner.fill_missing_values(df_clean, fill_strategy)

# Validate data types
expected_types = {
    'id': 'int',
    'email': 'str',
    'price': 'float',
    'is_active': 'bool'
}
validation_result = AdvancedDataCleaner.validate_data_types(df_clean, expected_types)
```

---

### 3. **date_format_handler.py**
Specialized module untuk detect dan fix date format inconsistencies.

**Fitur:**
- ✅ Detect date format dari string
- ✅ Analyze date column untuk format distribution
- ✅ Smart date parsing (coba multiple formats)
- ✅ Standardisir date column ke uniform format
- ✅ Auto-detect date columns dalam DataFrame
- ✅ Generate detail analysis reports

**Classes:**
1. `DateFormatAnalyzer` - Main class untuk date analysis
2. `DateAnalysisReporter` - Generate report dalam format readable

**Static Methods DateFormatAnalyzer:**

```python
detect_date_format()      # Detect format single date string
analyze_date_column()     # Analyze column untuk format distribution
parse_date_flexible()     # Parse date dengan flexibility
standardize_date_column() # Standardisir date column
find_date_columns()       # Auto-find date columns dalam DataFrame
```

**Contoh Penggunaan:**

```python
from date_format_handler import DateFormatAnalyzer, DateAnalysisReporter

# Detect format dari single values
fmt1 = DateFormatAnalyzer.detect_date_format('2024-01-15')  # YYYY-MM-DD
fmt2 = DateFormatAnalyzer.detect_date_format('15/01/2024')  # DD/MM/YYYY

# Analyze column
analyzer = DateFormatAnalyzer()
analysis = analyzer.analyze_date_column(df, 'created_date')

# Print report
DateAnalysisReporter.print_analysis_report(analysis)

# Standardize
df_clean, report = analyzer.standardize_date_column(
    df,
    'created_date',
    target_format='%Y-%m-%d'
)

# Print standardization report
DateAnalysisReporter.print_standardization_report(report)

# Auto-find date columns
date_cols = analyzer.find_date_columns(df, auto_detect=True)
```

---

### 4. **usage_guide.py**
Complete scenarios dan examples untuk menggunakan semua 3 modules.

**5 Built-in Scenarios:**

#### Scenario 1: Basic Analysis

```python
scenario_1_basic_analysis()
```

- Quick analysis tanpa modification
- Best untuk: Initial data exploration

#### Scenario 2: Complete Cleaning Pipeline

```python
scenario_2_complete_cleaning()
```

- Full cleaning pipeline dengan semua steps
- Best untuk: Production data cleaning

#### Scenario 3: Focused Date Cleaning

```python
scenario_3_focused_date_cleaning()
```

- Fokus pada date/time fields
- Best untuk: Database dengan banyak date format issues

#### Scenario 4: Advanced Quality Report

```python
scenario_4_advanced_quality_report()
```

- Comprehensive quality checks (duplicates, outliers, missing values)
- Best untuk: Data validation sebelum production

#### Scenario 5: Export Cleaned Data

```python
scenario_5_export_cleaned_data()
```

- Clean dan export ke berbagai format
- Best untuk: Final output untuk stakeholders

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
pip install pandas pyspark scipy
```

### Step 2: Set Up Databricks Connection
Pastikan sudah configure Databricks credentials di environment.

### Step 3: Run Analysis

```python
# Contoh sederhana
from databricks_data_cleaner import DatabricksDataCleaner

cleaner = DatabricksDataCleaner(
    catalog="teamassgement",
    schema="cleandata_electronis",
    table="retail_electronics_sample_150_k"
)

df = cleaner.read_data()
cleaner.analyze_column_types()
cleaner.detect_inconsistent_dates()
cleaner.display_data_quality_report()
```

---

## 📊 Supported Date Formats

Script automatic support untuk format-format ini:
- `YYYY-MM-DD` (2024-01-15)
- `DD-MM-YYYY` (15-01-2024)
- `MM-DD-YYYY` (01-15-2024)
- `YYYY/MM/DD` (2024/01/15)
- `DD/MM/YYYY` (15/01/2024)
- `MM/DD/YYYY` (01/15/2024)
- `YYYY-MM-DD HH:MM:SS` (2024-01-15 14:30:45)
- `DD-MM-YYYY HH:MM:SS` (15-01-2024 14:30:45)
- `YYYY.MM.DD` (2024.01.15)
- Dan lebih banyak format lainnya

---

## 🔧 Common Use Cases

### Use Case 1: Detect & Fix Date Inconsistencies

```python
from date_format_handler import DateFormatAnalyzer

analyzer = DateFormatAnalyzer()

# Auto-find date columns
date_columns = analyzer.find_date_columns(df)

# Standardize each one
for col in date_columns:
    df, report = analyzer.standardize_date_column(
        df, 
        col,
        target_format='%Y-%m-%d'
    )
    print(f"Successfully parsed: {report['successfully_parsed']}/{report['total_values']}")
```

### Use Case 2: Complete Data Cleanup

```python
from databricks_data_cleaner import DatabricksDataCleaner
from advanced_data_cleaner import AdvancedDataCleaner
from date_format_handler import DateFormatAnalyzer

# 1. Read dari Databricks
cleaner = DatabricksDataCleaner(catalog, schema, table)
df = cleaner.read_data()

# 2. Remove duplicates
df, _ = AdvancedDataCleaner.remove_duplicates(df)

# 3. Standardize dates
analyzer = DateFormatAnalyzer()
for col in analyzer.find_date_columns(df):
    df, _ = analyzer.standardize_date_column(df, col)

# 4. Standardize emails
df = AdvancedDataCleaner.standardize_email(df, ['email'])

# 5. Detect outliers
outliers = AdvancedDataCleaner.detect_outliers(df, ['price', 'quantity'])

# 6. Save
cleaner.df = df
cleaner.save_cleaned_data('./output/cleaned.csv')
```

### Use Case 3: Data Quality Validation

```python
from advanced_data_cleaner import AdvancedDataCleaner

# Check for duplicates
df_unique, removed = AdvancedDataCleaner.remove_duplicates(df)

# Validate data types
expected_types = {
    'id': 'int',
    'name': 'str',
    'price': 'float',
    'created_date': 'date'
}
results = AdvancedDataCleaner.validate_data_types(df, expected_types)

# Check for outliers
outliers = AdvancedDataCleaner.detect_outliers(
    df, 
    numeric_columns=['price'],
    method='iqr'
)
```

---

## 📈 Output Examples

### Data Quality Report

```
================================================================================
DATA QUALITY REPORT
================================================================================

📊 COLUMN TYPES & STATISTICS:
─────────────────────────────────────────────────────────────────────────────
  Column: created_date
    Type: object
    Non-Null: 1500 | Null: 0
    Unique values: 1450
    Sample: ['2024-01-15', '15/01/2024', '2024/01/20']

⚠️  DATE FORMAT ISSUES:
─────────────────────────────────────────────────────────────────────────────
  Column: created_date
    Inconsistent formats found: 3
    Examples: ['2024-01-15', '15/01/2024', '2024/01/20']

================================================================================
```

### Standardization Report

```
================================================================================
DATE STANDARDIZATION REPORT: created_date
================================================================================

📈 Standardization Results:
  Total values: 1500
  Successfully parsed: 1498
  Failed to parse: 2

✅ Successfully parsed:
  date format: %Y-%m-%d
  
================================================================================
```

---

## 🛠️ Troubleshooting

### Error: "Could not parse date"
**Solusi:**
- Check format yang tidak terdeteksi
- Tambah custom format ke `COMMON_DATE_FORMATS` di `date_format_handler.py`
- Gunakan parameter `hint_format` saat standardize

### Error: "Column not found"
**Solusi:**
- Verify column names ada di DataFrame
- Check case-sensitivity (column names bersifat case-sensitive)

### Databricks Connection Error
**Solusi:**
- Verify Databricks credentials configured
- Check catalog, schema, table names
- Ensure network access ke Databricks workspace

---

## 📝 Notes

- All timestamp columns automatically converted ke UTC
- Missing values represented sebagai `NaN` atau `None`
- Duplicate detection based pada semua columns kecuali specified
- Outlier detection default menggunakan IQR method

---

## 📧 Support

Untuk pertanyaan atau issues, silakan check:
1. Logs di console output
2. Parameter documentation di function docstrings
3. Examples di `usage_guide.py`

---

## 📄 License

MIT License - Feel free to use dan modify untuk kebutuhan project Anda.
