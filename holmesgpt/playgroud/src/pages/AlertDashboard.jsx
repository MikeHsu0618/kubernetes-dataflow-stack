import React, { useState, useEffect } from 'react';
import AlertList from '../components/AlertList';
import AlertDetail from '../components/AlertDetail';
import AnalysisResult from '../components/AnalysisResult';
import Drawer from '../components/Drawer';
import { getAlerts, investigateAlert } from '../api/alertsApi';

function AlertDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 獲取告警列表
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err);
      }
    };

    fetchAlerts();
  }, []);

  // 選擇告警
  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    // 清除之前的分析結果
    setAnalysis(null);
    setError(null);
    // 打開抽屜
    setIsDrawerOpen(true);
  };

  // 關閉抽屜
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // 調查告警
  const handleInvestigate = async () => {
    if (!selectedAlert) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await investigateAlert(selectedAlert);
      setAnalysis(result);
      console.log('Investigation result:', result); // 用於調試
    } catch (err) {
      console.error('Error investigating alert:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Alert Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and investigate alerts with AI assistance
        </p>
      </div>

      <div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">Alerts</h2>
          <p className="mt-1 text-sm text-gray-500">
            {alerts.length} active alerts
          </p>
        </div>
        
        <div className="mt-4">
          <AlertList 
            alerts={alerts} 
            onSelectAlert={handleSelectAlert} 
            selectedAlertId={selectedAlert?.id} 
          />
        </div>
      </div>

      {/* 側邊抽屜 */}
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <div className="space-y-6">
          <AlertDetail 
            alert={selectedAlert} 
            onInvestigate={handleInvestigate} 
            isInvestigating={isLoading} 
          />
          
          <AnalysisResult 
            analysis={analysis} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </Drawer>
    </div>
  );
}

export default AlertDashboard; 