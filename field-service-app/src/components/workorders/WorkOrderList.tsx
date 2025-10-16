import React, { useEffect, useState } from 'react';
import { WorkOrder } from '../../types';
import { Search, Filter, Plus } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onStatusChange?: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onAssignTechnician?: (workOrderId: string) => void;
  onUnassignTechnician?: (workOrderId: string) => void;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
  onChangeTechnician?: (workOrder: WorkOrder) => void;
  onCreateNew?: () => void;
  showActions?: boolean;
  title?: string;
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({ 
  workOrders, 
  onStatusChange, 
  onAssignTechnician, 
  onUnassignTechnician,
  onEditWorkOrder,
  onChangeTechnician,
  onCreateNew,
  showActions = true,
  title = "Work Orders"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = 
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    return {
      all: workOrders.length,
      assigned: workOrders.filter(wo => wo.status === 'assigned').length,
      'in-progress': workOrders.filter(wo => wo.status === 'in-progress').length,
      completed: workOrders.filter(wo => wo.status === 'completed').length,
      cancelled: workOrders.filter(wo => wo.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (!minutes && minutes !== 0) {
      return '—';
    }
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusActions = (workOrder: WorkOrder) => {
    switch (workOrder.status) {
      case 'assigned':
        return [
          { label: 'Start Work', status: 'in-progress' as const },
          { label: 'Cancel', status: 'cancelled' as const }
        ];
      case 'in-progress':
        return [
          { label: 'Complete', status: 'completed' as const }
        ];
      default:
        return [];
    }
  };

  const getMenuItems = (workOrder: WorkOrder) => {
    const items: Array<{ key: string; label: string; onClick: () => void; disabled?: boolean }> = [];

    if (onEditWorkOrder) {
      items.push({
        key: 'edit',
        label: 'Edit work order',
        onClick: () => {
          onEditWorkOrder(workOrder);
          setActiveMenuId(null);
        }
      });
    }

    if (onChangeTechnician) {
      items.push({
        key: 'assign-change',
        label: workOrder.technicianId ? 'Change technician' : 'Assign technician',
        onClick: () => {
          onChangeTechnician(workOrder);
          setActiveMenuId(null);
        }
      });
    } else if (!workOrder.technicianId && onAssignTechnician) {
      items.push({
        key: 'assign',
        label: 'Assign technician',
        onClick: () => {
          onAssignTechnician(workOrder.id);
          setActiveMenuId(null);
        }
      });
    }

    if (workOrder.technicianId && onUnassignTechnician) {
      items.push({
        key: 'unassign',
        label: 'Unassign technician',
        onClick: () => {
          onUnassignTechnician(workOrder.id);
          setActiveMenuId(null);
        }
      });
    }

    getStatusActions(workOrder).forEach(action => {
      items.push({
        key: action.status,
        label: action.label,
        onClick: () => {
          onStatusChange?.(workOrder.id, action.status);
          setActiveMenuId(null);
        }
      });
    });

    if (items.length === 0) {
      items.push({
        key: 'no-actions',
        label: 'No actions available',
        onClick: () => setActiveMenuId(null),
        disabled: true
      });
    }

    return items;
  };

  useEffect(() => {
    if (!showActions) {
      setActiveMenuId(null);
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-role="workorder-menu-trigger"]') || target.closest('[data-role="workorder-menu"]')) {
        return;
      }
      setActiveMenuId(null);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [showActions]);

  const toggleMenu = (id: string) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="surface-card flex items-center justify-between rounded-2xl px-6 py-5 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{title}</h2>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="primary" className="shadow-lg shadow-primary-500/30 hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="surface-card rounded-2xl p-6 shadow-lg shadow-slate-900/10 dark:shadow-slate-950/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-primary-500" />
              <input
                type="text"
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/70 py-3 pl-10 pr-3 text-sm text-slate-700 shadow-inner shadow-slate-900/5 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200/80 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/40"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 text-sm text-slate-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200/80 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/40"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="assigned">📋 Assigned ({statusCounts.assigned})</option>
              <option value="in-progress">🔄 In Progress ({statusCounts['in-progress']})</option>
              <option value="completed">✅ Completed ({statusCounts.completed})</option>
              <option value="cancelled">❌ Cancelled ({statusCounts.cancelled})</option>
            </select>
          </div>
          
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 text-sm text-slate-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200/80 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/40"
            >
              <option value="all">All priority</option>
              <option value="urgent">🚨 Urgent</option>
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌿 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work Orders Grid */}
      {filteredWorkOrders.length === 0 ? (
        <div className="surface-card text-center py-16 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-500/20 dark:to-secondary-500/20">
            <Filter className="h-12 w-12 text-primary-600 dark:text-primary-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">No work orders found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="surface-card rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/70 dark:divide-slate-800/70">
              <thead className="bg-white/80 text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Summary</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Technician</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Scheduled</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 text-slate-700 dark:divide-slate-800/70 dark:text-slate-200">
                {filteredWorkOrders.map((workOrder) => {
                  const menuItems = getMenuItems(workOrder);
                  return (
                    <tr
                      key={workOrder.id}
                      className="bg-white/70 transition-colors hover:bg-primary-50/60 dark:bg-slate-950/40 dark:hover:bg-primary-500/10"
                    >
                      <td className="relative px-4 py-4 text-sm font-semibold text-primary-600">
                        {showActions ? (
                          <button
                            type="button"
                            data-role="workorder-menu-trigger"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleMenu(workOrder.id);
                            }}
                            className="rounded-md px-1 py-0.5 transition-colors hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:hover:text-primary-300 dark:focus:ring-primary-500/50"
                          >
                            #{workOrder.id}
                          </button>
                        ) : (
                          `#${workOrder.id}`
                        )}
                        {showActions && activeMenuId === workOrder.id && (
                          <div
                            data-role="workorder-menu"
                            className="absolute z-50 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl shadow-slate-900/20 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/95 dark:shadow-slate-950/50"
                          >
                            {menuItems.map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  item.onClick();
                                }}
                                disabled={item.disabled}
                                className={`w-full rounded-xl px-4 py-2 text-left text-sm transition-colors ${
                                  item.disabled
                                    ? 'cursor-default text-slate-400'
                                    : 'text-slate-600 hover:bg-primary-500/10 hover:text-primary-600 dark:text-slate-200 dark:hover:bg-primary-500/15 dark:hover:text-primary-200'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{workOrder.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{workOrder.description}</div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <PriorityBadge priority={workOrder.priority} />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={workOrder.status} />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {workOrder.technicianName || 'Unassigned'}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        {formatDate(workOrder.scheduledDate)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{workOrder.customerName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[14rem]">{workOrder.location.address}</div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {formatDuration(workOrder.estimatedDuration)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderList;
