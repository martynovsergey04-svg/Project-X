import React from 'react';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
}

export default function CandlestickChart({ data, height = 300 }: CandlestickChartProps) {
  if (!data || data.length === 0) return <div className="text-slate-500 font-mono text-xs">Нет данных</div>;

  const padding = 20;
  
  // Find min and max
  const maxHigh = Math.max(...data.map(d => d.high));
  const minLow = Math.min(...data.map(d => d.low));
  
  // Add some breathing room
  const range = maxHigh - minLow || 1;
  const chartMax = maxHigh + range * 0.1;
  const chartMin = minLow - range * 0.1;
  
  const getY = (val: number) => {
    return padding + (height - padding * 2) * (1 - (val - chartMin) / (chartMax - chartMin));
  };
  
  return (
    <div className="w-full relative overflow-hidden" style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grid-pattern" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Basic Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
          const y = padding + (height - padding * 2) * fraction;
          return (
             <line key={fraction} x1="0" y1={y} x2="100%" y2={y} stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
          );
        })}

        {/* Candlesticks */}
        {data.map((candle, i) => {
          const numSlots = Math.max(data.length, 12); // Minimum 12 slots for visual balance
          const candleWidthPercent = 100 / numSlots;
          const candleCenterPercent = (i + 0.5) * candleWidthPercent;
          
          const isUp = candle.close >= candle.open;
          const color = isUp ? "#10b981" : "#ef4444"; // emerald-500 : red-500
          
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          
          const bodyTopY = isUp ? closeY : openY;
          const bodyBottomY = isUp ? openY : closeY;
          const bodyHeight = Math.max(1, bodyBottomY - bodyTopY); // At least 1px

          return (
            <g key={i}>
              {/* Wick */}
              <line 
                x1={`${candleCenterPercent}%`} 
                y1={highY} 
                x2={`${candleCenterPercent}%`} 
                y2={lowY} 
                stroke={color} 
                strokeWidth="1.5"
              />
              {/* Body */}
              <rect
                x={`${i * candleWidthPercent + (candleWidthPercent * 0.1)}%`}
                y={bodyTopY}
                width={`${candleWidthPercent * 0.8}%`}
                height={bodyHeight}
                fill={color}
                stroke={color}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Price Labels (Right aligned roughly) */}
      <div className="absolute right-2 top-0 h-full flex flex-col justify-between py-[20px] pointer-events-none text-[9px] font-mono text-slate-500">
         <span>${chartMax.toFixed(2)}</span>
         <span>${((chartMax + chartMin) / 2).toFixed(2)}</span>
         <span>${chartMin.toFixed(2)}</span>
      </div>
    </div>
  );
}
