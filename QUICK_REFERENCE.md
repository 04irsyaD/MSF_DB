# Data Cleaning Pipeline - QUICK REFERENCE

## 🎯 3 Langkah Utama

### 1️⃣ Analyze Data Issues
```python
from databricks_data_cleaner import DatabricksDataCleaner

cleaner = DatabricksDataCleaner("catalog", "schema", "table")
df = cleaner.read_data()
cleaner.analyze_column_types()
cleaner.detect_inconsistent_dates()
cleaner.detect_numeric_inconsistencies()
cleaner.display_data_quality_report()
```

### 2️⃣ Clean Data
```python
# Option A: Date Inconsistencies
from date_format_handler import DateFormatAnalyzer
analyzer = DateFormatAnalyzer()
df, report = analyzer.standardize_date_column(df, 'date_column')

# Option B: Remove Duplicates
from advanced_data_cleaner import AdvancedDataCleaner
df, count = AdvancedDataCleaner.remove_duplicates(df)

# Option C: Standardize Text/Email
df = AdvancedDataCleaner.standardize_email(df, ['email_col'])
df = AdvancedDataCleaner.standardize_text_case(df, ['text_col'], case_type='title')

# Option D: Handle Missing Values
fill_strategy = {'col1': 'mean', 'col2': 'forward_fill'}
df = AdvancedDataCleaner.fill_missing_values(df, fill_strategy)
```

### 3️⃣ Save & Export
```python
cleaner.df = df
cleaner.save_cleaned_data('./output/cleaned.csv', format='csv')
# format options: 'csv', 'parquet', 'excel'
```

---

## 📋 Cheat Sheet - Common Tasks

### ❌ Detect Issues
```python
# Date format inconsistencies
cleaner.detect_inconsistent_dates()

# Numeric inconsistencies (mixed with strings)
cleaner.detect_numeric_inconsistencies()

# Column type overview
cleaner.analyze_column_types()

# Outliers
outliers = AdvancedDataCleaner.detect_outliers(df, ['col1', 'col2'])

# Missing values
df.isnull().sum()
```

### ✅ Fix Issues

#### Date Problems
```python
# Find date columns
from date_format_handler import DateFormatAnalyzer
analyzer = DateFormatAnalyzer()
date_cols = analyzer.find_date_columns(df)

# Analyze single column
analysis = analyzer.analyze_date_column(df, 'date_col')

# Standardize
df, report = analyzer.standardize_date_column(df, 'date_col', target_format='%Y-%m-%d')
```

#### Text Problems
```python
# Standardize email
df = AdvancedDataCleaner.standardize_email(df, ['email'])

# Standardize phone
df = AdvancedDataCleaner.standardize_phone_numbers(df, ['phone'])

# Standardize case
df = AdvancedDataCleaner.standardize_text_case(df, ['col1', 'col2'], case_type='title')
# case_type: 'title', 'lower', 'upper'
```

#### Numeric Problems
```python
# Standardize numeric columns
df = AdvancedDataCleaner.standardize_numerics(df, ['price', 'quantity'])
```

#### Duplicates & Missing Values
```python
# Remove duplicates
df, removed_count = AdvancedDataCleaner.remove_duplicates(df)

# Fill missing values
strategy = {'col1': 'mean', 'col2': 'median', 'col3': 'forward_fill'}
df = AdvancedDataCleaner.fill_missing_values(df, strategy)
# methods: 'forward_fill', 'backward_fill', 'mean', 'median', 'mode'
```

---

## 📊 Date Format Reference

| Format | Example | Python Format |
|--------|---------|--------|
| YYYY-MM-DD | 2024-01-15 | `%Y-%m-%d` |
| DD-MM-YYYY | 15-01-2024 | `%d-%m-%Y` |
| MM-DD-YYYY | 01-15-2024 | `%m-%d-%Y` |
| YYYY/MM/DD | 2024/01/15 | `%Y/%m/%d` |
| DD/MM/YYYY | 15/01/2024 | `%d/%m/%Y` |
| YYYY-MM-DD HH:MM:SS | 2024-01-15 14:30:45 | `%Y-%m-%d %H:%M:%S` |
| DD-MM-YYYY HH:MM:SS | 15-01-2024 14:30:45 | `%d-%m-%Y %H:%M:%S` |

