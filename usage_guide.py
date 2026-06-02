"""
USAGE GUIDE - Data Cleaning Pipeline
====================================

Panduan lengkap untuk menggunakan semua script:
1. databricks_data_cleaner.py
2. advanced_data_cleaner.py  
3. date_format_handler.py
"""

import pandas as pd
from databricks_data_cleaner import DatabricksDataCleaner
from advanced_data_cleaner import AdvancedDataCleaner
from date_format_handler import DateFormatAnalyzer, DateAnalysisReporter


# ============================================================================
# SCENARIO 1: Basic Analysis
# ============================================================================

def scenario_1_basic_analysis():
    """
    Scenario 1: Basic analysis dari Databricks table
    - Connect ke Databricks
    - Analyze column types
    - Detect issues (date, numeric)
    - Display report
    """
    print("\n" + "="*80)
    print("SCENARIO 1: BASIC ANALYSIS")
    print("="*80 + "\n")
    
    # Initialize
    cleaner = DatabricksDataCleaner(
        catalog="teamassgement",
        schema="cleandata_electronis",
        table="retail_electronics_sample_150_k"
    )
    
    # Read data
    df = cleaner.read_data()
    
    # Analyze
    cleaner.analyze_column_types()
    cleaner.detect_inconsistent_dates()
    cleaner.detect_numeric_inconsistencies()
    
    # Display report
    cleaner.display_data_quality_report()


# ============================================================================
# SCENARIO 2: Complete Data Cleaning Pipeline
# ============================================================================

def scenario_2_complete_cleaning():
    """
    Scenario 2: Complete cleaning pipeline
    - Detect dan clean date inconsistencies
    - Remove duplicates
    - Standardize text
    - Handle missing values
    - Validate final data
    """
    print("\n" + "="*80)
    print("SCENARIO 2: COMPLETE CLEANING PIPELINE")
    print("="*80 + "\n")
    
    # Step 1: Read data dari Databricks
    cleaner = DatabricksDataCleaner(
        catalog="teamassgement",
        schema="cleandata_electronis",
        table="retail_electronics_sample_150_k"
    )
    df = cleaner.read_data()
    
    # Step 2: Find date columns
    date_analyzer = DateFormatAnalyzer()
    date_columns = date_analyzer.find_date_columns(df, auto_detect=True)
    print(f"\n🔍 Found date columns: {date_columns}\n")
    
    # Step 3: Analyze each date column
    for col in date_columns:
        analysis = date_analyzer.analyze_date_column(df, col)
        DateAnalysisReporter.print_analysis_report(analysis)
        
        # Step 4: Standardize date columns
        if not analysis['is_consistent']:
            print(f"⚙️  Standardizing {col}...\n")
            df, report = date_analyzer.standardize_date_column(
                df, 
                col,
                target_format='%Y-%m-%d'
            )
            DateAnalysisReporter.print_standardization_report(report)
    
    # Step 5: Remove duplicates
    print("\n🔄 Checking for duplicates...\n")
    df_clean, removed = AdvancedDataCleaner.remove_duplicates(df)
    
    # Step 6: Standardize text columns (example)
    text_cols = [col for col in df_clean.columns if df_clean[col].dtype == 'object']
    if text_cols:
        print(f"\n📝 Standardizing text columns: {text_cols[:3]}...\n")
        df_clean = AdvancedDataCleaner.standardize_text_case(
            df_clean,
            text_cols[:3],
            case_type='title'
        )
    
    # Step 7: Validate final data
    print("\n✅ Final Data Quality Check:\n")
    print(f"Shape: {df_clean.shape}")
    print(f"Missing values:\n{df_clean.isnull().sum()}")
    
    return df_clean


# ============================================================================
# SCENARIO 3: Focused Date Cleaning
# ============================================================================

def scenario_3_focused_date_cleaning():
    """
    Scenario 3: Fokus pada date fields yang problem
    - Target specific date/datetime columns
    - Analyze format inconsistencies
    - Standardize dengan hint format
    """
    print("\n" + "="*80)
    print("SCENARIO 3: FOCUSED DATE CLEANING")
    print("="*80 + "\n")
    
    # Read data
    cleaner = DatabricksDataCleaner(
        catalog="teamassgement",
        schema="cleandata_electronis",
        table="retail_electronics_sample_150_k"
    )
    df = cleaner.read_data()
    
    # Specify columns to check (berdasarkan header yang ada)
    date_columns_to_check = [
        col for col in df.columns 
        if 'date' in col.lower() or 'time' in col.lower()
    ]
    
    print(f"Date/Time columns found: {date_columns_to_check}\n")
    
    date_analyzer = DateFormatAnalyzer()
    
    if date_columns_to_check:
        for col in date_columns_to_check:
            print(f"\n{'='*60}")
            print(f"Analyzing: {col}")
            print('='*60)
            
            # Analyze
            analysis = date_analyzer.analyze_date_column(df, col)
            DateAnalysisReporter.print_analysis_report(analysis)
            
            # Show sample problematic values
            if analysis['problematic_samples']:
                print(f"\n⚠️  Sample problematic values in {col}:")
                for val in analysis['problematic_samples'][:5]:
                    print(f"    - {val}")
            
            # Standardize
            target_format = '%Y-%m-%d %H:%M:%S' if 'time' in col.lower() else '%Y-%m-%d'
            df, report = date_analyzer.standardize_date_column(
                df,
                col,
                target_format=target_format
            )
            
            print(f"\n✅ Standardization complete for {col}")
            print(f"   Successfully parsed: {report['successfully_parsed']}/{report['total_values']}")
    
    return df


