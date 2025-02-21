// src/components/DetailedCpuMetrics.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// Connect to Socket.io server
const socket = io('https://tracker-w7pa.onrender.com');

const DetailedCpuMetrics = () => {
  const [cpuMetrics, setCpuMetrics] = useState([]);
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    socket.on('systemMetrics', (data) => {
      setTemperature(data.cpu?.temperature);
      const metric = {
        time: new Date().toLocaleTimeString(),
        load: data.cpu?.load
      };
      setCpuMetrics(prevData => [...prevData.slice(-9), metric]);
    });

    return () => {
      socket.off('systemMetrics');
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 shadow-2xl rounded-2xl p-6 col-span-3 text-white">
      <h3 className="text-2xl font-bold mb-4 text-center">
        CPU Load & Temperature
      </h3>
      <p className="text-center mb-4">
        Temperature: {temperature}°C
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={cpuMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#4b5563" strokeDasharray="5 5" />
          <XAxis dataKey="time" tick={{ fill: '#d1d5db' }} />
          <YAxis tick={{ fill: '#d1d5db' }} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="load" 
            stroke="#f87171" 
            strokeWidth={4} 
            dot={{ r: 5, stroke: '#f87171', fill: '#ef4444' }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailedCpuMetrics;
