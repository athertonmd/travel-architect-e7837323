
import { useState } from "react";

export function useTimeState(initialTime: string | undefined, defaultHours: string, defaultMinutes: string) {
  const [hours, setHours] = useState<string>(() => {
    if (typeof initialTime === 'string') {
      return initialTime.split(':')[0] || defaultHours;
    }
    return defaultHours;
  });

  const [minutes, setMinutes] = useState<string>(() => {
    if (typeof initialTime === 'string') {
      return initialTime.split(':')[1] || defaultMinutes;
    }
    return defaultMinutes;
  });

  return {
    hours,
    minutes,
    setHours,
    setMinutes
  };
}
