Promtail 安裝：
```
helm upgrade --install promtail grafana/promtail --set "config.clients[0].url=http://<sevicename>/loki/api/v1/push" -f promtail-values.yaml
```

重要參數：
```
# -- Overrides the chart's name
nameOverride: null
# -- Overrides the chart's computed fullname
fullnameOverride: null

daemonset:
  # -- Deploys Promtail as a DaemonSet
  enabled: true

deployment:
  # -- Deploys Promtail as a Deployment
  enabled: false
  
serviceMonitor:
  # -- If enabled, ServiceMonitor resources for Prometheus Operator are created
  enabled: true
  
prometheusRule:
  enabled: true
```