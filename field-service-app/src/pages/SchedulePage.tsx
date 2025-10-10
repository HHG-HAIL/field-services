import React from 'react';
import { WorkOrder, Technician } from '../types';
import ScheduleView from '../components/schedule/ScheduleView';

interface SchedulePageProps {
  workOrders: WorkOrder[];
  technicians: Technician[];
  onStatusChange: (workOrderId: string, newStatus: WorkOrder['status']) => void;
  onReschedule: (workOrderId: string, newDate: string) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  workOrders,
  technicians,
  onStatusChange,
  onReschedule
}) => {
  return (
    <ScheduleView
      workOrders={workOrders}
      technicians={technicians}
      onStatusChange={onStatusChange}
      onReschedule={onReschedule}
    />
  );
};

export default SchedulePage;