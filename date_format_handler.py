"""
Date Format Inconsistency Handler
==================================
Specialized script untuk detect dan fix date format yang tidak konsisten
"""

import pandas as pd
import re
from datetime import datetime
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DateFormatAnalyzer:
    """Analyze dan standardisir date format yang inconsistent"""
    
    # Pattern untuk detect berbagai date format
    DATE_PATTERNS = {
        'YYYY-MM-DD': r'^\d{4}-\d{2}-\d{2}$',
        'DD-MM-YYYY': r'^\d{2}-\d{2}-\d{4}$',
        'MM-DD-YYYY': r'^\d{2}-\d{2}-\d{4}$',  # Sulit membedakan dengan DD-MM-YYYY
        'YYYY/MM/DD': r'^\d{4}/\d{2}/\d{2}$',
        'DD/MM/YYYY': r'^\d{2}/\d{2}/\d{4}$',
        'MM/DD/YYYY': r'^\d{2}/\d{2}/\d{4}$',  # Sulit membedakan dengan DD/MM/YYYY
        'YYYY-MM-DD HH:MM:SS': r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$',
        'DD-MM-YYYY HH:MM:SS': r'^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$',
        'YYYY.MM.DD': r'^\d{4}\.\d{2}\.\d{2}$',
    }
    
    COMMON_DATE_FORMATS = [
        '%Y-%m-%d',
        '%d-%m-%Y',
        '%m-%d-%Y',
        '%Y/%m/%d',
        '%d/%m/%Y',
        '%m/%d/%Y',
        '%Y-%m-%d %H:%M:%S',
        '%d-%m-%Y %H:%M:%S',
        '%m-%d-%Y %H:%M:%S',
        '%Y/%m/%d %H:%M:%S',
        '%d/%m/%Y %H:%M:%S',
        '%Y.%m.%d',
        '%d.%m.%Y',
        '%B %d, %Y',  # January 01, 2024
        '%d %B %Y',   # 01 January 2024
    ]
    
    @staticmethod
    def detect_date_format(date_str: str) -> str:
        """
        Detect format dari single date string
        
        Args:
            date_str: String date value
        
        Returns:
            Format string atau 'UNKNOWN'
        """
        date_str = str(date_str).strip()
        
        # Try exact pattern matching first
        for format_name, pattern in DateFormatAnalyzer.DATE_PATTERNS.items():
            if re.match(pattern, date_str):
                return format_name
        
        # Try parsing dengan common formats
        for fmt in DateFormatAnalyzer.COMMON_DATE_FORMATS:
            try:
                datetime.strptime(date_str, fmt)
                return fmt
            except ValueError:
                continue
        
        return 'UNKNOWN'
    
    @staticmethod
    def analyze_date_column(df: pd.DataFrame, column: str) -> Dict:
        """
        Analyze date column untuk detect format inconsistencies
        
        Args:
            df: DataFrame
            column: Column name
        
        Returns:
            Dict dengan format analysis
        """
        logger.info(f"Analyzing date column: {column}")
        
        col_data = df[column].dropna()
        format_distribution = {}
        problematic_values = []
        
        sample_size = min(100, len(col_data))
        
        for i, val in enumerate(col_data.head(sample_size)):
            detected_format = DateFormatAnalyzer.detect_date_format(val)
            
            if detected_format == 'UNKNOWN':
                problematic_values.append(val)
            else:
                format_distribution[detected_format] = format_distribution.get(detected_format, 0) + 1
        
        analysis = {
            'column': column,
            'total_values': len(col_data),
            'analyzed_sample': sample_size,
            'format_distribution': format_distribution,
            'unique_formats': len(format_distribution),
            'problematic_count': len(problematic_values),
            'problematic_samples': list(set(problematic_values))[:10],
            'is_consistent': len(format_distribution) <= 1,
            'most_common_format': max(format_distribution, key=format_distribution.get) if format_distribution else None
        }
        
        return analysis
    
    @staticmethod
    def parse_date_flexible(date_str: str, hint_format: str = None) -> datetime:
        """
        Parse date string dengan flexibility
        Coba multiple formats untuk find the right one
        
        Args:
            date_str: The date string to parse
            hint_format: Hint format untuk try first
        
        Returns:
            datetime object atau None jika tidak bisa di-parse
        """
        date_str = str(date_str).strip()
        
        # Try hint format first jika ada
        if hint_format:
            try:
                return datetime.strptime(date_str, hint_format)
            except ValueError:
                pass
        
        # Try common formats
        for fmt in DateFormatAnalyzer.COMMON_DATE_FORMATS:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        # Last resort: try pandas to_datetime
        try:
            return pd.to_datetime(date_str)
        except:
            return None
    
    @staticmethod
    def standardize_date_column(df: pd.DataFrame, column: str, 
                                target_format: str = '%Y-%m-%d',
                                hint_format: str = None) -> Tuple[pd.DataFrame, Dict]:
        """
        Standardisir date column
        
        Args:
            df: DataFrame
            column: Column name
            target_format: Target date format (default: YYYY-MM-DD)
            hint_format: Hint format untuk parsing
        
        Returns:
            Tuple[standardized_df, report]
        """
        logger.info(f"Standardizing date column: {column} to format: {target_format}")
        
        df_cleaned = df.copy()
        report = {
            'column': column,
            'total_values': len(df_cleaned),
            'successfully_parsed': 0,
            'failed_to_parse': [],
            'before_analysis': DateFormatAnalyzer.analyze_date_column(df, column)
        }
        
        def standardize_value(val):
            if pd.isna(val):
                return pd.NaT
            
            parsed_date = DateFormatAnalyzer.parse_date_flexible(val, hint_format)
            
            if parsed_date:
                report['successfully_parsed'] += 1
                return parsed_date.strftime(target_format)
            else:
                report['failed_to_parse'].append(val)
                return pd.NaT
        
        df_cleaned[column] = df_cleaned[column].apply(standardize_value)
        
        report['after_analysis'] = DateFormatAnalyzer.analyze_date_column(df_cleaned, column)
        
        return df_cleaned, report
    
    @staticmethod
    def find_date_columns(df: pd.DataFrame, auto_detect: bool = True) -> List[str]:
        """
        Find columns yang mungkin berisi date
        
        Args:
            df: DataFrame
            auto_detect: Jika True, detect berdasarkan patterns
        
        Returns:
            List nama columns yang likely date columns
        """
        date_keywords = ['date', 'time', 'created', 'updated', 'tanggal', 'waktu', 'tgl', 'jam']
        date_columns = []
        
        for col in df.columns:
            # Check by column name
            if any(keyword in col.lower() for keyword in date_keywords):
                date_columns.append(col)
            # Auto detect by sampling
            elif auto_detect:
                try:
                    col_sample = df[col].dropna().head(5)
                    if len(col_sample) > 0:
                        # Try to parse as date
                        parsed_count = 0
                        for val in col_sample:
                            if DateFormatAnalyzer.parse_date_flexible(str(val)):
                                parsed_count += 1
                        
                        if parsed_count >= 3:  # 3 out of 5
                            date_columns.append(col)
                except:
                    pass
        
        return list(set(date_columns))


