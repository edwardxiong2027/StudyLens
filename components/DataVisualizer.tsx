import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  ReferenceDot,
  Label
} from 'recharts';
import { ChartConfig, ChartType } from '../types';

interface DataVisualizerProps {
  config: ChartConfig | null;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ config }) => {
  const [selectedData, setSelectedData] = useState<{ name: string; value: number } | null>(null);

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 italic p-8 text-center border-2 border-dashed border-gray-700 rounded-xl">
        No specific data visualization applicable for this topic.
      </div>
    );
  }

  // Handle click on chart elements
  const handleDataClick = (data: any) => {
    // Recharts passes different objects based on component, but usually payload contains the data
    const payload = data && data.payload ? data.payload : data;
    if (payload && payload.name !== undefined && payload.value !== undefined) {
      setSelectedData({
        name: payload.name,
        value: payload.value
      });
    }
  };

  // Custom label component for the ReferenceDot to create the "tooltip above" effect
  const CustomReferenceLabel = (props: any) => {
    const { viewBox, value } = props;
    const { x, y } = viewBox;
    
    return (
      <g transform={`translate(${x},${y - 10})`}>
        <rect
          x={-50}
          y={-30}
          width={100}
          height={26}
          rx={4}
          fill="#0f172a"
          stroke="#22d3ee"
          strokeWidth={1}
        />
        <text
          x={0}
          y={-12}
          fill="#fff"
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          dy={3}
        >
          {value}
        </text>
        <path d="M-4,-4 L0,2 L4,-4 Z" fill="#22d3ee" transform="translate(0, 0)" />
      </g>
    );
  };

  const renderSelectedOverlay = () => {
    if (!selectedData) return null;
    return (
      <ReferenceDot
        x={selectedData.name}
        y={selectedData.value}
        r={6}
        fill="#facc15"
        stroke="#fff"
        strokeWidth={2}
        isFront={true}
      >
        <Label content={<CustomReferenceLabel value={`${selectedData.value}`} />} />
      </ReferenceDot>
    );
  };

  const renderChart = () => {
    switch (config.type) {
      case ChartType.LINE:
        return (
          <LineChart 
            data={config.data} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            onClick={() => setSelectedData(null)} // Click background to deselect
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#22d3ee' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#22d3ee" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0891b2', cursor: 'pointer', onClick: (props: any, e: any) => { e.stopPropagation(); handleDataClick(props); } }} 
              activeDot={{ r: 6, onClick: (props: any, e: any) => { e.stopPropagation(); handleDataClick(props); } }} 
              name={config.yAxisLabel} 
            />
            {renderSelectedOverlay()}
          </LineChart>
        );
      case ChartType.AREA:
        return (
          <AreaChart 
            data={config.data} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            onClick={() => setSelectedData(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#22d3ee" 
              fill="#06b6d4" 
              fillOpacity={0.3} 
              name={config.yAxisLabel}
              dot={{ r: 4, fill: '#0891b2', strokeWidth: 0, cursor: 'pointer', onClick: (props: any, e: any) => { e.stopPropagation(); handleDataClick(props); } }}
              activeDot={{ r: 6, onClick: (props: any, e: any) => { e.stopPropagation(); handleDataClick(props); } }}
            />
            {renderSelectedOverlay()}
          </AreaChart>
        );
      case ChartType.BAR:
      default:
        return (
          <BarChart 
            data={config.data} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            onClick={() => setSelectedData(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#334155', opacity: 0.4}}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="#22d3ee" 
              radius={[4, 4, 0, 0]} 
              name={config.yAxisLabel}
              onClick={(data, index, e) => {
                e.stopPropagation();
                handleDataClick(data);
              }}
              cursor="pointer"
            >
              {config.data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={selectedData?.name === entry.name ? '#facc15' : '#22d3ee'} 
                />
              ))}
            </Bar>
            {renderSelectedOverlay()}
          </BarChart>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{config.title}</h3>
          <p className="text-sm text-gray-400">{config.explanation}</p>
        </div>
        {selectedData && (
          <div className="hidden sm:block text-right bg-slate-800/80 px-3 py-1.5 rounded-lg border border-yellow-500/30 animate-in fade-in">
            <div className="text-xs text-yellow-500 uppercase font-bold tracking-wider">Selected</div>
            <div className="text-sm font-semibold text-white">
              {selectedData.name}: <span className="text-yellow-400">{selectedData.value}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow min-h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
        <span>AI Generated Data Projection</span>
        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
        <span className="text-cyan-600">Click points to inspect</span>
      </div>
    </div>
  );
};
