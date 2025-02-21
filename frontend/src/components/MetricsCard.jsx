import React from 'react';
import { FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * MetricsCard Component
 * @param {string} title - The title of the card
 * @param {ReactNode} icon - The icon to display in the top right corner
 * @param {Array} data - Array of data items to display in the card
 * @param {string} bgColor - Background color of the card
 * @param {string} textColor - Text color for the title and content
 * @param {string} iconColor - Color for the icon
 * @param {ReactNode} footer - Optional footer content for the card
 */
const MetricsCard = ({
  title, 
  icon = <FiCpu />, 
  data = [], 
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
  iconColor = 'text-blue-600',
  footer
}) => {
  return (
    <motion.div 
      className={`${bgColor} shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
        <div className={`text-4xl ${iconColor}`}>
          {icon}
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li 
            key={index} 
            className="text-gray-600 bg-gray-100 rounded-lg p-2 hover:bg-blue-50 hover:shadow-sm transition duration-300"
          >
            {item}
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default MetricsCard;
