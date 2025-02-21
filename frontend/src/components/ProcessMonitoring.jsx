// src/components/ProcessMonitoring.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://tracker-w7pa.onrender.com0');

const ProcessMonitoring = () => {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    socket.on('systemMetrics', (data) => {
      // Ensure data exists and has the required structure
      if (data && data.processes && data.processes.list) {
        setProcesses(data.processes.list);
      }
    });

    return () => {
      socket.off('systemMetrics');
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-2xl rounded-2xl p-6 text-white">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Process Monitoring
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-800 text-white">PID</th>
              <th className="py-2 px-4 bg-gray-800 text-white">Name</th>
              <th className="py-2 px-4 bg-gray-800 text-white">CPU (%)</th>
              <th className="py-2 px-4 bg-gray-800 text-white">Memory (%)</th>
              <th className="py-2 px-4 bg-gray-800 text-white">User</th>
            </tr>
          </thead>
          <tbody>
            {processes.length > 0 ? (
              processes.slice(0, 10).map((proc, index) => (
                <tr
                  key={index}
                  className={`text-gray-800 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <td className="py-2 px-4">{proc.pid}</td>
                  <td className="py-2 px-4">{proc.name}</td>
                  <td className="py-2 px-4">{proc.cpu}</td>
                  <td className="py-2 px-4">{proc.memory}</td>
                  <td className="py-2 px-4">{proc.user}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No process data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessMonitoring;
