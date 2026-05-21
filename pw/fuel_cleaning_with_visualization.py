from pyspark.sql import functions as F
from pyspark.sql import types as T
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Set style untuk visualisasi yang lebih baik
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (24, 16)
plt.rcParams['font.size'] = 12

# =========================
# CONFIG
# =========================
source_table = "teamassgement.cleandata.fuel_dataset_1000_rows_v_2"
target_table = "teamassgement.cleandata.fuel_dataset_clean"

df_raw = spark.table(source_table)

# =========================
# 0) Trim string dulu (biar parsing date lebih stabil)
# =========================
string_cols = [c.name for c in df_raw.schema.fields if isinstance(c.dataType, T.StringType)]

df = df_raw
for c in string_cols:
    df = df.withColumn(c, F.trim(F.col(c)))

# =========================
# 1) Profiling awal (AMAN: pakai try_to_date)
# =========================
row_before = df.count()

df_check = df.withColumn(
    "Date_parsed_tmp",
    F.coalesce(
        F.expr("try_to_date(Date, 'yyyy-MM-dd')"),
        F.expr("try_to_date(Date, 'dd-MM-yyyy')"),
        F.expr("try_to_date(Date, 'MM/dd/yyyy')")
    )
)

invalid_date_count = df_check.filter(
    F.col("Date").isNotNull() & F.col("Date_parsed_tmp").isNull()
).count()

null_key_count = df.filter(
    F.col("Date").isNull() |
    F.col("Fuel_Type").isNull() |
    F.col("Price").isNull() |
    F.col("Location").isNull()
).count()

dup_keys = ["Date", "Fuel_Type", "Price", "Location", "Station_Brand", "Payment_Method", "Volume_Liters"]
dup_group_count_before = (
    df.groupBy(*dup_keys)
      .count()
      .filter(F.col("count") > 1)
      .count()
)

print("="*50)
print("=== PROFILING AWAL ===")
print("="*50)
print("Total row                :", row_before)
print("Row Date invalid         :", invalid_date_count)
print("Row null kolom wajib     :", null_key_count)
print("Jumlah grup duplikat     :", dup_group_count_before)
print("="*50)

# =========================
# 2) Cleansing
# =========================
# Standardisasi Date -> yyyy-MM-dd (AMAN: try_to_date)
df_clean = (
    df
    .withColumn(
        "Date_parsed",
        F.coalesce(
            F.expr("try_to_date(Date, 'yyyy-MM-dd')"),
            F.expr("try_to_date(Date, 'dd-MM-yyyy')"),
            F.expr("try_to_date(Date, 'MM/dd/yyyy')")
        )
    )
    .withColumn("Date", F.date_format(F.col("Date_parsed"), "yyyy-MM-dd"))
    .drop("Date_parsed")
)

# Lowercase sesuai requirement
df_clean = (
    df_clean
    .withColumn("Fuel_Type", F.lower(F.col("Fuel_Type")))
    .withColumn("Station_Brand", F.lower(F.col("Station_Brand")))
    .withColumn("Payment_Method", F.lower(F.col("Payment_Method")))
)

# Hapus null kolom wajib
df_clean = df_clean.filter(
    F.col("Date").isNotNull() &
    F.col("Fuel_Type").isNotNull() &
    F.col("Price").isNotNull() &
    F.col("Location").isNotNull()
)

# Hapus duplikat
df_clean = df_clean.dropDuplicates()

# =========================
# 3) Validasi akhir + simpan
# =========================
row_after = df_clean.count()

dup_group_count_after = (
    df_clean.groupBy(*dup_keys)
            .count()
            .filter(F.col("count") > 1)
            .count()
)

null_key_count_after = df_clean.filter(
    F.col("Date").isNull() |
    F.col("Fuel_Type").isNull() |
    F.col("Price").isNull() |
    F.col("Location").isNull()
).count()

print("=== HASIL CLEANING ===")
print("Total row sesudah cleaning :", row_after)
print("Row terhapus               :", row_before - row_after)
print("Grup duplikat akhir        :", dup_group_count_after)
print("Null key column akhir      :", null_key_count_after)
print("="*50)

