import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { WorkOrder } from '../../types';

interface RecentActivityProps {
  workOrders: WorkOrder[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ workOrders }) => {
  const recentlyUpdated = workOrders
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getActivityMessage = (workOrder: WorkOrder) => {
    switch (workOrder.status) {
      case 'assigned':
        return `Work order "${workOrder.title}" was assigned to ${workOrder.technicianName}`;
      case 'in-progress':
        return `${workOrder.technicianName} started working on "${workOrder.title}"`;
      case 'completed':
        return `"${workOrder.title}" was completed by ${workOrder.technicianName}`;
      case 'cancelled':
        return `Work order "${workOrder.title}" was cancelled`;
      default:
        return `Work order "${workOrder.title}" was updated`;
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Activity</h3>
        
        <div className="space-y-4">
          {recentlyUpdated.map((workOrder) => {
            const timeDiff = Date.now() - new Date(workOrder.updatedAt).getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const timeAgo = hours > 0 ? `${hours}h ago` : `${minutes}m ago`;
            
            return (
              <div key={workOrder.id} className="flex items-start space-x-3 pb-4 border-b border-gradient-to-r from-transparent via-gray-200 to-transparent last:border-b-0 last:pb-0 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 rounded-lg p-2 transition-all duration-200">
                <StatusBadge status={workOrder.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityMessage(workOrder)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 font-medium">
                      {timeAgo}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-gray-600">{workOrder.customerName}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {recentlyUpdated.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;