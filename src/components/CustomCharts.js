import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CHART_COLORS = [
  '#bb86fc', // Purple
  '#03dac6', // Teal
  '#cf6679', // Coral Red
  '#ffb74d', // Orange
  '#4fc3f7', // Light Blue
  '#aed581', // Lime Green
  '#f06292'  // Pink
];

function ChartTooltip({ active, content, x, y }) {
  if (!active || !content) return null;
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        left: x + 15,
        top: y + 15,
        p: 1.5,
        bgcolor: 'rgba(30, 30, 30, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        pointerEvents: 'none',
        zIndex: 2000
      }}
    >
      {content}
    </Paper>
  );
}

/**
 * Custom SVG Line Trend Chart for Runs Scored over time (Year / Month)
 */
export function RunsTrendLineChart({ data }) {
  const [tooltip, setTooltip] = useState({ active: false, content: null, x: 0, y: 0 });

  if (!data || data.length === 0) {
    return <Typography color="text.secondary">No data to display trend.</Typography>;
  }

  const width = 500;
  const height = 220;
  const padding = 40;

  const yMax = Math.max(...data.map(d => d.totalRuns), 10);
  const maxAxisVal = Math.ceil(yMax / 10) * 10;

  // Generate SVG coordinates for each data point
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (d.totalRuns / maxAxisVal) * (height - 2 * padding);
    return { x, y, data: d };
  });

  // Construct SVG path string for the line
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const handleMouseMove = (e, p) => {
    setTooltip({
      active: true,
      content: (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.light' }}>{p.data.key}</Typography>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>Total Runs: <strong>{p.data.totalRuns}</strong></Typography>
        </Box>
      ),
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ active: false, content: null, x: 0, y: 0 });
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = height - padding - ratio * (height - 2 * padding);
          const gridVal = Math.round(ratio * maxAxisVal);
          return (
            <g key={index}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3,3" />
              <text x={padding - 10} y={y + 4} fill="rgba(255, 255, 255, 0.5)" fontSize="10" textAnchor="end">{gridVal}</text>
            </g>
          );
        })}

        {/* X-Axis labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - padding + 18} fill="rgba(255, 255, 255, 0.6)" fontSize="9" textAnchor="middle">
            {p.data.key}
          </text>
        ))}

        {/* The connecting trend line */}
        {data.length > 1 && (
          <path d={pathD} fill="none" stroke="#bb86fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Circular Data Markers */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#03dac6"
            stroke="#121212"
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'r 0.2s' }}
            onMouseMove={(e) => handleMouseMove(e, p)}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={(e) => {
              e.target.setAttribute('r', '8');
            }}
            onMouseOut={(e) => {
              e.target.setAttribute('r', '6');
            }}
          />
        ))}
      </svg>
      <ChartTooltip active={tooltip.active} content={tooltip.content} x={tooltip.x} y={tooltip.y} />
    </Box>
  );
}

/**
 * Custom SVG Side-by-Side Bar Chart for Batting Average and Runs per Dismissal
 */