df_clean.write.mode("overwrite").format("delta").saveAsTable(target_table)
print("✓ Saved ke:", target_table)
print()

# =========================
# 4) VISUALISASI DATA
# =========================
print("Generating visualizations...")

# Konvert ke pandas untuk visualization
df_pandas = df_clean.toPandas()

# Create figure dengan subplot - UKURAN BESAR
fig = plt.figure(figsize=(24, 16))
fig.suptitle('📊 FUEL DATASET - COMPREHENSIVE DATA QUALITY & ANALYSIS REPORT', 
             fontsize=20, fontweight='bold', y=0.995)

# ===== 1) BAR CHART - Data Quality Summary =====
ax1 = plt.subplot(2, 3, 1)
quality_data = pd.DataFrame({
    'Status': ['Sebelum Cleaning', 'Sesudah Cleaning', 'Data Terhapus'],
    'Jumlah Row': [row_before, row_after, row_before - row_after]
})
colors = ['#FF6B6B', '#4ECDC4', '#FFE66D']
bars = ax1.bar(quality_data['Status'], quality_data['Jumlah Row'], color=colors, edgecolor='black', linewidth=1.5)
ax1.set_title('📊 Data Quality Summary\n(Sebelum vs Sesudah Cleaning)', fontsize=16, fontweight='bold', pad=15)
ax1.set_ylabel('Jumlah Row', fontsize=13, fontweight='bold')
for bar in bars:
    height = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}',
             ha='center', va='bottom', fontweight='bold', fontsize=12)
ax1.grid(axis='y', alpha=0.3)

# ===== 2) BAR CHART - Fuel Type Distribution =====
ax2 = plt.subplot(2, 3, 2)
fuel_dist = df_pandas['Fuel_Type'].value_counts().head(10)
colors_fuel = sns.color_palette("husl", len(fuel_dist))
bars = ax2.barh(fuel_dist.index, fuel_dist.values, color=colors_fuel, edgecolor='black', linewidth=1)
ax2.set_title('⛽ Distribusi Tipe Bahan Bakar\n(Top 10)', fontsize=16, fontweight='bold', pad=15)
ax2.set_xlabel('Jumlah Records', fontsize=13, fontweight='bold')
for i, bar in enumerate(bars):
    width = bar.get_width()
    ax2.text(width, bar.get_y() + bar.get_height()/2.,
             f' {int(width)}',
             ha='left', va='center', fontweight='bold', fontsize=11)
ax2.grid(axis='x', alpha=0.3)

# ===== 3) BAR CHART - Top Lokasi =====
ax3 = plt.subplot(2, 3, 3)
location_dist = df_pandas['Location'].value_counts().head(10)
colors_loc = sns.color_palette("Set2", len(location_dist))
bars = ax3.bar(range(len(location_dist)), location_dist.values, color=colors_loc, edgecolor='black', linewidth=1)
ax3.set_title('📍 Top 10 Lokasi Pernyalaan\n(Fuel Stations)', fontsize=16, fontweight='bold', pad=15)
ax3.set_ylabel('Jumlah Records', fontsize=13, fontweight='bold')
ax3.set_xticks(range(len(location_dist)))
ax3.set_xticklabels(location_dist.index, rotation=45, ha='right', fontsize=11)
for bar in bars:
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}',
             ha='center', va='bottom', fontweight='bold', fontsize=12)
ax3.grid(axis='y', alpha=0.3)

# ===== 4) BAR CHART - Payment Method =====
ax4 = plt.subplot(2, 3, 4)
payment_dist = df_pandas['Payment_Method'].value_counts()
colors_payment = sns.color_palette("Set1", len(payment_dist))
bars = ax4.bar(payment_dist.index, payment_dist.values, color=colors_payment, edgecolor='black', linewidth=1.5)
ax4.set_title('💳 Distribusi Metode Pembayaran', fontsize=16, fontweight='bold', pad=15)
ax4.set_ylabel('Jumlah Records', fontsize=13, fontweight='bold')
ax4.set_xticklabels(payment_dist.index, rotation=45, ha='right')
for bar in bars:
    height = bar.get_height()
    ax4.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}',
             ha='center', va='bottom', fontweight='bold')
