import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface BackendStatusProps {
  isConnected: boolean;
  loading?: boolean;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ isConnected, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Connecting...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
      {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span className="text-sm">
        {isConnected ? 'Backend Connected' : 'Using Mock Data'}
      </span>
    </div>
  );
};

export default BackendStatus;