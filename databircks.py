from pyspark.sql import functions as F
from pyspark.sql import types as T

# =========================
# A. CLEANING DASAR
# =========================
# Asumsi df sudah tersedia

# 1) Trim semua kolom string
df = spark.table("silver_retail_clean")

string_cols = [c.name for c in df.schema.fields if isinstance(c.dataType, T.StringType)]
for c in string_cols:
    df = df.withColumn(c, F.trim(F.col(c)))

# 2) Konversi date string -> date (fleksibel) jika belum ada
if "date_parsed" not in df.columns:
    if "date_clean_ts" in df.columns:
        df = df.withColumn("date_parsed", F.to_date(F.col("date_clean_ts")))
    elif "date_clean_str" in df.columns:
        df = df.withColumn(
            "date_parsed",
            F.coalesce(
                F.expr("try_to_date(date_clean_str, 'yyyy-MM-dd')"),
                F.expr("try_to_date(date_clean_str, 'dd-MM-yyyy')"),
                F.expr("try_to_date(date_clean_str, 'MM/dd/yyyy')")
            )
        )
    else:
        df = df.withColumn(
            "date_parsed",
            F.coalesce(
                F.expr("try_to_date(date, 'yyyy-MM-dd')"),
                F.expr("try_to_date(date, 'dd-MM-yyyy')"),
                F.expr("try_to_date(date, 'MM/dd/yyyy')"),
                F.expr("try_to_date(date, 'yyyy/MM/dd')")
            )
        )

# 3) Konversi unit_price string -> double (hilangkan simbol non angka) jika ada
if "unit_price" in df.columns:
    df = df.withColumn(
        "unit_price_clean",
        F.regexp_replace(F.col("unit_price"), "[^0-9.]", "").cast("double")
    )

# 4) Pastikan kolom penting tidak null (fallback jika kosong)
df_filtered = df.filter(
    F.col("date_parsed").isNotNull() &
    F.col("category").isNotNull() &
    F.col("product_name").isNotNull()
)

if df_filtered.count() == 0:
    print("Filter null menghasilkan data kosong, lanjut tanpa filter null.")
else:
    df = df_filtered

# =========================
# B. FILTER ELEKTRONIK (mudah diedit)
# =========================
electronics_keywords = ["elektronik", "electronic", "electronics"]

df_elec = df.filter(
    F.lower(F.col("category")).rlike("|".join(electronics_keywords))
)

if df_elec.count() == 0:
    print("Filter elektronik kosong, gunakan semua data.")
    df_elec = df

# Kalau tidak perlu filter, gunakan:
# df_elec = df

# =========================
# C. AGREGASI
# =========================

# 1) Tren total penjualan per bulan
sales_month = (
    df_elec
    .withColumn("month", F.date_format(F.col("date_parsed"), "yyyy-MM"))
    .groupBy("month")
    .agg(F.sum("total_price").alias("total_sales"))
    .orderBy("month")
)

# 2) Tren total unit terjual per bulan
unit_month = (
    df_elec
    .withColumn("month", F.date_format(F.col("date_parsed"), "yyyy-MM"))
    .groupBy("month")
    .agg(F.sum("quantity").alias("total_units"))
    .orderBy("month")
)

# 3) Penjualan berdasarkan hari
weekday_order = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
weekday_sales = (
    df_elec
    .groupBy("weekday")
    .agg(F.sum("total_price").alias("total_sales"))
)

# 4) Total penjualan per kategori
category_sales = (
    df_elec
    .groupBy("category")
    .agg(F.sum("total_price").alias("total_sales"))
    .orderBy(F.desc("total_sales"))
)

# 5) Top 10 produk berdasarkan total penjualan
top10_sales = (
    df_elec
    .groupBy("product_name")
    .agg(F.sum("total_price").alias("total_sales"))
    .orderBy(F.desc("total_sales"))
    .limit(10)
)

# 6) Top 10 produk berdasarkan total unit terjual
top10_units = (
    df_elec
    .groupBy("product_name")
    .agg(F.sum("quantity").alias("total_units"))
    .orderBy(F.desc("total_units"))
    .limit(10)
)