export function AverageRunsBarChart({ data }) {
  const [tooltip, setTooltip] = useState({ active: false, content: null, x: 0, y: 0 });

  if (!data || data.length === 0) {
    return <Typography color="text.secondary">No data to display.</Typography>;
  }

  const width = 500;
  const height = 220;
  const padding = 40;

  // Max value calculation across both batting average and runs per dismissal
  const vals = data.flatMap(d => [
    d.battingAverage || 0,
    typeof d.runsPerDismissal === 'number' ? d.runsPerDismissal : 0
  ]);
  const yMax = Math.max(...vals, 10);
  const maxAxisVal = Math.ceil(yMax / 10) * 10;

  const barWidth = 14;
  const gap = 4;

  const handleMouseMove = (e, item, isSRD) => {
    const val = isSRD ? item.runsPerDismissal : item.battingAverage;
    const label = isSRD ? 'Runs per Dismissal' : 'Batting Average';
    setTooltip({
      active: true,
      content: (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: isSRD ? 'warning.main' : 'info.main' }}>{item.key}</Typography>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>{label}: <strong>{val}</strong></Typography>
        </Box>
      ),
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ active: false, content: null, x: 0, y: 0 });
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = height - padding - ratio * (height - 2 * padding);
          const gridVal = Math.round(ratio * maxAxisVal);
          return (
            <g key={index}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3,3" />
              <text x={padding - 10} y={y + 4} fill="rgba(255, 255, 255, 0.5)" fontSize="10" textAnchor="end">{gridVal}</text>
            </g>
          );
        })}

        {/* Columns and side-by-side bars mapping */}
        {data.map((d, i) => {
          const groupCenter = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
          
          // Height mapping
          const avgHeight = ((d.battingAverage || 0) / maxAxisVal) * (height - 2 * padding);
          const srdVal = typeof d.runsPerDismissal === 'number' ? d.runsPerDismissal : 0;
          const srdHeight = (srdVal / maxAxisVal) * (height - 2 * padding);

          const avgX = groupCenter - barWidth - gap / 2;
          const srdX = groupCenter + gap / 2;

          const baseLineY = height - padding;

          return (
            <g key={i}>
              {/* Bar 1: Batting Average (Light Blue) */}
              <rect
                x={avgX}
                y={baseLineY - avgHeight}
                width={barWidth}
                height={avgHeight}
                fill="#4fc3f7"
                rx="2"
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseMove={(e) => handleMouseMove(e, d, false)}
                onMouseLeave={handleMouseLeave}
              />

              {/* Bar 2: Runs / Dismissal (Orange) */}
              {srdVal > 0 && (
                <rect
                  x={srdX}
                  y={baseLineY - srdHeight}
                  width={barWidth}
                  height={srdHeight}
                  fill="#ffb74d"
                  rx="2"
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseMove={(e) => handleMouseMove(e, d, true)}
                  onMouseLeave={handleMouseLeave}
                />
              )}

              {/* X-Axis labels */}
              <text x={groupCenter} y={height - padding + 18} fill="rgba(255, 255, 255, 0.6)" fontSize="9" textAnchor="middle">
                {d.key}
              </text>
            </g>
          );
        })}
      </svg>
      <ChartTooltip active={tooltip.active} content={tooltip.content} x={tooltip.x} y={tooltip.y} />
    </Box>
  );
}

/**
 * Custom Polar-Coordinate Donut Chart for Dismissal Breakdowns
 */
export function DismissalDonutChart({ data }) {
  const [tooltip, setTooltip] = useState({ active: false, content: null, x: 0, y: 0 });

  if (!data || data.length === 0) {
    return <Typography color="text.secondary">No dismissals to display in chart.</Typography>;
  }

  const cx = 150;
  const cy = 110;
  const r = 80;
  const innerR = 50;

  const totalWickets = data.reduce((sum, d) => sum + d.count, 0);

  // Helper to convert polar coordinates to Cartesian
  const getCoordinates = (centerIdx, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerIdx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const handleMouseMove = (e, d) => {
    setTooltip({
      active: true,
      content: (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{d.type}</Typography>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>Dismissals: <strong>{d.count}</strong> ({d.percentage}%)</Typography>
        </Box>
      ),
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ active: false, content: null, x: 0, y: 0 });
  };

  let cumulativeAngle = 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4, position: 'relative' }}>
      <Box sx={{ width: 300, height: 220 }}>
        <svg width="100%" height="100%" viewBox="0 0 300 220" style={{ overflow: 'visible' }}>
          {totalWickets === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="#1e1e1e" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
          ) : (
            data.map((d, i) => {
              const sliceAngle = (d.count / totalWickets) * 360;
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + sliceAngle;
              cumulativeAngle = endAngle;

              // Large arc flag for polar coordinates
              const largeArcFlag = sliceAngle > 180 ? 1 : 0;

              // Out/In coordinates
              const outerStart = getCoordinates(cx, r, startAngle);
              const outerEnd = getCoordinates(cx, r, endAngle);
              const innerStart = getCoordinates(cx, innerR, startAngle);
              const innerEnd = getCoordinates(cx, innerR, endAngle);

              // Construct path string for the slice sector
              const pathD = [
                `M ${outerStart.x} ${outerStart.y}`,
                `A ${r} ${r} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
                `L ${innerEnd.x} ${innerEnd.y}`,
                `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
                'Z'
              ].join(' ');

              const color = CHART_COLORS[i % CHART_COLORS.length];

              return (
                <path
                  key={i}
                  d={pathD}
                  fill={color}
                  stroke="#121212"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseMove={(e) => handleMouseMove(e, d)}
                  onMouseLeave={handleMouseLeave}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.8';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '1';
                  }}
                />
              );
            })
          )}
        </svg>
      </Box>

      {/* Side Color Legend */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 200 }}>
        {data.map((d, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: CHART_COLORS[i % CHART_COLORS.length] }} />
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {d.type}: {d.count} ({d.percentage}%)
            </Typography>
          </Box>
        ))}
      </Box>
      <ChartTooltip active={tooltip.active} content={tooltip.content} x={tooltip.x} y={tooltip.y} />
    </Box>
  );
}

