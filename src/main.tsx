import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { FieldNotificationProvider } from './context/FieldNotificationContext.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for offline map tiles and critical disaster data caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available for SIGAP app, updating in background...');
  },
  onOfflineReady() {
    console.log('SIGAP PWA ready: Offline map tiles and disaster data cached for field use.');
  },
});

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <AuthProvider>
      <FieldNotificationProvider>
        <App />
      </FieldNotificationProvider>
    </AuthProvider>
  </LanguageProvider>
);
