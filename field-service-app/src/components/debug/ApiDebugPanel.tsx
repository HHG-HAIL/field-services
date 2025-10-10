import React, { useEffect, useState } from 'react';

const ApiDebugPanel: React.FC = () => {
  const [apiResults, setApiResults] = useState<string[]>([]);

  useEffect(() => {
    const testAPIs = async () => {
      const results: string[] = [];
      
      try {
        // Test Work Orders API
        const workOrdersResponse = await fetch('http://localhost:8081/api/work-orders');
        if (workOrdersResponse.ok) {
          const workOrders = await workOrdersResponse.json();
          results.push(`✅ Work Orders: ${workOrders.length} items`);
        } else {
          results.push(`❌ Work Orders: ${workOrdersResponse.status}`);
        }
      } catch (error) {
        results.push(`❌ Work Orders: ${error}`);
      }

      try {
        // Test Technicians API
        const techniciansResponse = await fetch('http://localhost:8082/api/technicians');
        if (techniciansResponse.ok) {
          const technicians = await techniciansResponse.json();
          results.push(`✅ Technicians: ${technicians.length} items`);
        } else {
          results.push(`❌ Technicians: ${techniciansResponse.status}`);
        }
      } catch (error) {
        results.push(`❌ Technicians: ${error}`);
      }

      try {
        // Test Schedules API
        const schedulesResponse = await fetch('http://localhost:8083/api/schedules');
        if (schedulesResponse.ok) {
          const schedules = await schedulesResponse.json();
          results.push(`✅ Schedules: ${schedules.length} items`);
        } else {
          results.push(`❌ Schedules: ${schedulesResponse.status}`);
        }
      } catch (error) {
        results.push(`❌ Schedules: ${error}`);
      }

      setApiResults(results);
    };

    testAPIs();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md">
      <h3 className="font-bold text-sm mb-2">API Debug Panel</h3>
      <div className="text-xs space-y-1">
        {apiResults.map((result, index) => (
          <div key={index} className="font-mono">{result}</div>
        ))}
        {apiResults.length === 0 && <div>Testing APIs...</div>}
      </div>
    </div>
  );
};

export default ApiDebugPanel;