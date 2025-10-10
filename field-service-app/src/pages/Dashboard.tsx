import React from 'react';
import { WorkOrder, Technician, UserRole } from '../types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import WorkOrderList from '../components/workorders/WorkOrderList';
import ColorLegend from '../components/ui/ColorLegend';
import { 
  Wrench, 
  Users, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  workOrders: WorkOrder[];
  technicians: Technician[];
  userRole: UserRole;
  onStatusChange?: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onAssignTechnician?: (workOrderId: string) => void;
  onUnassignTechnician?: (workOrderId: string) => void;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
  onChangeTechnician?: (workOrder: WorkOrder) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  workOrders, 
  technicians, 
  userRole, 
  onStatusChange, 
  onAssignTechnician,
  onUnassignTechnician,
  onEditWorkOrder,
  onChangeTechnician
}) => {
  const getStatsForRole = () => {
    const totalWorkOrders = workOrders.length;
    const inProgress = workOrders.filter(wo => wo.status === 'in-progress').length;
    const urgent = workOrders.filter(wo => wo.priority === 'urgent' && wo.status !== 'completed').length;
    const availableTechnicians = technicians.filter(t => t.status === 'available').length;

    switch (userRole) {
      case 'dispatcher':
        return [
          {
            title: 'Total Work Orders',
            value: totalWorkOrders,
            icon: <Wrench className="h-6 w-6" />,
            color: 'blue' as const,
            change: { value: 12, type: 'increase' as const }
          },
          {
            title: 'Available Technicians',
            value: availableTechnicians,
            icon: <Users className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: 5, type: 'decrease' as const }
          },
          {
            title: 'In Progress',
            value: inProgress,
            icon: <Clock className="h-6 w-6" />,
            color: 'yellow' as const
          },
          {
            title: 'Urgent Priority',
            value: urgent,
            icon: <Clock className="h-6 w-6" />,
            color: urgent > 0 ? 'red' as const : 'green' as const,
            change: { value: 3, type: 'neutral' as const }
          }
        ];
      
      case 'technician':
        const myWorkOrders = workOrders.filter(wo => wo.technicianId === '1'); // Mock current user
        const myCompleted = myWorkOrders.filter(wo => wo.status === 'completed').length;
        const myInProgress = myWorkOrders.filter(wo => wo.status === 'in-progress').length;
        
        return [
          {
            title: 'My Jobs Today',
            value: myWorkOrders.filter(wo => 
              new Date(wo.scheduledDate).toDateString() === new Date().toDateString()
            ).length,
            icon: <Calendar className="h-6 w-6" />,
            color: 'blue' as const
          },
          {
            title: 'In Progress',
            value: myInProgress,
            icon: <Clock className="h-6 w-6" />,
            color: 'yellow' as const
          },
          {
            title: 'Completed Today',
            value: myCompleted,
            icon: <CheckCircle className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: 15, type: 'increase' as const }
          },
          {
            title: 'Total Assigned',
            value: myWorkOrders.length,
            icon: <Wrench className="h-6 w-6" />,
            color: 'gray' as const
          }
        ];
      
      case 'manager':
        const completionRate = totalWorkOrders > 0 ? 
          Math.round((workOrders.filter(wo => wo.status === 'completed').length / totalWorkOrders) * 100) : 0;
        
        return [
          {
            title: 'Total Work Orders',
            value: totalWorkOrders,
            icon: <Wrench className="h-6 w-6" />,
            color: 'blue' as const,
            change: { value: 12, type: 'increase' as const }
          },
          {
            title: 'Completion Rate',
            value: `${completionRate}%`,
            icon: <CheckCircle className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: 5, type: 'increase' as const }
          },
          {
            title: 'Active Technicians',
            value: technicians.filter(t => t.status !== 'offline').length,
            icon: <Users className="h-6 w-6" />,
            color: 'blue' as const
          },
          {
            title: 'Urgent Items',
            value: urgent,
            icon: <AlertTriangle className="h-6 w-6" />,
            color: urgent > 0 ? 'red' as const : 'green' as const
          }
        ];
      
      default:
        return [];
    }
  };

  const getRecentWorkOrders = () => {
    if (userRole === 'technician') {
      return workOrders.filter(wo => wo.technicianId === '1'); // Mock current user
    }
    return workOrders;
  };

  const getPriorityWorkOrders = () => {
    const filtered = getRecentWorkOrders();
    return filtered
      .filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled')
      .sort((a, b) => {
        const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 6);
  };

  const stats = getStatsForRole();
  const priorityWorkOrders = getPriorityWorkOrders();

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="bg-gradient-to-r from-white to-gray-50/50 p-8 rounded-2xl shadow-lg border-0 backdrop-blur-sm">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent">
          {userRole === 'dispatcher' ? 'Dispatch Dashboard' : 
           userRole === 'technician' ? 'My Dashboard' : 
           'Management Dashboard'}
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Work Orders */}
        <div className="lg:col-span-2">
          <WorkOrderList
            workOrders={priorityWorkOrders}
            onStatusChange={onStatusChange}
            onAssignTechnician={onAssignTechnician}
            onUnassignTechnician={onUnassignTechnician}
            onEditWorkOrder={onEditWorkOrder}
            onChangeTechnician={onChangeTechnician}
            title={userRole === 'technician' ? 'My Priority Jobs' : 'Priority Work Orders'}
            showActions={userRole !== 'manager'}
          />
        </div>

        {/* Recent Activity and Legend */}
        <div className="space-y-6">
          <RecentActivity workOrders={getRecentWorkOrders()} />
          <ColorLegend />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;