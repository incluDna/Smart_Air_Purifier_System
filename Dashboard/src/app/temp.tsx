'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer, Flame, Activity } from 'lucide-react';

import SensorCard from '../components/SensorCard';
import Button from '../components/Button';
import StatusIndicator from '../components/StatusIndicator';
import Alert from '../components/Alert';
import TimeRangeSelector from '../components/TimeRangeSelector';
import Chart from '../components/Chart';

import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";

interface SensorData {
  pm25: number;
  temperature: number;
  humidity: number;
  gas: number;       
}

const Temp: React.FC = () => {
  const [page, setPage] = useState<'dashboard' | 'analytics'>('dashboard');
  const [deviceStatus, setDeviceStatus] = useState<'ON' | 'OFF'>('OFF');
  const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'danger'; message: string } | null>(null);
  const [timeRange, setTimeRange] = useState<string>('24h');

  const [sensorData, setSensorData] = useState<SensorData>({
    pm25: 0,
    temperature: 0,
    humidity: 0,
    gas: 0,          
  });

  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // -------------------------
  // GET REAL-TIME SENSOR DATA
  // -------------------------
  useEffect(() => {
    const purifierRef = ref(db, "airPurifier");

    const unsubscribe = onValue(purifierRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setDeviceStatus(data.status === "ON" ? "ON" : "OFF");

      setSensorData({
        pm25: data.pm25 ?? 0,
        temperature: data.temperature ?? 0,
        humidity: data.humidity ?? 0,
        gas: data.gas ?? 0,          
      });
    });

    return () => unsubscribe();
  }, []);

  // -------------------------
  // GET HISTORICAL DATA
  // -------------------------
  useEffect(() => {
    const historyRef = ref(db, "airPurifier/history");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const historyArray = Object.keys(data)
        .sort()
        .map(key => ({
          time: new Date(parseInt(key)).toLocaleTimeString(),
          pm25: data[key].pm25 ?? 0,
          temperature: data[key].temperature ?? 0,
          humidity: data[key].humidity ?? 0,
          gas: data[key].gas ?? 0,       
        }));

      setHistoricalData(historyArray);
    });

    return () => unsubscribe();
  }, []);

  // -------------------------
  // ALERT FOR PM2.5
  // -------------------------
  useEffect(() => {
    if (sensorData.pm25 > 55.4) {
      setAlert({ type: 'danger', message: '🔥 Very high PM2.5! Air quality is hazardous.' });
    } else if (sensorData.pm25 >= 35.5) {
      setAlert({ type: 'warning', message: '⚠️ High PM2.5 detected! Air quality is unhealthy.' });
    } else {
      setAlert(null);
    }
  }, [sensorData.pm25]);

  const getPM25Status = (value: number) => {
    if (value <= 35.4) return 'good';
    if (value <= 55.4) return 'warning';
    return 'danger';
  };

  const statusColorClass = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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

        {/* Alerts */}
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* MAIN CONTENT */}
        {page === 'dashboard' ? (
          <div className="space-y-6">

            {/* Device Status */}
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <StatusIndicator status={deviceStatus} />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${statusColorClass(getPM25Status(sensorData.pm25))}`} />
                  <span>Live from Firebase</span>
                </div>
              </div>
            </div>

            {/* Sensor Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-3">
                <SensorCard
                  title="PM2.5"
                  value={Math.round(sensorData.pm25)}
                  unit="μg/m³"
                  icon={Wind}
                  status={getPM25Status(sensorData.pm25)}
                />
              </div>

              {/* Temperature */}
              <SensorCard
                title="Temperature"
                value={Math.round(sensorData.temperature)}
                unit="°C"
                icon={Thermometer}
                status="neutral"
              />

              {/* Humidity */}
              <SensorCard
                title="Humidity"
                value={Math.round(sensorData.humidity)}
                unit="%"
                icon={Droplets}
                status="neutral"
              />

              {/* Gas (MQ-135) */}
              <SensorCard
                title="Gas (MQ-135)"
                value={Math.round(sensorData.gas)}
                unit="ppm"
                icon={Activity}   // pulse icon from lucide-react
                status="neutral"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Historical Data</h2>
              <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              <Chart data={historicalData} dataKey="pm25" color="#3ABCF7" title="PM2.5 Levels" />
              <Chart data={historicalData} dataKey="temperature" color="#f59e0b" title="Temperature" />
              <Chart data={historicalData} dataKey="humidity" color="#06b6d4" title="Humidity" />
              <Chart data={historicalData} dataKey="gas" color="#a855f7" title="Gas Levels (MQ-135)" />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Temp;