# ============================================================================
# REPORT GENERATOR
# ============================================================================

class DateAnalysisReporter:
    """Generate detailed reports untuk date analysis"""
    
    @staticmethod
    def print_analysis_report(analysis: Dict):
        """Print format analysis report"""
        
        print("\n" + "="*80)
        print(f"DATE COLUMN ANALYSIS: {analysis['column']}")
        print("="*80)
        
        print(f"\n📊 Statistics:")
        print(f"  Total values: {analysis['total_values']}")
        print(f"  Analyzed sample: {analysis['analyzed_sample']}")
        print(f"  Unique formats found: {analysis['unique_formats']}")
        print(f"  Is consistent: {'✓ YES' if analysis['is_consistent'] else '✗ NO'}")
        
        print(f"\n📅 Format Distribution:")
        for fmt, count in analysis['format_distribution'].items():
            percentage = (count / analysis['analyzed_sample']) * 100
            print(f"  {fmt}: {count} ({percentage:.1f}%)")
        
        if analysis['most_common_format']:
            print(f"\n🎯 Recommended format: {analysis['most_common_format']}")
        
        if analysis['problematic_samples']:
            print(f"\n⚠️  Problematic values ({analysis['problematic_count']} found):")
            for val in analysis['problematic_samples']:
                print(f"  - {val}")
        
        print("\n" + "="*80 + "\n")
    
    @staticmethod
    def print_standardization_report(report: Dict):
        """Print standardization report"""
        
        print("\n" + "="*80)
        print(f"DATE STANDARDIZATION REPORT: {report['column']}")
        print("="*80)
        
        print(f"\n📈 Standardization Results:")
        print(f"  Total values: {report['total_values']}")
        print(f"  Successfully parsed: {report['successfully_parsed']}")
        print(f"  Failed to parse: {len(report['failed_to_parse'])}")
        
        if report['failed_to_parse']:
            print(f"\n❌ Failed values:")
            for val in report['failed_to_parse'][:10]:
                print(f"  - {val}")
        
        print(f"\n📊 Before standardization:")
        print(f"  Unique formats: {report['before_analysis']['unique_formats']}")
        
        print(f"\n📊 After standardization:")
        print(f"  Unique formats: {report['after_analysis']['unique_formats']}")
        
        print("\n" + "="*80 + "\n")


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Example data dengan date format inconsistencies
    df_example = pd.DataFrame({
        'id': [1, 2, 3, 4, 5, 6],
        'created_date': [
            '2024-01-15',      # YYYY-MM-DD
            '15/01/2024',      # DD/MM/YYYY
            '2024/01/20',      # YYYY/MM/DD
            '20-01-2024',      # DD-MM-YYYY
            '2024-02-01',      # YYYY-MM-DD
            'invalid-date',    # Invalid
        ],
        'updated_at': [
            '2024-01-15 10:30:45',  # YYYY-MM-DD HH:MM:SS
            '15/01/2024 14:20:00',  # DD/MM/YYYY HH:MM:SS
            '2024/01/20 09:15:30',  # YYYY/MM/DD HH:MM:SS
            None,
            '2024-02-01 11:00:00',  # YYYY-MM-DD HH:MM:SS
            '01-02-2024 16:45:30',  # DD-MM-YYYY HH:MM:SS
        ]
    })
    
    print("Original Data:")
    print(df_example)
    
    # ====== ANALYZE ======
    analyzer = DateFormatAnalyzer()
    
    # 1. Analyze created_date
    analysis_1 = analyzer.analyze_date_column(df_example, 'created_date')
    DateAnalysisReporter.print_analysis_report(analysis_1)
    
    # 2. Analyze updated_at
    analysis_2 = analyzer.analyze_date_column(df_example, 'updated_at')
    DateAnalysisReporter.print_analysis_report(analysis_2)
    
    # ====== STANDARDIZE ======
    
    # Standardize created_date
    df_clean, report_1 = analyzer.standardize_date_column(
        df_example, 
        'created_date',
        target_format='%Y-%m-%d'
    )
    DateAnalysisReporter.print_standardization_report(report_1)
    
    # Standardize updated_at
    df_clean, report_2 = analyzer.standardize_date_column(
        df_clean, 
        'updated_at',
        target_format='%Y-%m-%d %H:%M:%S'
    )
    DateAnalysisReporter.print_standardization_report(report_2)
    
    # ====== RESULT ======
    print("\nCLEANED DATA:")
    print(df_clean)