ax4.grid(axis='y', alpha=0.3)

# ===== 5) BAR CHART - Station Brand =====
ax5 = plt.subplot(2, 3, 5)
brand_dist = df_pandas['Station_Brand'].value_counts().head(10)
colors_brand = sns.color_palette("coolwarm", len(brand_dist))
bars = ax5.barh(brand_dist.index, brand_dist.values, color=colors_brand, edgecolor='black', linewidth=1)
ax5.set_title('🏪 Top 10 Brand Stasiun\n(Fuel Stations)', fontsize=16, fontweight='bold', pad=15)
ax5.set_xlabel('Jumlah Records', fontsize=13, fontweight='bold')
for i, bar in enumerate(bars):
    width = bar.get_width()
    ax5.text(width, bar.get_y() + bar.get_height()/2.,
             f' {int(width)}',
             ha='left', va='center', fontweight='bold', fontsize=11)
ax5.grid(axis='x', alpha=0.3)

# ===== 6) Data Quality Issues =====
ax6 = plt.subplot(2, 3, 6)
ax6.axis('off')
quality_text = f"""
📋 DATA QUALITY REPORT

✓ Total Records (Cleaned)    : {row_after:,}
✓ Records Removed            : {row_before - row_after:,}
✓ Invalid Dates              : {invalid_date_count}
✓ Null Key Columns           : {null_key_count}
✓ Duplicate Groups (Before)  : {dup_group_count_before}
✓ Duplicate Groups (After)   : {dup_group_count_after}

📊 Data Distribution
• Unique Fuel Types          : {df_pandas['Fuel_Type'].nunique()}
• Unique Locations           : {df_pandas['Location'].nunique()}
• Unique Brands              : {df_pandas['Station_Brand'].nunique()}
• Payment Methods            : {df_pandas['Payment_Method'].nunique()}

💰 Price Statistics
• Min Price                  : Rp {df_pandas['Price'].min():,.2f}
• Max Price                  : Rp {df_pandas['Price'].max():,.2f}
• Avg Price                  : Rp {df_pandas['Price'].mean():,.2f}
• Median Price               : Rp {df_pandas['Price'].median():,.2f}
"""
ax6.text(0.05, 0.95, quality_text, transform=ax6.transAxes,
         fontsize=12, verticalalignment='top', family='monospace', fontweight='bold',
         bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.7, edgecolor='black', linewidth=2))

plt.tight_layout()
plt.savefig('/dbfs/FileStore/fuel_analysis_visualization.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ Visualization saved to: /dbfs/FileStore/fuel_analysis_visualization.png")
plt.show()

# =========================
# 5) SUMMARY TABEL
# =========================
print("\n" + "="*50)
print("=== SAMPLE DATA (20 Row Pertama) ===")
print("="*50)
display(df_clean.limit(20))

# Summary statistics per Fuel Type
print("\n" + "="*50)
print("=== SUMMARY STATISTIK PER FUEL TYPE ===")
print("="*50)
summary_fuel = df_clean.groupBy("Fuel_Type").agg(
    F.count("*").alias("Total_Records"),
    F.round(F.avg("Price"), 2).alias("Avg_Price"),
    F.min("Price").alias("Min_Price"),
    F.max("Price").alias("Max_Price"),
    F.round(F.avg("Volume_Liters"), 2).alias("Avg_Volume")
).orderBy(F.desc("Total_Records"))
display(summary_fuel)

# Summary per Location
print("\n" + "="*50)
print("=== SUMMARY STATISTIK PER LOKASI (Top 10) ===")
print("="*50)
summary_location = df_clean.groupBy("Location").agg(
    F.count("*").alias("Total_Records"),
    F.round(F.avg("Price"), 2).alias("Avg_Price"),
    F.countDistinct("Fuel_Type").alias("Jenis_Fuel")
).orderBy(F.desc("Total_Records")).limit(10)
display(summary_location)

print("\n✅ PROSES DATA CLEANING DAN VISUALISASI SELESAI!")
