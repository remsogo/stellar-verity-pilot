
import React from 'react';

interface DefectSeverityBadgeProps {
  severity: "low" | "medium" | "high" | "critical";
}

export const DefectSeverityBadge: React.FC<DefectSeverityBadgeProps> = ({ severity }) => {
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';
  
  switch (severity) {
    case 'low':
      bgColor = 'bg-blue-500';
      break;
    case 'medium':
      bgColor = 'bg-yellow-500';
      break;
    case 'high':
      bgColor = 'bg-orange-500';
      break;
    case 'critical':
      bgColor = 'bg-red-500';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};
