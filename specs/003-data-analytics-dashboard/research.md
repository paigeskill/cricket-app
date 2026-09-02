# Research and Technical Decisions: Custom SVG-Based Charting Engine

To comply with the project constitution's mandate for **Simplicity** and support React 19 cleanly with zero external dependency bloat, this feature implements custom responsive SVG-based line, bar, and donut charts. This document outlines the mathematical scaling formulas and state overlay designs developed in Phase 0.

## 1. Linear Coordinate Scaling Math (Line & Bar Charts)

To plot statistical data points (such as Runs Scored or Batting Averages) on an SVG canvas of dimensions $W \times H$ (e.g., $500 \text{px} \times 300 \text{px}$), we map the data values linearly.

### Y-Axis Scaling (Value Mapping)
Let $y_{\min} = 0$, and $y_{\max}$ be the maximum statistical value in the filtered dataset (e.g., highest runs or highest average, rounded up to the nearest multiple of 10 for margin).
We map each data value $v$ to an SVG canvas Y-coordinate $Y_{\text{svg}}$ (accounting for an offset padding $P = 30\text{px}$):
$$Y_{\text{svg}} = (H - P) - \left( \frac{v - y_{\min}}{y_{\max} - y_{\min}} \right) \times (H - 2P)$$
*Note*: We subtract from $H - P$ because the SVG Y-axis increases downwards, whereas statistical values increase upwards.

### X-Axis Scaling (Item Index Mapping)
For $N$ data items (such as months or clubs), we partition the X-axis:
$$X_{\text{svg}} = P + \left( \frac{i}{N - 1} \right) \times (W - 2P)$$
where $i$ is the index of the active data item ($0 \le i < N$).

---

## 2. Polar Coordinate Path Calculations (Donut/Pie Slices)

For the Dismissal percentage breakdown donut chart, each slice represents a fraction of the total wickets lost ($360^\circ$ circle).

To render an SVG arc path, we calculate the coordinates of the slice boundary points on the circle circumference using polar-to-rectangular trigonometry:
$$x = C_x + r \cos(\theta), \quad y = C_y + r \sin(\theta)$$
where:
- $(C_x, C_y)$ is the circle center (e.g., $150, 150$).
- $r$ is the outer radius (e.g., $100\text{px}$).
- $\theta$ is the angle in radians corresponding to the slice cumulative percentage.

### Inner Cutout (Donut Style)
An inner radius $r_{\text{inner}} = 60\text{px}$ creates the donut shape by drawing an outer arc, a line to the inner radius, an inner arc back, and closing the path, ensuring a premium-grade aesthetic.

---

## 3. Interactive State Tooltips

To display tooltips on mouse hover:
- Each bar/point in the SVG is wrapped with React events: `onMouseMove={(e) => handleMouseMove(e, dataPoint)}` and `onMouseLeave={handleMouseLeave}`.
- When hovered, the tooltip state records the screen coordinates `(clientX, clientY)` and the value, rendering a floating dark-themed HTML overlay near the pointer:
  ```javascript
  <Box sx={{ position: 'fixed', left: x + 15, top: y + 10, bgcolor: 'rgba(0,0,0,0.85)', p: 1, borderRadius: 1 }} />
  ```
- This is extremely lightweight, requires no Canvas engines or charting libraries, and handles rapid movements smoothly.
