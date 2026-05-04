"""
Advanced Data Standardization & Validation
===========================================
Script untuk handle specific data quality issues
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AdvancedDataCleaner:
    """Advanced cleaning techniques untuk data quality issues"""
    
    @staticmethod
    def standardize_phone_numbers(df: pd.DataFrame, phone_columns: List[str]) -> pd.DataFrame:
        """
        Standardisir format nomor telepon
        
        Args:
            df: DataFrame
            phone_columns: Columns dengan nomor telepon
        
        Returns:
            DataFrame dengan phone yang sudah standardisir
        """
        df_cleaned = df.copy()
        
        for col in phone_columns:
            if col not in df_cleaned.columns:
                continue
            
            def clean_phone(phone):
                if pd.isna(phone):
                    return None
                
                # Remove semua non-digit characters
                phone_str = str(phone)
                phone_digits = ''.join(filter(str.isdigit, phone_str))
                
                # Format ke format standard (e.g., +62-XXX-XXXX-XXXX)
                if phone_digits.startswith('62'):
                    phone_digits = '62' + phone_digits[2:]
                elif phone_digits.startswith('0'):
                    phone_digits = '62' + phone_digits[1:]
                
                return phone_digits
            
            df_cleaned[col] = df_cleaned[col].apply(clean_phone)
        
        logger.info(f"Phone numbers standardized for columns: {phone_columns}")
        return df_cleaned
    
    @staticmethod
    def standardize_email(df: pd.DataFrame, email_columns: List[str]) -> pd.DataFrame:
        """
        Standardisir format email (lowercase, trim spaces)
        
        Args:
            df: DataFrame
            email_columns: Columns dengan email
        
        Returns:
            DataFrame dengan email yang sudah standardisir
        """
        df_cleaned = df.copy()
        
        for col in email_columns:
            if col not in df_cleaned.columns:
                continue
            
            df_cleaned[col] = df_cleaned[col].str.lower().str.strip()
        
        logger.info(f"Emails standardized for columns: {email_columns}")
        return df_cleaned
    
    @staticmethod
    def standardize_text_case(df: pd.DataFrame, text_columns: List[str], case_type: str = 'title') -> pd.DataFrame:
        """
        Standardisir text case (title case, lowercase, uppercase)
        
        Args:
            df: DataFrame
            text_columns: Columns dengan text
            case_type: 'title', 'lower', 'upper'
        
        Returns:
            DataFrame dengan text yang sudah standardisir
        """
        df_cleaned = df.copy()
        
        for col in text_columns:
            if col not in df_cleaned.columns:
                continue
            
            if case_type == 'title':
                df_cleaned[col] = df_cleaned[col].str.title()
            elif case_type == 'lower':
                df_cleaned[col] = df_cleaned[col].str.lower()
            elif case_type == 'upper':
                df_cleaned[col] = df_cleaned[col].str.upper()
        
        logger.info(f"Text case standardized ({case_type}) for columns: {text_columns}")
        return df_cleaned
    
    @staticmethod
    def detect_outliers(df: pd.DataFrame, numeric_columns: List[str], method: str = 'iqr') -> Dict[str, List]:
        """
        Detect outliers dalam numeric columns
        
        Args:
            df: DataFrame
            numeric_columns: Columns untuk check outliers
            method: 'iqr' atau 'zscore'
        
        Returns:
            Dict dengan outliers info
        """
        outliers = {}
        
        for col in numeric_columns:
            if col not in df.columns:
                continue
            
            col_data = pd.to_numeric(df[col], errors='coerce')
            col_data = col_data.dropna()
            
            if len(col_data) == 0:
                continue
            
            if method == 'iqr':
                Q1 = col_data.quantile(0.25)
                Q3 = col_data.quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outlier_mask = (col_data < lower_bound) | (col_data > upper_bound)
            
            elif method == 'zscore':
                from scipy import stats
                z_scores = np.abs(stats.zscore(col_data))
                outlier_mask = z_scores > 3
            
            if outlier_mask.sum() > 0:
                outliers[col] = {
                    'count': outlier_mask.sum(),
                    'percentage': (outlier_mask.sum() / len(col_data)) * 100,
                    'min': col_data[outlier_mask].min(),
                    'max': col_data[outlier_mask].max(),
                    'values': col_data[outlier_mask].head(10).tolist()
                }
        
        return outliers
    
    @staticmethod
    def remove_duplicates(df: pd.DataFrame, subset: List[str] = None, keep: str = 'first') -> Tuple[pd.DataFrame, int]:
        """
        Remove duplicate rows
        
        Args:
            df: DataFrame
            subset: Columns untuk check duplicate (None = semua columns)
            keep: 'first', 'last', atau False (remove all duplicates)
        
        Returns:
            Tuple[cleaned_df, removed_count]
        """
        initial_count = len(df)
        df_cleaned = df.drop_duplicates(subset=subset, keep=keep)
        removed_count = initial_count - len(df_cleaned)
        
        logger.info(f"Duplicates removed: {removed_count} rows")
        return df_cleaned, removed_count
    
    @staticmethod
    def fill_missing_values(df: pd.DataFrame, fill_strategy: Dict[str, str]) -> pd.DataFrame:
        """
        Fill missing values dengan strategy berbeda
        
        Args:
            df: DataFrame
            fill_strategy: Dict {column: 'method'} where method = 'forward_fill', 'backward_fill', 'mean', 'median', 'mode', 'value'
        
        Returns:
            DataFrame dengan missing values sudah terisi
        """
        df_cleaned = df.copy()
        
        for col, strategy in fill_strategy.items():
            if col not in df_cleaned.columns:
                continue
            
            if strategy == 'forward_fill':
                df_cleaned[col] = df_cleaned[col].fillna(method='ffill')
            elif strategy == 'backward_fill':
                df_cleaned[col] = df_cleaned[col].fillna(method='bfill')
            elif strategy == 'mean':
                df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].mean())
            elif strategy == 'median':
                df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].median())
            elif strategy == 'mode':
                df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].mode()[0])
        
        logger.info(f"Missing values filled for columns: {list(fill_strategy.keys())}")
        return df_cleaned
    
    @staticmethod
    def validate_data_types(df: pd.DataFrame, expected_types: Dict[str, str]) -> Dict[str, List]:
        """
        Validate data types di columns
        
        Args:
            df: DataFrame
            expected_types: Dict {column: 'expected_type'} e.g., {'age': 'int', 'email': 'str'}
        
        Returns:
            Dict dengan validation results
        """
        validation_results = {}
        
        for col, expected_type in expected_types.items():
            if col not in df.columns:
                validation_results[col] = {'status': 'FAIL', 'reason': 'Column not found'}
                continue
            
            actual_type = str(df[col].dtype)
            
            # Map simple type names to pandas dtypes
            type_mapping = {
                'int': ['int64', 'int32', 'int'],
                'float': ['float64', 'float32', 'float'],
                'str': ['object', 'string'],
                'bool': ['bool'],
                'date': ['datetime64']
            }
            
            expected_types_list = type_mapping.get(expected_type, [expected_type])
            
            if any(t in actual_type for t in expected_types_list):
                validation_results[col] = {
                    'status': 'PASS',
                    'expected': expected_type,
                    'actual': actual_type
                }
            else:
                # Check untuk mismatches
                problematic_values = []
                for val in df[col].head(10):
                    if pd.notna(val):
                        try:
                            if expected_type == 'int' and not isinstance(val, (int, np.integer)):
                                problematic_values.append(val)
                            elif expected_type == 'float' and not isinstance(val, (float, int, np.number)):
                                problematic_values.append(val)
                        except:
                            pass
                
                validation_results[col] = {
                    'status': 'WARNING' if problematic_values else 'PASS',
                    'expected': expected_type,
                    'actual': actual_type,
                    'problematic_values': problematic_values[:5] if problematic_values else []
                }
        
        return validation_results


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Example data
    df_example = pd.DataFrame({
        'id': [1, 2, 3, 4, 5, 5],  # ada duplicate
        'email': ['JOHN@EMAIL.COM', 'jane@email.com ', ' bob@email.com'],  # ada uppercase dan spaces
        'phone': ['081234567890', '62-812-3456-7890', '0812345678'],  # inconsistent format
        'product_name': ['laptop computer', 'MOUSE PAD', 'keyboard'],  # mixed case
        'price': [1000000, '500.000', 300000, 2000000, 1500000, 1000000],  # mixed types
        'date': ['2024-01-15', '15/01/2024', '2024/01/20'],  # mixed date format
    })
    
    print("ORIGINAL DATA:")
    print(df_example)
    print("\n" + "="*80 + "\n")
    
    # 1. Remove duplicates
    df_clean, removed = AdvancedDataCleaner.remove_duplicates(df_example)
    print(f"Removed {removed} duplicate rows\n")
    
    # 2. Standardize email
    df_clean = AdvancedDataCleaner.standardize_email(df_clean, ['email'])
    
    # 3. Standardize phone
    df_clean = AdvancedDataCleaner.standardize_phone_numbers(df_clean, ['phone'])
    
    # 4. Standardize text case
    df_clean = AdvancedDataCleaner.standardize_text_case(df_clean, ['product_name'], case_type='title')
    
    print("\nCLEANED DATA:")
    print(df_clean)
    print("\n" + "="*80 + "\n")
    
    # 5. Detect outliers
    outliers = AdvancedDataCleaner.detect_outliers(df_clean, ['price'])
    print("OUTLIERS DETECTED:")
    print(outliers)
