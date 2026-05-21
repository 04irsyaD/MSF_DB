"""
logistics_vehicle_assignment.py

Analisis sederhana penugasan kendaraan per rute/kota.
- Menghitung metrik dasar kendaraan dan rute
- Menentukan rekomendasi kendaraan terbaik per rute
- Membuat grafik batang sederhana untuk visualisasi

Output:
- assignment_scores.csv
- assignment_recommendations.csv
- assignment_bar_chart.png

Cara pakai:
	python logistics_vehicle_assignment.py
"""

from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass
class Vehicle:
	vehicle_id: str
	distance_km: float
	idle_time_minutes: float
	fuel_consumed_l: float

	@property
	def fuel_per_km(self) -> float:
		return self.fuel_consumed_l / self.distance_km

	@property
	def idle_per_100km(self) -> float:
		return self.idle_time_minutes / self.distance_km * 100


@dataclass
class Route:
	route_id: str
	start_city: str
	end_city: str
	distance_km: float
	estimated_time_minutes: float

	@property
	def avg_speed_kmph(self) -> float:
		return self.distance_km / (self.estimated_time_minutes / 60.0)

	@property
	def route_type(self) -> str:
		return "urban" if self.avg_speed_kmph < 35 else "intercity"


def load_sample_data() -> Tuple[List[Vehicle], List[Route]]:
	vehicles = [
		Vehicle("V001", 1200, 90, 100),
		Vehicle("V002", 950, 45, 80),
		Vehicle("V003", 1300, 60, 110),
	]
	routes = [
		Route("R01", "Jakarta", "Tangerang", 50, 90),
		Route("R02", "Bandung", "Semarang", 300, 420),
		Route("R03", "Surabaya", "Malang", 120, 180),
	]
	return vehicles, routes


def normalize(values: List[float]) -> List[float]:
	minimum = min(values)
	maximum = max(values)
	if maximum == minimum:
		return [0.5 for _ in values]
	return [(v - minimum) / (maximum - minimum) for v in values]


def score_vehicle_for_route(vehicle: Vehicle, route: Route, vehicle_pool: List[Vehicle]) -> float:
	fuel_norm = normalize([v.fuel_per_km for v in vehicle_pool])
	idle_norm = normalize([v.idle_per_100km for v in vehicle_pool])

	idx = vehicle_pool.index(vehicle)
	fuel_component = 1 - fuel_norm[idx]
	idle_component = 1 - idle_norm[idx]

	# route speed fit: makin dekat ke 40-60 km/jam, makin baik
	speed = route.avg_speed_kmph
	speed_fit = max(0.0, 1 - abs(speed - 50) / 50)

	if route.route_type == "urban":
		return 0.25 * fuel_component + 0.55 * idle_component + 0.20 * speed_fit
	return 0.45 * fuel_component + 0.25 * idle_component + 0.30 * speed_fit


def evaluate_assignments(vehicles: List[Vehicle], routes: List[Route]):
	all_scores = []
	best_per_route = []

	for route in routes:
		route_scores = []
		for vehicle in vehicles:
			score = score_vehicle_for_route(vehicle, route, vehicles)
			route_scores.append((vehicle, score))

			all_scores.append(
				{
					"Route_ID": route.route_id,
					"Start_City": route.start_city,
					"End_City": route.end_city,
					"Route_Type": route.route_type,
					"Vehicle_ID": vehicle.vehicle_id,
					"Score": round(score, 6),
				}
			)

		best_vehicle, best_score = max(route_scores, key=lambda x: x[1])
		best_per_route.append(
			{
				"Route_ID": route.route_id,
				"Start_City": route.start_city,
				"End_City": route.end_city,
				"Vehicle_ID": best_vehicle.vehicle_id,
				"Score": round(best_score, 6),
			}
		)

	return all_scores, best_per_route


def save_csv(path: str, rows: List[Dict[str, object]], fieldnames: List[str]) -> None:
	with open(path, "w", newline="", encoding="utf-8") as f:
		writer = csv.DictWriter(f, fieldnames=fieldnames)
		writer.writeheader()
		writer.writerows(rows)


