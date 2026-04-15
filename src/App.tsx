import React from 'react';
import Sidebar from './components/Sidebar';
import FlywheelPage from './pages/Flywheel';
import ScannerPage from './pages/Scanner';
import ContentPage from './pages/Content';
import BrandPage from './pages/Brand';
import SettingsPage from './pages/Settings';
import { useAppStore } from './store/appStore';

export default function App() {
  const { activeTab } = useAppStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'flywheel': return <FlywheelPage />;
      case 'scanner':  return <ScannerPage />;
      case 'content':  return <ContentPage />;
      case 'brand':    return <BrandPage />;
      case 'settings': return <SettingsPage />;
      default:         return <FlywheelPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
}
