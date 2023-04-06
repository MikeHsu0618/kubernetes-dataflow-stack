Loki
---


安裝 Loki-Distributed:
```
helm install --values loki-distributed-values.yaml loki grafana/loki-distributed
```

默認情況下，當table_manager.retention_deletes_enabled或compactor.retention_enabled標誌未設置時，發送到 Loki 的日誌將永遠存在。

安裝 Promtail:
```
helm upgrade --install promtail grafana/promtail --set "config.clients[0].url=http://<sevicename>/loki/api/v1/push" -f promtail-values.yaml
```

安裝 Grafana:
```
helm install grafana grafana/grafana -f grafana-values.yaml
```

重要參數：
```
# -- Overrides the chart's name
nameOverride: null
# -- Overrides the chart's computed fullname
fullnameOverride: null

loki:
    # -- Check https://grafana.com/docs/loki/latest/configuration/#schema_config for more info on how to configure schemas
    schemaConfig:
    configs:
    - from: 2020-09-07
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: loki_index_
        period: 24h
    
    # -- Check https://grafana.com/docs/loki/latest/configuration/#storage_config for more info on how to configure storages
    storageConfig:
    boltdb_shipper:
      shared_store: filesystem
      active_index_directory: /var/loki/index
      cache_location: /var/loki/cache
      cache_ttl: 168h
    filesystem:
      directory: /var/loki/chunks
    # -- Uncomment to configure each storage individually
    #   azure: {}
    #   gcs: {}
    #   s3: {}
    #   boltdb: {}
    
serviceMonitor:
  # -- If enabled, ServiceMonitor resources for Prometheus Operator are created
  enabled: true
  
# Rules for the Prometheus Operator
prometheusRule:
  # -- If enabled, a PrometheusRule resource for Prometheus Operator is created
  enabled: false
  # -- Alternative namespace for the PrometheusRule resource
  namespace: null
  # -- PrometheusRule annotations
  annotations: {}
  # -- Additional PrometheusRule labels
  labels: {}
  # -- Contents of Prometheus rules file
  groups: 
  
# Configuration for the ingester (and other components)
ingester:
  # -- Kind of deployment [StatefulSet/Deployment]
  kind: StatefulSet
  # -- Number of replicas for the ingester
  replicas: 1
  autoscaling:
    # -- Enable autoscaling for the ingester
    enabled: false
# Configuration for the gateway
gateway:
  ingress:
    enabled: true
```