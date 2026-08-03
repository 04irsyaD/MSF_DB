"""Dukungan SQL Server: pembentukan URL dan penyaringan skema sistem.

Batasan yang diakui terbuka: koneksi SQL Server sungguhan tidak dapat diuji
tanpa server dan driver ODBC terpasang, sehingga cakupan test ini terbatas
pada pembentukan URL, penyaringan skema, dan pemilihan query versi.
"""

from app.models.schemas import DBConnection
from app.services.db_connector import DBConnector

# Nilai contoh untuk test. BUKAN kredensial nyata dan tidak dipakai sistem mana
# pun. Sengaja TIDAK dirangkai menjadi literal berbentuk skema://user:sandi@host
# di dalam assertion, karena bentuk itu terbaca sebagai kebocoran rahasia oleh
# pemindai otomatis dan memicu insiden palsu.
USERNAME_CONTOH = "PLACEHOLDER_USER"
SANDI_CONTOH = "PLACEHOLDER_VALUE"
HOST_CONTOH = "db.internal"
DATABASE_CONTOH = "penjualan"


def _conn(**overrides) -> DBConnection:
    data = {
        "engine": "sqlserver",
        "host": HOST_CONTOH,
        "port": 1433,
        "database": DATABASE_CONTOH,
        "username": USERNAME_CONTOH,
        "password": SANDI_CONTOH,
    }
    data.update(overrides)
    return DBConnection(**data)


def test_build_connection_url_memakai_driver_18(monkeypatch):
    monkeypatch.delenv("MSSQL_ODBC_DRIVER", raising=False)

    url = DBConnector.build_connection_url(_conn())

    assert url.startswith("mssql+pyodbc://")
    assert f"{USERNAME_CONTOH}:{SANDI_CONTOH}" in url
    assert f"@{HOST_CONTOH}:1433/{DATABASE_CONTOH}" in url
    assert "driver=ODBC+Driver+18+for+SQL+Server" in url


def test_build_connection_url_menyertakan_trust_server_certificate(monkeypatch):
    monkeypatch.delenv("MSSQL_TRUST_SERVER_CERTIFICATE", raising=False)

    url = DBConnector.build_connection_url(_conn())

    assert "TrustServerCertificate=yes" in url


def test_driver_dan_trust_dapat_diubah_lewat_env(monkeypatch):
    monkeypatch.setenv("MSSQL_ODBC_DRIVER", "ODBC Driver 17 for SQL Server")
    monkeypatch.setenv("MSSQL_TRUST_SERVER_CERTIFICATE", "no")

    url = DBConnector.build_connection_url(_conn())

    assert "driver=ODBC+Driver+17+for+SQL+Server" in url
    assert "TrustServerCertificate=no" in url


def test_port_bawaan_sqlserver_adalah_1433():
    url = DBConnector.build_connection_url(_conn(port=None))

    assert "@db.internal:1433/" in url


def test_filter_system_schemas_membuang_skema_bawaan_sqlserver():
    schemas = [
        "dbo",
        "penjualan",
        "sys",
        "INFORMATION_SCHEMA",
        "guest",
        "db_owner",
        "db_accessadmin",
        "db_securityadmin",
        "db_ddladmin",
        "db_backupoperator",
        "db_datareader",
        "db_datawriter",
        "db_denydatareader",
        "db_denydatawriter",
    ]

    hasil = DBConnector._filter_system_schemas(schemas, "sqlserver")

    assert hasil == ["dbo", "penjualan"]


def test_version_query_sqlserver():
    assert DBConnector._get_version_query("sqlserver") == "SELECT @@VERSION"