---

## 🎯 Use Case Scenarios

### Scenario A: Quick Analysis Only
```python
from usage_guide import scenario_1_basic_analysis
scenario_1_basic_analysis()
```

### Scenario B: Complete Cleaning
```python
from usage_guide import scenario_2_complete_cleaning
df_clean = scenario_2_complete_cleaning()
```

### Scenario C: Focus on Dates
```python
from usage_guide import scenario_3_focused_date_cleaning
df_clean = scenario_3_focused_date_cleaning()
```

### Scenario D: Quality Report
```python
from usage_guide import scenario_4_advanced_quality_report
scenario_4_advanced_quality_report()
```

### Scenario E: Export Data
```python
from usage_guide import scenario_5_export_cleaned_data
scenario_5_export_cleaned_data()
```

---

## 🔧 Full Example - Step by Step

```python
from databricks_data_cleaner import DatabricksDataCleaner
from advanced_data_cleaner import AdvancedDataCleaner
from date_format_handler import DateFormatAnalyzer

# ===== STEP 1: Read Data =====
cleaner = DatabricksDataCleaner("teamassgement", "cleandata_electronis", "retail_electronics_sample_150_k")
df = cleaner.read_data()
print(f"Loaded {len(df)} rows")

# ===== STEP 2: Analyze =====
cleaner.analyze_column_types()
date_issues = cleaner.detect_inconsistent_dates()
numeric_issues = cleaner.detect_numeric_inconsistencies()
cleaner.display_data_quality_report()

# ===== STEP 3: Clean =====

# 3a. Fix date inconsistencies
analyzer = DateFormatAnalyzer()
for col in analyzer.find_date_columns(df):
    df, _ = analyzer.standardize_date_column(df, col, target_format='%Y-%m-%d')

# 3b. Remove duplicates
df, removed = AdvancedDataCleaner.remove_duplicates(df)
print(f"Removed {removed} duplicates")

# 3c. Standardize text
df = AdvancedDataCleaner.standardize_email(df, ['email'])
df = AdvancedDataCleaner.standardize_text_case(df, ['product_name'], case_type='title')

# 3d. Detect outliers
outliers = AdvancedDataCleaner.detect_outliers(df, ['price', 'quantity'])
print(f"Found outliers: {outliers}")

# ===== STEP 4: Validate =====
validation = AdvancedDataCleaner.validate_data_types(df, {
    'id': 'int',
    'email': 'str',
    'price': 'float'
})

# ===== STEP 5: Export =====
cleaner.df = df
cleaner.save_cleaned_data('./output/cleaned_retail.csv', format='csv')
print("✅ Done!")
```

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Date format not detected | Try adding to `COMMON_DATE_FORMATS` in `date_format_handler.py` |
| "Column not found" | Check column name (case-sensitive) |
| Databricks connection error | Verify credentials configured |
| Too many failed parses | Use `hint_format` parameter or manually clean subset |
| Memory error with large data | Use `.sample()` untuk test dulu, atau increase available memory |

---

## 📚 File Dependencies

```
databricks_data_cleaner.py (Main)
    ↓
├── advanced_data_cleaner.py (Clean operations)
├── date_format_handler.py (Date operations)
└── usage_guide.py (Examples)
```

---

## 💡 Pro Tips

1. **Always start with analysis** sebelum cleaning
2. **Save original data** sebelum modifikasi besar
3. **Use `sample()` untuk testing** pada dataset besar
4. **Check problematic_values** untuk understand edge cases
5. **Validate after standardization** untuk ensure quality

---

## 📄 Files Summary

| File | Purpose |
|------|---------|
| `databricks_data_cleaner.py` | Read & analyze data from Databricks |
| `advanced_data_cleaner.py` | Text, numeric, duplicate, missing value cleaning |
| `date_format_handler.py` | Date format detection & standardization |
| `usage_guide.py` | 5 ready-to-use scenarios |
| `DATA_CLEANING_README.md` | Full documentation |
| `QUICK_REFERENCE.md` | This file |

---

**Start with:** `usage_guide.py` → Pick a scenario → Run it! 🚀
