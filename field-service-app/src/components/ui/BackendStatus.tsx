import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface BackendStatusProps {
  isConnected: boolean;
  loading?: boolean;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ isConnected, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent dark:border-yellow-400"></div>
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
      }`}
    >
      {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{isConnected ? 'Backend Connected' : 'Using Mock Data'}</span>
    </div>
  );
};

export default BackendStatus;
