// src/components/NetworkInfo.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const NetworkInfo = () => {
  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    socket.on('systemMetrics', (data) => {
      setNetworkData(data.network);
    });

    return () => {
      socket.off('systemMetrics');
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 shadow-2xl rounded-2xl p-6 text-white">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Network Information
      </h3>
      {networkData.map((net, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-medium">{net.iface}</h4>
          <p>IP Address: {net.ip4}</p>
          <p>Upload: {net.tx_sec} KB/s</p>
          <p>Download: {net.rx_sec} KB/s</p>
        </div>
      ))}
    </div>
  );
};

export default NetworkInfo;