# 7) Perbandingan penjualan & stok per kategori
category_stock = (
    df_elec
    .groupBy("category")
    .agg(
        F.sum("total_price").alias("total_sales"),
        F.avg("stock_level").alias("avg_stock")
    )
)

# 8) Promo vs non-promo
promo_sales = (
    df_elec
    .groupBy("promo_flag")
    .agg(F.sum("total_price").alias("total_sales"))
)

# 9) Penjualan berdasarkan kota (total unit)
city_units = (
    df_elec
    .groupBy("city")
    .agg(F.sum("quantity").alias("total_units"))
    .orderBy(F.desc("total_units"))
)

# =========================
# D. REKOMENDASI STOK
# =========================
stock_reco_base = (
    df_elec
    .groupBy("category")
    .agg(
        F.sum("quantity").alias("total_units"),
        F.sum("total_price").alias("total_sales"),
        F.avg("stock_level").alias("avg_stock")
    )
)

# Pakai percentile 75 sebagai batas tinggi (guard saat data kosong)
if stock_reco_base.count() == 0:
    raise ValueError("Data kosong setelah filter. Cek kategori elektronik atau sumber data.")

p75_sales = stock_reco_base.approxQuantile("total_sales", [0.75], 0.01)[0]
p75_stock = stock_reco_base.approxQuantile("avg_stock", [0.75], 0.01)[0]

stock_reco = stock_reco_base.withColumn(
    "rekomendasi",
    F.when((F.col("total_sales") >= p75_sales) & (F.col("avg_stock") < p75_stock), F.lit("Tambah stok"))
     .when((F.col("total_sales") >= p75_sales) & (F.col("avg_stock") >= p75_stock), F.lit("Pertahankan stok"))
     .when((F.col("total_sales") < p75_sales) & (F.col("avg_stock") >= p75_stock), F.lit("Kurangi stok atau lakukan promosi"))
     .otherwise(F.lit("Stok cukup, pantau penjualan"))
).orderBy(F.desc("total_sales"))

display(stock_reco)


import pandas as pd
import matplotlib.pyplot as plt

palette = [
    "#1F77B4",
    "#FF7F0E",
    "#2CA02C",
    "#D62728",
    "#9467BD",
    "#8C564B",
    "#E377C2",
    "#7F7F7F",
    "#BCBD22",
    "#17BECF",
]

def add_bar_labels(ax, fmt="{:.0f}"):
    for p in ax.patches:
        value = p.get_height()
        ax.text(
            p.get_x() + p.get_width() / 2,
            value,
            fmt.format(value),
            ha="center",
            va="bottom",
            fontsize=9
        )

# 1) Tren total penjualan per bulan
pdf_sales_month = sales_month.toPandas()
plt.figure(figsize=(10,5))
plt.plot(
    pdf_sales_month["month"],
    pdf_sales_month["total_sales"],
    marker="o",
    color=palette[0]
)
plt.title("Tren Total Penjualan Produk Elektronik per Bulan")
plt.xlabel("Bulan")
plt.ylabel("Total Penjualan")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 2) Tren total unit terjual per bulan
pdf_unit_month = unit_month.toPandas()
plt.figure(figsize=(10,5))
plt.plot(
    pdf_unit_month["month"],
    pdf_unit_month["total_units"],
    marker="o",
    color=palette[1]
)
plt.title("Tren Total Unit Terjual per Bulan")
plt.xlabel("Bulan")
plt.ylabel("Total Unit")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 3) Total penjualan berdasarkan hari
pdf_weekday = weekday_sales.toPandas()
pdf_weekday["weekday"] = pd.Categorical(pdf_weekday["weekday"], categories=weekday_order, ordered=True)
pdf_weekday = pdf_weekday.sort_values("weekday")

plt.figure(figsize=(9,5))
plt.bar(pdf_weekday["weekday"], pdf_weekday["total_sales"], color=palette[2])
plt.title("Total Penjualan Berdasarkan Hari")
plt.xlabel("Hari")
plt.ylabel("Total Penjualan")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 4) Total penjualan per kategori (Rp miliar)
pdf_category = category_sales.toPandas()
pdf_category["total_sales_bil"] = pdf_category["total_sales"] / 1_000_000_000

