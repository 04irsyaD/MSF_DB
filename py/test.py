import pandas as pd
import random

# Parameter setup
years = [2023, 2024, 2025]
months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober"]
categories = ["HP", "Laptop", "TV", "Earphone", "Kamera"]
platforms = ["Tokopedia", "Shopee", "Lazada"]
city = "Bandung"

rows = []
for year in years:
    for month in months:
        if year == 2025 and month not in months[:10]:
            continue

        for category in random.sample(categories, k=random.randint(2, 3)):
            platform = random.choice(platforms)
            price = random.randint(1_000_000, 20_000_000)
            demand = random.randint(80, 1200)
            revenue = price * demand

            if month in ["Maret", "April"]:
                note = "Permintaan naik karena promo Ramadan"
            elif month in ["Juli", "Agustus"]:
                note = "Permintaan turun setelah libur sekolah"
            elif month == "Oktober":
                note = "Permintaan naik karena event 10.10"
            else:
                note = "Stabil"

            rows.append([year, month, city, category, platform, price, demand, revenue, note])

df_bandung = pd.DataFrame(rows, columns=[
    "Year", "Month", "City", "Category", "Platform",
    "Price_per_Unit", "Demand_Units", "Revenue", "Notes"
])

df_bandung.to_excel("Ecom_Electronics_Bandung_2023_2025.xlsx", index=False)
print("✅ File berhasil dibuat: Ecom_Electronics_Bandung_2023_2025.xlsx")
