import React, { useEffect, useMemo, useState } from 'react';
import { Technician } from '../../types';
import { Search, Plus, Users, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

interface TechniciansListProps {
  technicians: Technician[];
  onAssignToWorkOrder?: (technicianId: string) => void;
  onUpdateStatus?: (technicianId: string, status: Technician['status']) => void;
  onCreateNew?: () => void;
  title?: string;
}

const TechniciansList: React.FC<TechniciansListProps> = ({
  technicians = [],
  onAssignToWorkOrder,
  onUpdateStatus,
  onCreateNew,
  title = 'Technicians',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const safeTechnicians = useMemo(
    () => (Array.isArray(technicians) ? technicians : []),
    [technicians],
  );

  const filteredTechnicians = useMemo(
    () =>
      safeTechnicians.filter((technician) => {
        const matchesSearch =
          technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (technician.skills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase()),
          );

        const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
        const matchesSkill =
          skillFilter === 'all' || (technician.skills || []).includes(skillFilter);

        return matchesSearch && matchesStatus && matchesSkill;
      }),
    [safeTechnicians, searchTerm, statusFilter, skillFilter],
  );

  const getStatusCounts = () => ({
    all: safeTechnicians.length,
    available: safeTechnicians.filter((t) => t.status === 'available').length,
    busy: safeTechnicians.filter((t) => t.status === 'busy').length,
    offline: safeTechnicians.filter((t) => t.status === 'offline').length,
    'on-break': safeTechnicians.filter((t) => t.status === 'on-break').length,
  });

  const getAllSkills = () => {
    const skills = new Set<string>();
    safeTechnicians.forEach((tech) => {
      (tech.skills || []).forEach((skill) => skills.add(skill));
    });
    return Array.from(skills).sort();
  };

  const statusCounts = getStatusCounts();
  const allSkills = getAllSkills();

  const formatSkillList = (skills: string[] = []) => {
    if (!skills.length) {
      return '—';
    }
    if (skills.length <= 3) {
      return skills.join(', ');
    }
    const visible = skills.slice(0, 3).join(', ');
    return `${visible} +${skills.length - 3} more`;
  };

  const formatLocation = (location: Technician['currentLocation']) => {
    if (!location) {
      return '—';
    }
    if (typeof location === 'string') {
      return location;
    }
    if (
      typeof location === 'object' &&
      location.lat !== undefined &&
      location.lng !== undefined
    ) {
      return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    }
    return '—';
  };

  const getMenuItems = (technician: Technician) => {
    const items: Array<{
      key: string;
      label: string;
      onClick: () => void;
      disabled?: boolean;
    }> = [];

    if (onAssignToWorkOrder) {
      items.push({
        key: 'assign',
        label:
          technician.status === 'available'
            ? 'Assign to work order'
            : 'Assign (requires available)',
        onClick: () => {
          if (technician.status === 'available') {
            onAssignToWorkOrder(technician.id);
            setActiveMenuId(null);
          }
        },
        disabled: technician.status !== 'available',
      });
    }

    if (onUpdateStatus) {
      const statusOptions: Technician['status'][] = [
        'available',
        'busy',
        'on-break',
        'offline',
      ];
      statusOptions
        .filter((status) => status !== technician.status)
        .forEach((status) => {
          items.push({
            key: `status-${status}`,
            label: `Mark ${status.replace('-', ' ')}`,
            onClick: () => {
              onUpdateStatus(technician.id, status);
              setActiveMenuId(null);
            },
          });
        });
    }

    if (items.length === 0) {
      items.push({
        key: 'no-actions',
        label: 'No actions available',
        onClick: () => setActiveMenuId(null),
        disabled: true,
      });
    }

    return items;
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest('[data-role="technician-menu-trigger"]') ||
        target.closest('[data-role="technician-menu"]')
      ) {
        return;
      }
      setActiveMenuId(null);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const toggleMenu = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      <div className="surface-card flex items-center justify-between rounded-2xl px-6 py-5 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/40">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-medium">{statusCounts.available} available</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="font-medium">{statusCounts.busy} busy</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                <span className="font-medium">{statusCounts.offline} offline</span>
              </div>
            </div>
          </div>
        </div>
        {onCreateNew && (
          <Button
            onClick={onCreateNew}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Technician
          </Button>
        )}
      </div>

      <div className="surface-card rounded-2xl p-6 shadow-lg shadow-slate-900/10 dark:shadow-slate-950/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-primary-500" />
              <input
                type="text"
                placeholder="Search technicians, skills, email..."
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
              <option value="available">Available ({statusCounts.available})</option>
              <option value="busy">Busy ({statusCounts.busy})</option>
              <option value="offline">Offline ({statusCounts.offline})</option>
              <option value="on-break">On Break ({statusCounts['on-break']})</option>
            </select>
          </div>

          <div>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 text-sm text-slate-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200/80 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/40"
            >
              <option value="all">All Skills</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredTechnicians.length === 0 ? (
        <div className="surface-card text-center py-16 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-500/20 dark:to-secondary-500/20">
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">No technicians found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms or filters to find the technicians you're looking for.
          </p>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="mt-6 shadow-lg shadow-primary-500/30 hover:shadow-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add first technician
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {filteredTechnicians.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {safeTechnicians.length}
              </span>{' '}
              technicians
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Updated {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="surface-card rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/70 dark:divide-slate-800/70">
                <thead className="bg-white/80 text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Technician
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Skills
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Active Jobs
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 text-slate-700 dark:divide-slate-800/70 dark:text-slate-200">
                  {filteredTechnicians.map((technician) => {
                    const menuItems = getMenuItems(technician);
                    const activeJobs = (technician.activeWorkOrders || []).length;
                    return (
                      <tr
                        key={technician.id}
                        className="bg-white/70 transition-colors hover:bg-primary-50/60 dark:bg-slate-950/40 dark:hover:bg-primary-500/10"
                      >
                        <td className="relative px-4 py-4 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                          <button
                            type="button"
                            data-role="technician-menu-trigger"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleMenu(technician.id);
                            }}
                            className="rounded-md px-1 py-0.5 transition-colors hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-300 dark:hover:text-secondary-200 dark:focus:ring-secondary-500/50"
                          >
                            #{technician.id}
                          </button>
                          {activeMenuId === technician.id && (
                            <div
                              data-role="technician-menu"
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
                          <div className="font-medium text-slate-900 dark:text-slate-100">{technician.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                            <span className="truncate">{technician.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <StatusBadge status={technician.status} />
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {formatSkillList(technician.skills || [])}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{activeJobs}</span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span>{technician.phone || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="truncate">{technician.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                            <span className="truncate">
                              {formatLocation(technician.currentLocation)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniciansList;

