'use client'
import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import Button from '../components/Button';
import StatusIndicator from '../components/StatusIndicator';
import Alert from '../components/Alert'; 
import TimeRangeSelector from '../components/TimeRangeSelector';
import Chart from '../components/Chart';

interface SensorData {
  pm25: number;
  temperature: number;
  humidity: number;
}

const AirPurifierDashboard: React.FC = () => {
  const [page, setPage] = useState<'dashboard' | 'analytics'>('dashboard');
  const [deviceStatus, setDeviceStatus] = useState<'ON' | 'OFF'>('ON');
  const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'danger'; message: string } | null>(null);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [sensorData, setSensorData] = useState<SensorData>({
    pm25: 40,
    temperature: 24,
    humidity: 55
  });

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        pm25: Math.max(0, prev.pm25 + (Math.random() - 0.5) * 10),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Alert for high PM2.5
  useEffect(() => {
    if (sensorData.pm25 > 55.4) {
      setAlert({ type: 'danger', message: '🔥 Very high PM2.5! Air quality is hazardous.' });
    } else if (sensorData.pm25 >= 35.5) {
      setAlert({ type: 'warning', message: '⚠️ High PM2.5 detected! Air quality is unhealthy.' });
    } else {
      setAlert(null);
    }
  }, [sensorData.pm25]);

  // Get status based on PM2.5
  const getPM25Status = (value: number) => {
    if (value <= 35.4) return 'good';
    if (value <= 55.4) return 'warning';
    return 'danger';
  };

  // Map status to Tailwind colors
  const statusColorClass = (status: string) => {
    switch(status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Generate historical data for charts
  const generateHistoricalData = () => {
    const points = timeRange === '1h' ? 12 : 24;
    return Array.from({ length: points }, (_, i) => ({
      time: timeRange === '1h' ? `${i * 5}m` : `${i}h`,
      pm25: 30 + Math.random() * 50,
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 30
    }));
  };

  const historicalData = generateHistoricalData();

  return (
<div className="bg-[#f0f0f0] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div className="w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">

        {/* Navigation */}
        <nav className="flex flex-col md:flex-row items-center justify-between border-b pb-4 md:pb-6 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusColorClass(getPM25Status(sensorData.pm25))}`}>
              <Wind className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Air Purifier</h1>
          </div>
          <div className="flex gap-2">
            <Button isSelected={page === 'dashboard'} onClick={() => setPage('dashboard')}>Dashboard</Button>
            <Button isSelected={page === 'analytics'} onClick={() => setPage('analytics')}>Analytics</Button>
          </div>
        </nav>

        {/* Alert */}
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Main Content */}
        {page === 'dashboard' ? (
          <div className="space-y-6">

            {/* Device Control */}
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <StatusIndicator status={deviceStatus} />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${statusColorClass(getPM25Status(sensorData.pm25))}`}></div>
                  <span>Live updating</span>
                </div>
              </div>
            </div>

            {/* Sensors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <SensorCard 
                title="PM2.5" 
                value={Math.round(sensorData.pm25)} 
                unit="μg/m³" 
                icon={Wind} 
                status={getPM25Status(sensorData.pm25)} 
              />
              <SensorCard 
                title="Temperature" 
                value={Math.round(sensorData.temperature)} 
                unit="°C" 
                icon={Thermometer} 
                status="neutral" 
              />
              <SensorCard 
                title="Humidity" 
                value={Math.round(sensorData.humidity)} 
                unit="%" 
                icon={Droplets} 
                status="neutral" 
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analytics */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <h2 className="text-2xl font-bold text-gray-800">Historical Data</h2>
              <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              <Chart data={historicalData} dataKey="pm25" color="#3ABCF7" title="PM2.5 Levels" />
              <Chart data={historicalData} dataKey="temperature" color="#f59e0b" title="Temperature" />
              <Chart data={historicalData} dataKey="humidity" color="#06b6d4" title="Humidity" />
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AirPurifierDashboard;
