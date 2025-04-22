import { useEffect, useRef, useState } from 'react';

export interface GPSPoint {
  lat: number;
  lon: number;
  ts: number;
}

export function useHikeRecorder() {
  const [recording, setRecording] = useState(false);
  const [points, setPoints] = useState<GPSPoint[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const start = () => {
    if (recording) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setPoints((p: GPSPoint[]) => [
          ...p,
          { lat: coords.latitude, lon: coords.longitude, ts: Date.now() / 1000 },
        ]);
      },
      console.error,
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 6000 },
    );
    watchIdRef.current = id;
    setRecording(true);
  };

  const stop = () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    setRecording(false);
  };

  const reset = () => setPoints([]);

  useEffect(() => () => stop(), []);

  return { recording, points, start, stop, reset };
} 