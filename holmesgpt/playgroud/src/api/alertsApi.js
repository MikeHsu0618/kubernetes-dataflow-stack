import axios from 'axios';

// 模擬 Prometheus 告警數據
const mockAlerts = [
  {
    id: '1',
    alertname: 'Service Error Please check Grafana Loki log',
    status: 'firing',
    severity: 'warning',
    summary: 'Service Error Please check Grafana Loki log',
    description: 'Service Error Please check Grafana Loki log',
    startsAt: new Date().toISOString(),
    endsAt: null,
    labels: {
      instance: 'node-1',
      container: "holmes-grafana-1",
      pod: "holmes-grafana-1",
      job: 'node',
      severity: 'warning',
    },
    annotations: {
      summary: 'High CPU usage on node-1',
      description: 'CPU usage is above 80% for more than 5 minutes',
    },
  },
  {
    id: '2',
    alertname: 'HighMemoryUsage',
    status: 'firing',
    severity: 'critical',
    summary: 'High memory usage on node-2',
    description: 'Memory usage is above 90% for more than 10 minutes',
    startsAt: '2023-11-15T09:30:00Z',
    endsAt: null,
    labels: {
      instance: 'node-2',
      job: 'node',
      severity: 'critical',
    },
    annotations: {
      summary: 'High memory usage on node-2',
      description: 'Memory usage is above 90% for more than 10 minutes',
    },
  },
  {
    id: '3',
    alertname: 'PodCrashLooping',
    status: 'firing',
    severity: 'critical',
    summary: 'Pod is crash looping',
    description: 'Pod myapp-pod-1 is crash looping in namespace default',
    startsAt: '2023-11-15T08:45:00Z',
    endsAt: null,
    labels: {
      pod: 'myapp-pod-1',
      namespace: 'default',
      severity: 'critical',
    },
    annotations: {
      summary: 'Pod is crash looping',
      description: 'Pod myapp-pod-1 is crash looping in namespace default',
    },
  },
  {
    id: '4',
    alertname: 'DiskSpaceLow',
    status: 'firing',
    severity: 'warning',
    summary: 'Low disk space on node-3',
    description: 'Disk space is below 10% on node-3',
    startsAt: '2023-11-15T11:15:00Z',
    endsAt: null,
    labels: {
      instance: 'node-3',
      job: 'node',
      severity: 'warning',
    },
    annotations: {
      summary: 'Low disk space on node-3',
      description: 'Disk space is below 10% on node-3',
    },
  },
  {
    id: '5',
    alertname: 'ServiceDown',
    status: 'firing',
    severity: 'critical',
    summary: 'Service is down',
    description: 'Service api-gateway is down in namespace production',
    startsAt: '2023-11-15T10:30:00Z',
    endsAt: null,
    labels: {
      service: 'api-gateway',
      namespace: 'production',
      severity: 'critical',
    },
    annotations: {
      summary: 'Service is down',
      description: 'Service api-gateway is down in namespace production',
    },
  },
];

// 獲取告警列表
export const getAlerts = async () => {
  // 在實際應用中，這裡會調用真實的 API
  // return axios.get('/api/alerts').then(response => response.data);
  
  // 使用模擬數據
  return Promise.resolve(mockAlerts);
};

// 調用 Holmes 進行告警調查
export const investigateAlert = async (alert) => {
  try {
    // 獲取當前時間的 Unix 時間戳（以秒為單位）
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // 設置開始時間為當前時間前 1 小時（3600 秒）
    const startTimestamp = currentTimestamp - 3600;
    
    // 構建 Holmes API 請求，匹配 /api/investigate 的格式
    // const request = {
    //   source: 'prometheus',
    //   source_instance_id: alert.id || 'some-instance',
    //   title: alert.alertname,
    //   description: alert.description || alert.summary,
    //   subject: {
    //     name: alert.labels?.service || alert.labels?.instance || 'unknown',
    //     subject_type: alert.labels?.job ? 'job' : (alert.labels?.pod ? 'pod' : 'deployment'),
    //     namespace: alert.labels?.namespace || 'default',
    //     pod: alert.labels?.pod || null,
    //     container: alert.labels?.container || null,
    //     labels: alert.labels || {},
    //     annotations: alert.annotations || {}
    //   },
    //   context: {
    //     robusta_issue_id: ""
    //   },
    //   include_tool_calls: true,
    //   include_tool_call_results: true
    // };
    
    const request = {
      "source": "prometheus",
      "source_instance_id": "some-instance",
      "title": "APP Error Please check loki logs",
      "description": "Please check loki logs",
      "subject": {
        "name": "holmesgpt-holmesgpt-1",
        "subject_type": "deployment",
        "namespace": "holmesgpt-holmesgpt-1",
        "pod": "holmesgpt-holmesgpt-1",
        "container": "holmesgptlmes-holmesgpt-1",
        "labels": {
          "x": "y",
          "p": "q"
        },
        "annotations": {}
      },
      "context": {
        "robusta_issue_id": "",
        "timestamp": currentTimestamp,  // 添加當前時間戳
        "start_timestamp": startTimestamp.toString(),  // 開始時間（1 小時前）
        "end_timestamp": currentTimestamp.toString()   // 結束時間（當前時間）
      },
      "include_tool_calls": true,
      "include_tool_call_results": true
    }

    // 調用 Holmes API
    const response = await axios.post('/api/investigate', request);
    return response.data;
  } catch (error) {
    console.error('Error investigating alert:', error);
    throw error;
  }
}; 