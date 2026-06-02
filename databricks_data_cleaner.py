"""
Databricks Data Cleaning & Standardization Script
================================================
Script untuk:
1. Read data dari Databricks
2. Analyze data types di setiap column
3. Detect data yang inconsistent/berbeda format
4. Standardisir data agar seragam
"""

import pandas as pd
from pyspark.sql import SparkSession
from pyspark.sql.types import *
from datetime import datetime
import logging
from typing import Dict, List, Tuple

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class DatabricksDataCleaner:
    """Class untuk cleaning dan standardisasi data dari Databricks"""
    
    def __init__(self, catalog: str, schema: str, table: str):
        """
        Initialize Databricks connection
        
        Args:
            catalog: Nama catalog Databricks
            schema: Nama schema
            table: Nama table
        """
        self.catalog = catalog
        self.schema = schema
        self.table = table
        self.spark = SparkSession.builder.appName("DataCleaner").getOrCreate()
        self.df = None
        self.data_quality_report = {}
        
        logger.info(f"Initialized for table: {catalog}.{schema}.{table}")
    
    def read_data(self) -> pd.DataFrame:
        """
        Read data dari Databricks table
        
        Returns:
            pd.DataFrame: Data dalam format pandas
        """
        try:
            full_table_name = f"`{self.catalog}`.`{self.schema}`.`{self.table}`"
            logger.info(f"Reading data from: {full_table_name}")
            
            spark_df = self.spark.sql(f"SELECT * FROM {full_table_name}")
            self.df = spark_df.toPandas()
            
            logger.info(f"Data loaded successfully! Shape: {self.df.shape}")
            return self.df
        
        except Exception as e:
            logger.error(f"Error reading data: {str(e)}")
            raise
    
    def analyze_column_types(self) -> Dict:
        """
        Analyze data types di setiap column
        
        Returns:
            Dict: Report tipe data untuk setiap column
        """
        logger.info("Analyzing column types...")
        type_report = {}
        
        for col in self.df.columns:
            col_data = self.df[col]
            type_report[col] = {
                'dtype': str(col_data.dtype),
                'non_null_count': col_data.notna().sum(),
                'null_count': col_data.isna().sum(),
                'unique_count': col_data.nunique(),
                'sample_values': col_data.dropna().head(3).tolist()
            }
        
        self.data_quality_report['column_types'] = type_report
        return type_report
    
    def detect_inconsistent_dates(self) -> Dict[str, List]:
        """
        Detect column dengan date format yang inconsistent
        
        Returns:
            Dict: Columns dengan date issues dan contoh data
        """
        logger.info("Detecting inconsistent date formats...")
        date_issues = {}
        
        for col in self.df.columns:
            col_data = self.df[col].dropna()
            
            if len(col_data) == 0:
                continue
            
            # Check if column name suggests it's date-related
            if any(keyword in col.lower() for keyword in ['date', 'time', 'created', 'updated', 'tanggal']):
                inconsistent_formats = []
                sample_values = col_data.head(20).tolist()
                
                for val in sample_values:
                    val_str = str(val).strip()
                    # Check various date formats
                    formats_to_check = [
                        '%Y-%m-%d',
                        '%d-%m-%Y',
                        '%m-%d-%Y',
                        '%Y/%m/%d',
                        '%d/%m/%Y',
                        '%Y-%m-%d %H:%M:%S',
                        '%d-%m-%Y %H:%M:%S',
                        '%d/%m/%Y %H:%M:%S',
                    ]
                    
                    format_found = False
                    for fmt in formats_to_check:
                        try:
                            datetime.strptime(val_str, fmt)
                            format_found = True
                            break
                        except ValueError:
                            continue
                    
                    if not format_found and val_str:
                        inconsistent_formats.append(val_str)
                
                if inconsistent_formats:
                    date_issues[col] = {
                        'inconsistent_count': len(set(inconsistent_formats)),
                        'sample_problematic_values': list(set(inconsistent_formats))[:5]
                    }
        
        self.data_quality_report['date_issues'] = date_issues
        return date_issues
    
    def detect_numeric_inconsistencies(self) -> Dict[str, List]:
        """
        Detect column numeric yang mungkin mixed dengan string
        
        Returns:
            Dict: Columns dengan numeric issues
        """
        logger.info("Detecting numeric inconsistencies...")
        numeric_issues = {}
        
        for col in self.df.columns:
            col_data = self.df[col].dropna()
            
            if len(col_data) == 0 or col_data.dtype not in ['object', 'string']:
                continue
            
            non_numeric = []
            for val in col_data.head(100):
                try:
                    float(val)
                except (ValueError, TypeError):
                    non_numeric.append(val)
            
            # Jika column terlihat seperti numeric tapi ada non-numeric values
            if 0 < len(non_numeric) < len(col_data.head(100)) * 0.5:
                numeric_issues[col] = {
                    'non_numeric_count': len(non_numeric),
                    'sample_problematic_values': list(set(non_numeric))[:5]
                }
        
        self.data_quality_report['numeric_issues'] = numeric_issues
        return numeric_issues
    
    def display_data_quality_report(self):
        """Print data quality report ke console"""
        print("\n" + "="*80)
        print("DATA QUALITY REPORT")
        print("="*80)
        
        print("\n📊 COLUMN TYPES & STATISTICS:")
        print("-"*80)
        for col, info in self.data_quality_report.get('column_types', {}).items():
            print(f"\n  Column: {col}")
            print(f"    Type: {info['dtype']}")
            print(f"    Non-Null: {info['non_null_count']} | Null: {info['null_count']}")
            print(f"    Unique values: {info['unique_count']}")
            print(f"    Sample: {info['sample_values']}")
        
        print("\n\n⚠️  DATE FORMAT ISSUES:")
        print("-"*80)
        date_issues = self.data_quality_report.get('date_issues', {})
        if date_issues:
            for col, issues in date_issues.items():
                print(f"\n  Column: {col}")
                print(f"    Inconsistent formats found: {issues['inconsistent_count']}")
                print(f"    Examples: {issues['sample_problematic_values']}")
        else:
            print("  ✓ No date format issues detected")
        
        print("\n\n⚠️  NUMERIC INCONSISTENCIES:")
        print("-"*80)
        numeric_issues = self.data_quality_report.get('numeric_issues', {})
        if numeric_issues:
            for col, issues in numeric_issues.items():
                print(f"\n  Column: {col}")
                print(f"    Non-numeric values: {issues['non_numeric_count']}")
                print(f"    Examples: {issues['sample_problematic_values']}")
        else:
            print("  ✓ No numeric inconsistencies detected")
        
        print("\n" + "="*80 + "\n")
    
    def standardize_dates(self, date_columns: List[str], target_format: str = '%Y-%m-%d') -> pd.DataFrame:
        """
        Standardisir date columns ke format yang sama
        
        Args:
            date_columns: List nama columns yang akan di-standardisir
            target_format: Target date format (default: YYYY-MM-DD)
        
        Returns:
            pd.DataFrame: Dataframe dengan date yang sudah standardisir
        """
        logger.info(f"Standardizing date columns: {date_columns}")
        
        df_cleaned = self.df.copy()
        
        for col in date_columns:
            if col not in df_cleaned.columns:
                logger.warning(f"Column {col} not found")
                continue
            
            def parse_date(date_str):
                if pd.isna(date_str):
                    return pd.NaT
                
                date_str = str(date_str).strip()
                
                formats_to_try = [
                    '%Y-%m-%d',
                    '%d-%m-%Y',
                    '%m-%d-%Y',
                    '%Y/%m/%d',
                    '%d/%m/%Y',
                    '%Y-%m-%d %H:%M:%S',
                    '%d-%m-%Y %H:%M:%S',
                    '%d/%m/%Y %H:%M:%S',
                ]
                
                for fmt in formats_to_try:
                    try:
                        return pd.to_datetime(date_str, format=fmt)
                    except ValueError:
                        continue
                
                # Jika tidak ada format yang cocok, coba automatic parsing
                try:
                    return pd.to_datetime(date_str)
                except:
                    logger.warning(f"Could not parse date: {date_str}")
                    return pd.NaT
            
            df_cleaned[col] = df_cleaned[col].apply(parse_date)
            df_cleaned[col] = df_cleaned[col].dt.strftime(target_format)
        
        logger.info(f"Date standardization complete!")
        return df_cleaned
    
    def standardize_numerics(self, numeric_columns: List[str]) -> pd.DataFrame:
        """
        Standardisir numeric columns
        
        Args:
            numeric_columns: List nama columns yang akan di-standardisir
        
        Returns:
            pd.DataFrame: Dataframe dengan numeric yang sudah standardisir
        """
        logger.info(f"Standardizing numeric columns: {numeric_columns}")
        
        df_cleaned = self.df.copy()
        
        for col in numeric_columns:
            if col not in df_cleaned.columns:
                logger.warning(f"Column {col} not found")
                continue
            
            # Remove any non-numeric characters
            df_cleaned[col] = df_cleaned[col].astype(str).str.replace(',', '', regex=False)
            df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='coerce')
        
        logger.info(f"Numeric standardization complete!")
        return df_cleaned
    
    def save_cleaned_data(self, output_path: str, format: str = 'csv'):
        """
        Save cleaned data ke file
        
        Args:
            output_path: Path untuk output file
            format: Format file (csv, parquet, excel)
        """
        try:
            logger.info(f"Saving cleaned data to: {output_path}")
            
            if format == 'csv':
                self.df.to_csv(output_path, index=False)
            elif format == 'parquet':
                self.df.to_parquet(output_path, index=False)
            elif format == 'excel':
                self.df.to_excel(output_path, index=False)
            
            logger.info(f"Data saved successfully!")
        
        except Exception as e:
            logger.error(f"Error saving data: {str(e)}")
            raise


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Konfigurasi
    CATALOG = "teamassgement"
    SCHEMA = "cleandata_electronis"
    TABLE = "retail_electronics_sample_150_k"
    
    # Initialize cleaner
    cleaner = DatabricksDataCleaner(CATALOG, SCHEMA, TABLE)
    
    # 1. Read data
    df = cleaner.read_data()
    print(f"Data shape: {df.shape}")
    print(f"Columns: {list(df.columns)}\n")
    
    # 2. Analyze column types
    type_report = cleaner.analyze_column_types()
    
    # 3. Detect date issues
    date_issues = cleaner.detect_inconsistent_dates()
    
    # 4. Detect numeric issues
    numeric_issues = cleaner.detect_numeric_inconsistencies()
    
    # 5. Display full report
    cleaner.display_data_quality_report()
    
    # 6. OPSIONAL: Standardisir data
    # Uncomment untuk standardisir date columns
    # date_cols = [col for col in df.columns if 'date' in col.lower()]
    # df_cleaned = cleaner.standardize_dates(date_cols)
    # cleaner.df = df_cleaned
    
    # 7. OPSIONAL: Save cleaned data
    # cleaner.save_cleaned_data('output/cleaned_retail_electronics.csv', format='csv')
