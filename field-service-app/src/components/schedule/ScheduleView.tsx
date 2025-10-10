import React, { useState } from 'react';
import { WorkOrder, Technician } from '../../types';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Button from '../ui/Button';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleViewProps {
  workOrders: WorkOrder[];
  technicians: Technician[];
  onStatusChange?: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onReschedule?: (workOrderId: string, newDate: string) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  workOrders,
  technicians,
  onStatusChange,
  onReschedule
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const getButtonVariant = (mode: 'day' | 'week'): 'primary' | 'secondary' => {
    return viewMode === mode ? 'primary' : 'secondary';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayWorkOrders = (date: Date) => {
    const dateStr = date.toDateString();
    return workOrders
      .filter(wo => new Date(wo.scheduledDate).toDateString() === dateStr)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 20; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour
      });
    }
    return slots;
  };

  const getTechnicianColor = (technicianId: string) => {
    const colors = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-purple-100 border-purple-300',
      'bg-orange-100 border-orange-300',
      'bg-pink-100 border-pink-300'
    ];
    const index = parseInt(technicianId) % colors.length;
    return colors[index];
  };

  const timeSlots = getTimeSlots();

  if (viewMode === 'day') {
    const dayWorkOrders = getDayWorkOrders(currentDate);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Schedule</h2>
            <p className="text-gray-600">{formatDate(currentDate)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={getButtonVariant('day')}
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                size="sm"
                variant={getButtonVariant('week')}
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Day View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-12 gap-0">
            {/* Time Column */}
            <div className="col-span-2 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 font-medium text-gray-900">
                Time
              </div>
              {timeSlots.map(slot => (
                <div key={slot.time} className="p-4 border-b border-gray-100 text-sm text-gray-600 h-20">
                  {slot.time}
                </div>
              ))}
            </div>

            {/* Schedule Column */}
            <div className="col-span-10">
              <div className="p-4 border-b border-gray-200 font-medium text-gray-900">
                Jobs ({dayWorkOrders.length})
              </div>
              <div className="relative">
                {timeSlots.map(slot => (
                  <div key={slot.time} className="border-b border-gray-100 h-20 relative">
                    {dayWorkOrders
                      .filter(wo => new Date(wo.scheduledDate).getHours() === slot.hour)
                      .map((workOrder, index) => (
                        <div
                          key={workOrder.id}
                          className={`absolute left-2 right-2 p-2 rounded border-l-4 ${getTechnicianColor(workOrder.technicianId || '0')} cursor-pointer hover:shadow-md transition-shadow`}
                          style={{
                            top: `${index * 24 + 4}px`,
                            height: '20px'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="font-medium text-sm truncate">{workOrder.title}</span>
                              <StatusBadge status={workOrder.status} className="text-xs" />
                              <PriorityBadge priority={workOrder.priority} className="text-xs" />
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <User className="h-3 w-3" />
                              <span>{workOrder.technicianName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {dayWorkOrders.map(workOrder => (
            <Card key={workOrder.id} padding="sm">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 truncate">{workOrder.title}</h4>
                  <div className="flex space-x-1">
                    <StatusBadge status={workOrder.status} />
                    <PriorityBadge priority={workOrder.priority} />
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formatTime(workOrder.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{workOrder.technicianName || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{workOrder.customerName}</span>
                  </div>
                </div>

                {onStatusChange && (
                  <div className="flex gap-2">
                    {workOrder.status === 'assigned' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onStatusChange(workOrder.id, 'in-progress')}
                      >
                        Start
                      </Button>
                    )}
                    {workOrder.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onStatusChange(workOrder.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    {onReschedule && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onReschedule(workOrder.id, workOrder.scheduledDate)}
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {dayWorkOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              No work orders are scheduled for {formatDate(currentDate)}.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Week View
  const weekDates = getWeekDates(currentDate);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
          <p className="text-gray-600">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={getButtonVariant('day')}
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button
              size="sm"
              variant={getButtonVariant('week')}
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="secondary" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setCurrentDate(new Date())}>
              This Week
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <div className="grid grid-cols-8 gap-0 min-w-full">
          {/* Header Row */}
          <div className="p-4 border-r border-b border-gray-200 font-medium text-gray-900">
            Time
          </div>
          {weekDates.map(date => (
            <div key={date.toISOString()} className="p-4 border-r border-b border-gray-200 text-center">
              <div className="font-medium text-gray-900">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-600">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(slot => (
            <React.Fragment key={slot.time}>
              <div className="p-2 border-r border-b border-gray-100 text-sm text-gray-600 h-16">
                {slot.time}
              </div>
              {weekDates.map(date => {
                const dayWorkOrders = getDayWorkOrders(date).filter(
                  wo => new Date(wo.scheduledDate).getHours() === slot.hour
                );
                
                return (
                  <div key={`${date.toISOString()}-${slot.time}`} className="border-r border-b border-gray-100 h-16 p-1">
                    {dayWorkOrders.map(workOrder => (
                      <div
                        key={workOrder.id}
                        className={`w-full text-xs p-1 rounded border-l-2 ${getTechnicianColor(workOrder.technicianId || '0')} cursor-pointer hover:shadow-sm`}
                      >
                        <div className="truncate font-medium">{workOrder.title}</div>
                        <div className="truncate text-gray-600">{workOrder.technicianName}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;