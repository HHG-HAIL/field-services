import React from 'react';
import { WorkOrder, Technician, UserRole } from '../types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import WorkOrderList from '../components/workorders/WorkOrderList';
import ColorLegend from '../components/ui/ColorLegend';
import PriorityBadge from '../components/ui/PriorityBadge';
import StatusBadge from '../components/ui/StatusBadge';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  TimerReset,
  Users,
  Wrench,
  Zap
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

type StatConfig = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
};

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
  const totalWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;
  const completionRate = totalWorkOrders > 0 ? Math.round((completedWorkOrders / totalWorkOrders) * 100) : 0;
  const activeTechnicians = technicians.filter(t => t.status !== 'offline').length;
  const availableTechnicians = technicians.filter(t => t.status === 'available');
  const utilization =
    technicians.length > 0 ? Math.round(((activeTechnicians - availableTechnicians.length) / technicians.length) * 100) : 0;
  const urgentWorkOrders = workOrders.filter(wo => wo.priority === 'urgent' && wo.status !== 'completed');
  const todaysJobs = workOrders.filter(wo => {
    const scheduled = new Date(wo.scheduledDate);
    return scheduled.toDateString() === new Date().toDateString();
  });

  const getRecentWorkOrders = () => {
    if (userRole === 'technician') {
      return workOrders.filter(wo => wo.technicianId === '1'); // Placeholder for current user
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

  const getStatsForRole = (): StatConfig[] => {
    const inProgress = workOrders.filter(wo => wo.status === 'in-progress').length;
    const urgent = urgentWorkOrders.length;
    const availableCount = availableTechnicians.length;

    switch (userRole) {
      case 'dispatcher':
        return [
          { title: 'Total Work Orders', value: totalWorkOrders, icon: <Wrench className="h-6 w-6" />, color: 'blue' as const },
          {
            title: 'Available Technicians',
            value: availableCount,
            icon: <Users className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: 2, type: 'decrease' }
          },
          { title: 'In Progress', value: inProgress, icon: <Clock className="h-6 w-6" />, color: 'yellow' as const },
          {
            title: 'Urgent Priority',
            value: urgent,
            icon: <AlertTriangle className="h-6 w-6" />,
            color: urgent > 0 ? ('red' as const) : ('green' as const),
            change: urgent > 0 ? { value: urgent, type: 'increase' } : { value: 0, type: 'neutral' }
          }
        ];
      case 'technician': {
        const myWorkOrders = workOrders.filter(wo => wo.technicianId === '1');
        const myCompleted = myWorkOrders.filter(wo => wo.status === 'completed').length;
        const myInProgress = myWorkOrders.filter(wo => wo.status === 'in-progress').length;
        const myToday = myWorkOrders.filter(wo => new Date(wo.scheduledDate).toDateString() === new Date().toDateString()).length;

        return [
          { title: 'My Jobs Today', value: myToday, icon: <Calendar className="h-6 w-6" />, color: 'blue' as const },
          {
            title: 'In Progress',
            value: myInProgress,
            icon: <Clock className="h-6 w-6" />,
            color: 'yellow' as const,
            change: { value: myInProgress, type: 'neutral' }
          },
          {
            title: 'Completed Today',
            value: myCompleted,
            icon: <CheckCircle className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: myCompleted, type: 'increase' }
          },
          { title: 'Total Assigned', value: myWorkOrders.length, icon: <Wrench className="h-6 w-6" />, color: 'gray' as const }
        ];
      }
      case 'manager':
        return [
          {
            title: 'Total Work Orders',
            value: totalWorkOrders,
            icon: <Wrench className="h-6 w-6" />,
            color: 'blue' as const,
            change: { value: totalWorkOrders, type: 'neutral' }
          },
          {
            title: 'Completion Rate',
            value: `${completionRate}%`,
            icon: <CheckCircle className="h-6 w-6" />,
            color: 'green' as const,
            change: { value: completionRate, type: 'increase' }
          },
          {
            title: 'Active Technicians',
            value: activeTechnicians,
            icon: <Users className="h-6 w-6" />,
            color: 'blue' as const,
            change: { value: activeTechnicians, type: 'neutral' }
          },
          {
            title: 'Urgent Items',
            value: urgentWorkOrders.length,
            icon: <AlertTriangle className="h-6 w-6" />,
            color: urgentWorkOrders.length > 0 ? ('red' as const) : ('green' as const),
            change:
              urgentWorkOrders.length > 0
                ? { value: urgentWorkOrders.length, type: 'increase' }
                : { value: 0, type: 'neutral' }
          }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();
  const priorityWorkOrders = getPriorityWorkOrders();
  const upcomingVisits = [...workOrders]
    .filter(wo => new Date(wo.scheduledDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 4);
  const availablePreview = availableTechnicians.slice(0, 5);
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formatTechnicianLocation = (location: Technician['currentLocation']) => {
    if (!location) {
      return 'On standby';
    }
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location.lat !== undefined && location.lng !== undefined) {
      return `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`;
    }
    return 'On standby';
  };

  return (
    <div className="space-y-8">
      <section className="surface-card rounded-3xl border border-slate-200/60 p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 dark:bg-primary-500/20 dark:text-primary-300">
              <Activity className="h-4 w-4" />
              Live field performance
            </span>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-slate-50">
              {userRole === 'dispatcher'
                ? 'Dispatch Control Center'
                : userRole === 'technician'
                ? 'My Field Operations'
                : 'Service Performance Command'}
            </h1>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Quickly understand service health, capacity, and the tickets that need immediate attention. This dashboard
              curates the insights you need to keep customer promises on track.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
                <Clock className="h-4 w-4 text-primary-500" />
                {todaysJobs.length} jobs scheduled today
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
                <AlertTriangle className="h-4 w-4 text-danger-500" />
                {urgentWorkOrders.length} urgent tickets pending
              </div>
            </div>
          </div>

          <div className="grid w-full max-w-xl grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-5 text-white shadow-lg shadow-primary-500/30">
              <p className="text-sm uppercase tracking-wide text-white/80">Completion rate</p>
              <p className="mt-2 text-3xl font-semibold">{completionRate}%</p>
              <p className="mt-1 text-xs text-white/80">Service requests fulfilled</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Technician utilization</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">{utilization}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${utilization}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {activeTechnicians} active / {technicians.length} technicians
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Open work orders</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                {totalWorkOrders - completedWorkOrders}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Currently in-flight across teams</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg. response window</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">38m</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on the last 10 assignments</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} change={stat.change} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Live field activity</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Monitor urgent tickets and high priority orders needing dispatch attention.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:bg-primary-500/20 dark:text-primary-300">
                <Zap className="h-3.5 w-3.5" />
                {urgentWorkOrders.length} urgent items
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {urgentWorkOrders.slice(0, 4).map(wo => (
                <div
                  key={wo.id}
                  className="rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-100/70 via-white to-white p-5 text-sm shadow-sm dark:border-rose-500/40 dark:from-rose-500/15 dark:via-slate-900 dark:to-slate-900/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-rose-500">Urgent • #{wo.id}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{wo.title}</h3>
                    </div>
                    <StatusBadge status={wo.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-slate-600 dark:text-slate-300">{wo.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      {wo.location?.address || wo.customerName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4 text-rose-500" />
                      {wo.technicianName || 'Unassigned'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TimerReset className="h-4 w-4 text-rose-500" />
                      SLA breach in 45m
                    </span>
                  </div>
                </div>
              ))}
              {urgentWorkOrders.length === 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300">
                  No urgent work orders at the moment. Monitor this panel for real-time escalations and SLA risks.
                </div>
              )}
            </div>
          </div>

          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Field schedule glance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Confirm coverage for the next wave of visits.</p>
              </div>
              <div className="rounded-full border border-slate-200/70 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
                {upcomingVisits.length} visits scheduled
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {upcomingVisits.map(visit => (
                <div
                  key={visit.id}
                  className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm shadow-sm hover:border-primary-200 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/60 dark:hover:border-primary-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-primary-500">{formatter.format(new Date(visit.scheduledDate))}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{visit.title}</h3>
                    </div>
                    <PriorityBadge priority={visit.priority} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-slate-500 dark:text-slate-400">{visit.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary-500" />
                      {visit.technicianName || 'Unassigned'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      {visit.customerName}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingVisits.length === 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-500 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                  No upcoming visits have been scheduled. Coordinate with dispatch to keep crews utilized.
                </div>
              )}
            </div>
          </div>

          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Priority work orders</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Take action on the highest priority tickets.</p>
              </div>
            </div>
            <div className="mt-4">
              <WorkOrderList
                workOrders={priorityWorkOrders}
                onStatusChange={onStatusChange}
                onAssignTechnician={onAssignTechnician}
                onUnassignTechnician={onUnassignTechnician}
                onEditWorkOrder={onEditWorkOrder}
                onChangeTechnician={onChangeTechnician}
                title=""
                showActions={userRole !== 'manager'}
              />
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Available technicians</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quickly assign work to the nearest capable resource.</p>
            <ul className="mt-4 space-y-3 text-sm">
              {availablePreview.map(tech => (
                <li
                  key={tech.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{tech.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(tech.skills || []).slice(0, 2).join(', ') || 'Generalist'}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTechnicianLocation(tech.currentLocation)}
                  </span>
                </li>
              ))}
              {availablePreview.length === 0 && (
                <li className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-xs text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300">
                  No technicians are currently available. Review assignments or re-balance workload.
                </li>
              )}
            </ul>
          </div>

          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Recent activity</h2>
            <div className="mt-4">
              <RecentActivity workOrders={getRecentWorkOrders()} />
            </div>
          </div>

          <div className="surface-card rounded-3xl border border-slate-200/60 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800/80 dark:shadow-slate-950/30">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Legend</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Use the color guide to interpret service states.</p>
            <div className="mt-4">
              <ColorLegend />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;