# ============================================================================
# SCENARIO 4: Advanced Data Quality Report
# ============================================================================

def scenario_4_advanced_quality_report():
    """
    Scenario 4: Advanced quality checks
    - Detect outliers
    - Validate data types
    - Check for duplicates
    - Generate comprehensive report
    """
    print("\n" + "="*80)
    print("SCENARIO 4: ADVANCED QUALITY REPORT")
    print("="*80 + "\n")
    
    # Read data
    cleaner = DatabricksDataCleaner(
        catalog="teamassgement",
        schema="cleandata_electronis",
        table="retail_electronics_sample_150_k"
    )
    df = cleaner.read_data()
    
    # 1. Detect duplicates
    print("1️⃣  CHECKING FOR DUPLICATES\n")
    df_unique, removed = AdvancedDataCleaner.remove_duplicates(df)
    print(f"   Found and removed: {removed} duplicate rows")
    
    # 2. Detect outliers (for numeric columns)
    print("\n\n2️⃣  DETECTING OUTLIERS\n")
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns.tolist()
    if numeric_cols:
        outliers = AdvancedDataCleaner.detect_outliers(df, numeric_cols[:5], method='iqr')
        if outliers:
            for col, info in outliers.items():
                print(f"   Column: {col}")
                print(f"   - Outlier count: {info['count']}")
                print(f"   - Percentage: {info['percentage']:.2f}%")
                print(f"   - Range: {info['min']} to {info['max']}\n")
        else:
            print("   ✓ No outliers detected")
    
    # 3. Validate data types
    print("\n3️⃣  VALIDATING DATA TYPES\n")
    expected_types = {
        col: 'int' if 'id' in col.lower() else 'float' if col in numeric_cols else 'str'
        for col in df.columns[:5]
    }
    validation = AdvancedDataCleaner.validate_data_types(df, expected_types)
    
    for col, result in validation.items():
        status_icon = "✓" if result['status'] == 'PASS' else "⚠️" if result['status'] == 'WARNING' else "✗"
        print(f"   {status_icon} {col}: {result['status']}")
    
    # 4. Missing values analysis
    print("\n\n4️⃣  MISSING VALUES ANALYSIS\n")
    missing_info = df.isnull().sum()
    if missing_info.sum() > 0:
        print("   Columns dengan missing values:")
        for col, count in missing_info[missing_info > 0].items():
            percentage = (count / len(df)) * 100
            print(f"   - {col}: {count} ({percentage:.2f}%)")
    else:
        print("   ✓ No missing values")


# ============================================================================
# SCENARIO 5: Data Export & Save
# ============================================================================

def scenario_5_export_cleaned_data():
    """
    Scenario 5: Export cleaned data ke berbagai format
    """
    print("\n" + "="*80)
    print("SCENARIO 5: EXPORT CLEANED DATA")
    print("="*80 + "\n")
    
    # Read dan clean data
    cleaner = DatabricksDataCleaner(
        catalog="teamassgement",
        schema="cleandata_electronis",
        table="retail_electronics_sample_150_k"
    )
    df = cleaner.read_data()
    
    # Do some cleaning
    date_analyzer = DateFormatAnalyzer()
    date_columns = date_analyzer.find_date_columns(df, auto_detect=True)
    
    for col in date_columns:
        df, _ = date_analyzer.standardize_date_column(df, col, target_format='%Y-%m-%d')
    
    # Export ke berbagai format
    output_dir = './output'
    
    print(f"Saving cleaned data...\n")
    
    # CSV
    cleaner.df = df
    output_csv = f'{output_dir}/retail_electronics_cleaned.csv'
    cleaner.save_cleaned_data(output_csv, format='csv')
    print(f"✓ Saved to: {output_csv}")
    
    # Parquet (lebih efisien untuk data besar)
    output_parquet = f'{output_dir}/retail_electronics_cleaned.parquet'
    cleaner.save_cleaned_data(output_parquet, format='parquet')
    print(f"✓ Saved to: {output_parquet}")
    
    # Excel (untuk sharing dengan non-technical users)
    output_excel = f'{output_dir}/retail_electronics_cleaned.xlsx'
    cleaner.save_cleaned_data(output_excel, format='excel')
    print(f"✓ Saved to: {output_excel}")


# ============================================================================
# QUICK START - Choose Your Scenario
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("DATA CLEANING PIPELINE - USAGE GUIDE")
    print("="*80)
    print("""
Choose a scenario:

1. scenario_1_basic_analysis()
   - Quick data analysis tanpa modification
   - Best for: Initial data exploration
   
2. scenario_2_complete_cleaning()
   - Full cleaning pipeline dengan semua steps
   - Best for: Production data cleaning
   
3. scenario_3_focused_date_cleaning()
   - Fokus pada date/time fields
   - Best for: Database dengan banyak date format issues
   
4. scenario_4_advanced_quality_report()
   - Comprehensive quality checks
   - Best for: Data validation sebelum production
   
5. scenario_5_export_cleaned_data()
   - Clean dan export data ke berbagai format
   - Best for: Final output untuk stakeholders

    """)
    
    # UNCOMMENT SATU SCENARIO YANG INGIN DIJALANKAN:
    
    # scenario_1_basic_analysis()
    # scenario_2_complete_cleaning()
    scenario_3_focused_date_cleaning()
    # scenario_4_advanced_quality_report()
    # scenario_5_export_cleaned_data()
