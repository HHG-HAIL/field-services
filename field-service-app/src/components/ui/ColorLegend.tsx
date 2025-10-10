import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ColorLegendProps {
  className?: string;
}

const ColorLegend: React.FC<ColorLegendProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusItems = [
    { status: 'pending' as const, description: 'Work order created but not yet assigned' },
    { status: 'assigned' as const, description: 'Assigned to a technician' },
    { status: 'in-progress' as const, description: 'Currently being worked on' },
    { status: 'completed' as const, description: 'Successfully completed' },
    { status: 'cancelled' as const, description: 'Cancelled or aborted' },
  ];

  const priorityItems = [
    { priority: 'urgent' as const, description: 'Critical - immediate attention required' },
    { priority: 'high' as const, description: 'High priority - address soon' },
    { priority: 'medium' as const, description: 'Standard priority' },
    { priority: 'low' as const, description: 'Low priority - when time permits' },
  ];

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50/90 rounded-xl shadow-lg border-0 backdrop-blur-sm ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-2 rounded-lg">
            <Info className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="font-semibold text-gray-900">Status & Priority Legend</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Status Legend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Work Order Status
              </span>
            </h4>
            <div className="space-y-2">
              {statusItems.map(({ status, description }) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-xs text-gray-600 ml-3 flex-1">{description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Legend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Priority Levels
              </span>
            </h4>
            <div className="space-y-2">
              {priorityItems.map(({ priority, description }) => (
                <div key={priority} className="flex items-center justify-between">
                  <PriorityBadge priority={priority} />
                  <span className="text-xs text-gray-600 ml-3 flex-1">{description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Coding Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
            <h5 className="text-xs font-semibold text-blue-900 mb-1">Color Coding Guide:</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Red/Rose:</strong> Urgent, Cancelled - Requires immediate attention</li>
              <li>• <strong>Orange/Amber:</strong> High priority, Assigned - Important tasks</li>
              <li>• <strong>Yellow:</strong> Medium priority - Standard workflow</li>
              <li>• <strong>Green/Emerald:</strong> Low priority, Completed - Good status</li>
              <li>• <strong>Blue:</strong> In Progress - Active work</li>
              <li>• <strong>Gray/Slate:</strong> Pending, Offline - Neutral status</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorLegend;