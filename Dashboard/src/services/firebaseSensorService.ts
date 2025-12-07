// firebaseSensorService.ts
import { db } from "../../firebaseConfig";
import { ref, onValue, set } from "firebase/database";

export interface SensorData {
  pm25: number;
  temperature: number;
  humidity: number;
  gas: number;                 // <-- ADDED
  status: "ON" | "OFF";
}

export const subscribeSensorData = (callback: (data: SensorData) => void) => {
  const sensorRef = ref(db, "airPurifier");

  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    callback({
      pm25: data.pm25 ?? 0,
      temperature: data.temperature ?? 0,
      humidity: data.humidity ?? 0,
      gas: data.gas ?? 0,     
      status: data.status === "ON" ? "ON" : "OFF",
    });
  });

  return unsubscribe;
};

// Update ON/OFF status
export const updateDeviceStatus = (status: "ON" | "OFF") => {
  return set(ref(db, "airPurifier/status"), status);
};
