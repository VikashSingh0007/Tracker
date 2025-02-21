// src/components/CpuUsageGraph.jsx
import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { io } from 'socket.io-client';

// Connect to Socket.io server
const socket = io('http://localhost:4000');

const CpuUsageGraph = () => {
  const [cpuData, setCpuData] = useState([]);

  useEffect(() => {
    // Listen for system metrics updates
    socket.on('systemMetrics', (data) => {
      const usage = {
        time: new Date().toLocaleTimeString(),
        speed: data.cpu?.speed
      };
      setCpuData(prevData => [...prevData.slice(-9), usage]);
    });

    return () => {
      socket.off('systemMetrics');
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl rounded-2xl p-6 col-span-3 text-white">
      <h3 className="text-2xl font-bold mb-4 text-center">
        CPU Speed (GHz) - Live Usage
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={cpuData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#4b5563" strokeDasharray="5 5" />
          <XAxis dataKey="time" tick={{ fill: '#d1d5db' }} />
          <YAxis 
            tick={{ fill: '#d1d5db' }} 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white'
            }}
          />
          <Line 
            type="stepAfter" 
            dataKey="speed" 
            stroke="#34d399" 
            strokeWidth={4} 
            dot={{ r: 5, stroke: '#34d399', fill: '#10b981' }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
      
    </div>
    
  );
};

export default CpuUsageGraph;
