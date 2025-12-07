export type PM25Status = 'good' | 'warning' | 'danger' | 'neutral';
export type DeviceStatus = 'ON' | 'OFF';
export type AlertType = 'success' | 'warning';
export type TimeRange = '1h' | '24h' | '1d';

export interface SensorData {
  pm25: number;
  temperature: number;
  humidity: number;
}

export interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}
