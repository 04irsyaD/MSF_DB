# db_reader.py - Enhanced PostgreSQL metadata extractor
import psycopg2
from psycopg2 import OperationalError
import json

def get_db_metadata(host, dbname, user, password, port='5432', schema='public'):
    """Enhanced database metadata extractor with relationships and constraints"""
    try:
        conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
        cur = conn.cursor()
        
        # Get comprehensive table information
        cur.execute("""
            SELECT 
                t.table_name,
                c.column_name,
                c.data_type,
                c.is_nullable,
                c.column_default,
                c.character_maximum_length,
                tc.constraint_type,
                kcu.constraint_name
            FROM information_schema.tables t
            LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
            LEFT JOIN information_schema.key_column_usage kcu ON c.column_name = kcu.column_name AND c.table_name = kcu.table_name
            LEFT JOIN information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
            WHERE t.table_schema = %s AND c.table_schema = %s
            ORDER BY t.table_name, c.ordinal_position;
        """, (schema, schema))
        
        rows = cur.fetchall()
        
        # Get foreign key relationships
        cur.execute("""
            SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = %s;
        """, (schema,))
        
        fk_rows = cur.fetchall()
        cur.close()
        conn.close()

        # Build foreign key mapping
        foreign_keys = {}
        for table_name, column_name, foreign_table, foreign_column in fk_rows:
            if table_name not in foreign_keys:
                foreign_keys[table_name] = {}
            foreign_keys[table_name][column_name] = {
                'references_table': foreign_table,
                'references_column': foreign_column
            }

        # Build enhanced table structure
        tables = {}
        for table_name, column_name, data_type, is_nullable, column_default, max_length, constraint_type, constraint_name in rows:
            if table_name not in tables:
                tables[table_name] = {
                    'columns': [],
                    'primary_keys': [],
                    'foreign_keys': {},
                    'constraints': []
                }
            
            # Column information
            column_info = {
                'name': column_name,
                'type': data_type,
                'nullable': is_nullable,
                'default': column_default,
                'max_length': max_length,
                'is_primary_key': constraint_type == 'PRIMARY KEY',
                'is_foreign_key': table_name in foreign_keys and column_name in foreign_keys[table_name]
            }
            
            # Add foreign key details if applicable
            if column_info['is_foreign_key']:
                fk_info = foreign_keys[table_name][column_name]
                column_info['foreign_key'] = fk_info
            
            tables[table_name]['columns'].append(column_info)
            
            # Track primary keys
            if constraint_type == 'PRIMARY KEY':
                tables[table_name]['primary_keys'].append(column_name)
            
            # Track constraints
            if constraint_type and constraint_name:
                constraint_info = {
                    'type': constraint_type,
                    'name': constraint_name,
                    'column': column_name
                }
                if constraint_info not in tables[table_name]['constraints']:
                    tables[table_name]['constraints'].append(constraint_info)

        # Add foreign key mapping to tables
        for table_name in tables:
            if table_name in foreign_keys:
                tables[table_name]['foreign_keys'] = foreign_keys[table_name]

        return tables
    
    except OperationalError as e:
        raise Exception(f"Database connection failed: {e}")
    except Exception as e:
        raise Exception(f"Database query failed: {e}")

if __name__ == '__main__':
    # quick test menggunakan environment variables
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    cfg = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'dbname': os.getenv('DB_NAME', 'your_db'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'password')
    }
    print(get_db_metadata(cfg['host'], cfg['dbname'], cfg['user'], cfg['password']))