/**
 * Custom SVG Comparative Bar Chart (Side-by-Side metrics comparing Item A vs Item B)
 */
export function ComparativeBarChart({ itemA, itemB }) {
  const [tooltip, setTooltip] = useState({ active: false, content: null, x: 0, y: 0 });

  if (!itemA || !itemB) return null;

  const width = 500;
  const height = 220;
  const padding = 50;

  // Maximum value caps per metric group (to ensure runs and averages are scaled correctly)
  const maxRuns = Math.max(itemA.totalRuns || 0, itemB.totalRuns || 0, 10);
  const maxAverage = Math.max(itemA.battingAverage || 0, itemB.battingAverage || 0, 10);
  const maxSRD = Math.max(
    typeof itemA.runsPerDismissal === 'number' ? itemA.runsPerDismissal : 0,
    typeof itemB.runsPerDismissal === 'number' ? itemB.runsPerDismissal : 0,
    10
  );

  const categories = [
    { label: 'Total Runs', valA: itemA.totalRuns || 0, valB: itemB.totalRuns || 0, maxVal: maxRuns },
    { label: 'Runs / Dismissal', valA: typeof itemA.runsPerDismissal === 'number' ? itemA.runsPerDismissal : 0, valB: typeof itemB.runsPerDismissal === 'number' ? itemB.runsPerDismissal : 0, maxVal: maxSRD },
    { label: 'Runs / Inning', valA: itemA.battingAverage || 0, valB: itemB.battingAverage || 0, maxVal: maxAverage }
  ];

  const barWidth = 24;
  const groupGap = 100;

  const handleMouseMove = (e, val, label, itemKey, isA) => {
    setTooltip({
      active: true,
      content: (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: isA ? '#bb86fc' : '#03dac6' }}>{itemKey}</Typography>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>{label}: <strong>{val}</strong></Typography>
        </Box>
      ),
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ active: false, content: null, x: 0, y: 0 });
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Draw background lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = height - padding - ratio * (height - 2 * padding);
          return (
            <line key={idx} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 255, 255, 0.05)" />
          );
        })}

        {/* Categories (Runs, Average, Runs/Dismissal) */}
        {categories.map((cat, idx) => {
          const groupCenter = padding + 50 + idx * groupGap * 1.3;

          // Scaled heights per category
          const heightA = (cat.valA / cat.maxVal) * (height - 2 * padding);
          const heightB = (cat.valB / cat.maxVal) * (height - 2 * padding);

          const barX_A = groupCenter - barWidth - 2;
          const barX_B = groupCenter + 2;

          const baseLineY = height - padding;

          return (
            <g key={idx}>
              {/* Bar A (Purple) */}
              <rect
                x={barX_A}
                y={baseLineY - heightA}
                width={barWidth}
                height={heightA}
                fill="#bb86fc"
                rx="2"
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) => handleMouseMove(e, cat.valA, cat.label, itemA.key, true)}
                onMouseLeave={handleMouseLeave}
              />

              {/* Bar B (Teal) */}
              <rect
                x={barX_B}
                y={baseLineY - heightB}
                width={barWidth}
                height={heightB}
                fill="#03dac6"
                rx="2"
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) => handleMouseMove(e, cat.valB, cat.label, itemB.key, false)}
                onMouseLeave={handleMouseLeave}
              />

              {/* Labels below */}
              <text x={groupCenter} y={height - padding + 18} fill="rgba(255, 255, 255, 0.7)" fontSize="10" textAnchor="middle" fontWeight="bold">
                {cat.label}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend under chart */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#bb86fc' }} />
          <Typography variant="caption" color="text.secondary">{itemA.key}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: '#03dac6' }} />
          <Typography variant="caption" color="text.secondary">{itemB.key}</Typography>
        </Box>
      </Box>

      <ChartTooltip active={tooltip.active} content={tooltip.content} x={tooltip.x} y={tooltip.y} />
    </Box>
  );
}