category_colors = plt.cm.tab20(range(len(pdf_category)))

plt.figure(figsize=(9,5))
plt.bar(pdf_category["category"], pdf_category["total_sales_bil"], color=category_colors)
plt.title("Total Penjualan per Kategori (Rp Miliar)")
plt.xlabel("Kategori")
plt.ylabel("Total Penjualan (Rp Miliar)")
plt.xticks(rotation=45)
add_bar_labels(plt.gca(), fmt="{:.2f}")
plt.tight_layout()
plt.show()

# 5) Top 10 produk berdasarkan total penjualan
pdf_top10_sales = top10_sales.toPandas().sort_values("total_sales")
plt.figure(figsize=(10,6))
plt.barh(pdf_top10_sales["product_name"], pdf_top10_sales["total_sales"], color=palette[4])
plt.title("Top 10 Produk Elektronik Berdasarkan Total Penjualan")
plt.xlabel("Total Penjualan")
plt.ylabel("Produk")
plt.tight_layout()
plt.show()

# 6) Top 10 produk berdasarkan unit terjual
pdf_top10_units = top10_units.toPandas().sort_values("total_units")
plt.figure(figsize=(10,6))
plt.barh(pdf_top10_units["product_name"], pdf_top10_units["total_units"], color=palette[5])
plt.title("Top 10 Produk Elektronik Berdasarkan Unit Terjual")
plt.xlabel("Total Unit")
plt.ylabel("Produk")
plt.tight_layout()
plt.show()

# 7) Perbandingan penjualan dan stok per kategori
pdf_cat_stock = category_stock.toPandas().sort_values("total_sales", ascending=False)

fig, ax1 = plt.subplots(figsize=(10,5))
ax1.bar(
    pdf_cat_stock["category"],
    pdf_cat_stock["total_sales"],
    alpha=0.7,
    label="Total Penjualan",
    color=palette[6]
)
ax1.set_xlabel("Kategori")
ax1.set_ylabel("Total Penjualan")

ax2 = ax1.twinx()
ax2.plot(
    pdf_cat_stock["category"],
    pdf_cat_stock["avg_stock"],
    color=palette[1],
    marker="o",
    label="Avg Stock"
)
ax2.set_ylabel("Rata-rata Stock")

plt.title("Perbandingan Penjualan dan Stok per Kategori")
plt.xticks(rotation=45)
fig.tight_layout()
plt.show()

# 8) Promo vs non-promo
pdf_promo = promo_sales.toPandas()
pdf_promo["promo_flag"] = pdf_promo["promo_flag"].map({0: "Non-Promo", 1: "Promo"})

plt.figure(figsize=(6,4))
plt.bar(pdf_promo["promo_flag"], pdf_promo["total_sales"], color=[palette[7], palette[8]])
plt.title("Perbandingan Penjualan Promo dan Non-Promo")
plt.xlabel("Promo Flag")
plt.ylabel("Total Penjualan")
plt.tight_layout()
plt.show()

# 9) Total unit terjual berdasarkan kota (top 15)
pdf_city = city_units.toPandas().head(15)
plt.figure(figsize=(10,5))
plt.bar(pdf_city["city"], pdf_city["total_units"], color=palette[9])
plt.title("Total Unit Terjual Berdasarkan Kota")
plt.xlabel("Kota")
plt.ylabel("Total Unit")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()


top_category = category_sales.orderBy(F.desc("total_sales")).first()
top_month = sales_month.orderBy(F.desc("total_sales")).first()

print("=== INSIGHT OTOMATIS ===")
print(f"Kategori dengan penjualan tertinggi: {top_category['category']} (Total: {top_category['total_sales']:.2f})")
print(f"Bulan dengan penjualan tertinggi: {top_month['month']} (Total: {top_month['total_sales']:.2f})")

top_reco = stock_reco.filter(F.col("rekomendasi") == "Tambah stok").orderBy(F.desc("total_sales")).limit(1).collect()
if top_reco:
    print(f"Rekomendasi utama stok: Tambah stok pada kategori {top_reco[0]['category']}")
else:
    print("Tidak ada kategori prioritas 'Tambah stok' berdasarkan aturan saat ini.")