def plot_bar_chart(best_per_route: List[Dict[str, object]], output_path: str = "assignment_bar_chart.svg") -> None:
	"""Buat grafik batang sederhana dalam format SVG tanpa library tambahan."""
	width = 900
	height = 500
	margin_left = 90
	margin_right = 30
	margin_top = 50
	margin_bottom = 90

	chart_w = width - margin_left - margin_right
	chart_h = height - margin_top - margin_bottom

	labels = [f"{row['Route_ID']} {row['Start_City']}→{row['End_City']}" for row in best_per_route]
	scores = [row["Score"] for row in best_per_route]
	vehicles = [row["Vehicle_ID"] for row in best_per_route]
	max_score = max(scores) if scores else 1.0
	n = len(scores)
	bar_gap = 30
	bar_w = max(40, (chart_w - (n - 1) * bar_gap) / n) if n else 40

	colors = ["#4C78A8", "#F58518", "#54A24B", "#E45756", "#72B7B2"]

	svg = [
		f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
		'<rect width="100%" height="100%" fill="white"/>',
		f'<text x="{width/2}" y="28" text-anchor="middle" font-size="20" font-family="Arial" fill="#222">Rekomendasi Kendaraan Terbaik per Rute</text>',
	]

	# axis
	axis_x = margin_left
	axis_y = margin_top + chart_h
	svg.append(f'<line x1="{axis_x}" y1="{margin_top}" x2="{axis_x}" y2="{axis_y}" stroke="#444" stroke-width="2"/>')
	svg.append(f'<line x1="{axis_x}" y1="{axis_y}" x2="{width - margin_right}" y2="{axis_y}" stroke="#444" stroke-width="2"/>')

	# y ticks
	for tick in [0.0, 0.25, 0.5, 0.75, 1.0]:
		y = axis_y - tick * chart_h
		svg.append(f'<line x1="{axis_x - 5}" y1="{y:.1f}" x2="{axis_x}" y2="{y:.1f}" stroke="#444" stroke-width="1"/>')
		svg.append(
			f'<text x="{axis_x - 10}" y="{y + 4:.1f}" text-anchor="end" font-size="11" font-family="Arial" fill="#444">{tick:.2f}</text>'
		)
		svg.append(f'<line x1="{axis_x}" y1="{y:.1f}" x2="{width - margin_right}" y2="{y:.1f}" stroke="#eee" stroke-width="1"/>')

	# bars
	for i, (label, score, vehicle_id) in enumerate(zip(labels, scores, vehicles)):
		x = axis_x + i * (bar_w + bar_gap)
		bar_h = (score / max_score) * chart_h if max_score else 0
		y = axis_y - bar_h
		color = colors[i % len(colors)]
		svg.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_w:.1f}" height="{bar_h:.1f}" fill="{color}" rx="4" ry="4"/>')
		svg.append(f'<text x="{x + bar_w/2:.1f}" y="{y - 8:.1f}" text-anchor="middle" font-size="12" font-family="Arial" fill="#222">{score:.3f}</text>')
		svg.append(f'<text x="{x + bar_w/2:.1f}" y="{axis_y + 18:.1f}" text-anchor="middle" font-size="12" font-family="Arial" fill="#222">{vehicle_id}</text>')

		# wrapped label under x axis
		label_lines = label.split(" ", 1)
		svg.append(f'<text x="{x + bar_w/2:.1f}" y="{axis_y + 36:.1f}" text-anchor="middle" font-size="10" font-family="Arial" fill="#444">{label_lines[0]}</text>')
		if len(label_lines) > 1:
			svg.append(f'<text x="{x + bar_w/2:.1f}" y="{axis_y + 50:.1f}" text-anchor="middle" font-size="10" font-family="Arial" fill="#444">{label_lines[1]}</text>')

	svg.append('</svg>')

	with open(output_path, 'w', encoding='utf-8') as f:
		f.write('\n'.join(svg))

	print(f"Bar chart saved to {output_path}")


def print_diagram() -> None:
	diagram = """
[Vehicles]   [Routes]
	\          /
	 \        /
	  [Hitung Score]
			|
	  [Pilih Kendaraan]
			|
   [Output + Bar Chart]
"""
	print("\nSimple diagram:\n")
	print(diagram)


def main() -> None:
	vehicles, routes = load_sample_data()
	all_scores, best_per_route = evaluate_assignments(vehicles, routes)

	print("\nTop rekomendasi kendaraan per rute:")
	print("Route_ID  Start_City  End_City    Vehicle_ID  Score")
	for row in best_per_route:
		print(
			f"{row['Route_ID']:<8} {row['Start_City']:<10} {row['End_City']:<10} "
			f"{row['Vehicle_ID']:<10} {row['Score']:.6f}"
		)

	save_csv(
		"assignment_scores.csv",
		all_scores,
		["Route_ID", "Start_City", "End_City", "Route_Type", "Vehicle_ID", "Score"],
	)
	save_csv(
		"assignment_recommendations.csv",
		best_per_route,
		["Route_ID", "Start_City", "End_City", "Vehicle_ID", "Score"],
	)

	plot_bar_chart(best_per_route)
	print_diagram()


if __name__ == "__main__":
	main()
