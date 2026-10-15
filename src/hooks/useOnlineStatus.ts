import { useEffect, useState } from 'react';

export interface NetworkConnectionInfo {
  isOnline: boolean;
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number; // Mb/s
  rtt?: number; // ms
  saveData?: boolean;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [connectionInfo, setConnectionInfo] = useState<NetworkConnectionInfo>(() => {
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    return {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      effectiveType: conn?.effectiveType,
      downlink: conn?.downlink,
      rtt: conn?.rtt,
      saveData: conn?.saveData,
    };
  });

  useEffect(() => {
    const updateStatus = () => {
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      setIsOnline(online);

      const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
      const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
      setConnectionInfo({
        isOnline: online,
        effectiveType: conn?.effectiveType,
        downlink: conn?.downlink,
        rtt: conn?.rtt,
        saveData: conn?.saveData,
      });
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return { isOnline, connectionInfo };
}
