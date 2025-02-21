// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MetricsCard from './MetricsCard';
import CpuUsageGraph from './CpuUsageGraph';
import DetailedCpuMetrics from './DetailedCpuMetrics';
import ProcessMonitoring from './ProcessMonitoring';
// Connect to Socket.io server
const socket = io('https://tracker-w7pa.onrender.com', {
  transports: ['websocket', 'polling'], // Ensures compatibility
});

// Helper function for dynamic color in Disk Usage progress bars
{console.log(socket)}
const getUsageColor = (used, size) => {
  const usagePercentage = (used / size) * 100;
  if (usagePercentage < 50) return 'bg-green-500';
  if (usagePercentage < 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

const Dashboard = () => {
    const [metrics, setMetrics] = useState({});
  
    // Fetch data manually
    const fetchMetrics = () => {
      socket.emit('getMetrics');
    };
  
    useEffect(() => {
      socket.on('systemMetrics', (data) => {
        setMetrics(data);
      });
  
      // Fetch initial data
      fetchMetrics();
  
      // Cleanup
      return () => {
        socket.off('systemMetrics');
      };
    }, []);
  
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">System Monitoring Dashboard</h1>
            <button
              onClick={fetchMetrics}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
            >
              Refresh Data
            </button>
          </div>
  
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <MetricsCard 
              title="CPU Details" 
              icon="💻" 
              data={[
                `Model: ${metrics.cpu?.model}`,
                `Speed: ${metrics.cpu?.speed} GHz`,
                `Cores: ${metrics.cpu?.cores}`,
                `Architecture: ${metrics.cpu?.architecture}`
              ]} 
            />
            <MetricsCard 
              title="Memory Usage" 
              icon="🧠" 
              data={[
                `Total: ${metrics.memory?.total} GB`,
                `Used: ${metrics.memory?.used} GB`
              ]} 
            />
            <MetricsCard 
              title="OS Information" 
              icon="🖥️" 
              data={[
                `Platform: ${metrics.os?.platform}`,
                `Distro: ${metrics.os?.distro}`,
                `Release: ${metrics.os?.release}`
              ]} 
            />
            <MetricsCard 
              title="Disk Usage" 
              icon="💾" 
              data={
                metrics.disk?.map((d, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="text-lg font-medium">{d.mount}</h4>
                    <div className="text-sm text-gray-600 mb-1">
                      {`Used: ${d.used} GB / ${d.size} GB`}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-300 ${getUsageColor(d.used, d.size)}`} 
                        style={{ width: `${(d.used / d.size) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              } 
            />
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <CpuUsageGraph />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <DetailedCpuMetrics />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
    <ProcessMonitoring />
  </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  