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

設定本地儲存 filesystem：
```
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
```

設定 GCP Bucket ServiceAccount:
```
  # -- Check https://grafana.com/docs/loki/latest/configuration/#schema_config for more info on how to configure schemas
  schemaConfig:
    configs:
    - from: 2020-09-07
      store: boltdb-shipper
      object_store: gcs
      schema: v11
      index:
        prefix: loki_index_
        period: 24h

  # -- Check https://grafana.com/docs/loki/latest/configuration/#storage_config for more info on how to configure storages
  storageConfig:
    boltdb_shipper:
      shared_store: gcs
      active_index_directory: /var/loki/index
      cache_location: /var/loki/cache
      cache_ttl: 168h
    filesystem:
      directory: /var/loki/chunks
    gcs:
      bucket_name: <bucket_name>
      service_account: |
        {
          "type": "service_account",
          "project_id": "your_project_id",
          "private_key_id": "your_private_key_id",
          "private_key": "your_private_key",
          "client_email": "your_client_email",
          "client_id": "your_client_id",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://accounts.google.com/o/oauth2/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "your_client_x509_cert_url"
      }
```

loki.yaml :
```
  server:
    # increase the maximum size of queries
    grpc_server_max_recv_msg_size: 8388608 # 8MB
    grpc_server_max_send_msg_size: 8388608 # 8MB
    # avoid querier timeouts
    http_server_read_timeout: 600s
    http_server_write_timeout: 600s
    
  
  limits_config:
    # set the maximum timeout for queries    
    query_timeout: 5m
  
  # shows "too many outstanding requests"
  # check https://github.com/grafana/loki/issues/5123#issuecomment-1025488801
  query_range:
  split_queries_by_interval: 0
  parallelise_shardable_queries: false

  querier:
    max_concurrent: 2048
  
  frontend:
    max_outstanding_per_tenant: 4096
    compress_responses: true
```

gateway.nginxConfig
```
  nginxConfig:
    file: |
      worker_processes  5;  ## Default: 1
      error_log  /dev/stderr;
      pid        /tmp/nginx.pid;
      worker_rlimit_nofile 8192;

      events {
        worker_connections  4096;  ## Default: 1024
      }

      http {
        client_body_temp_path /tmp/client_temp;
        proxy_temp_path       /tmp/proxy_temp_path;
        fastcgi_temp_path     /tmp/fastcgi_temp;
        uwsgi_temp_path       /tmp/uwsgi_temp;
        scgi_temp_path        /tmp/scgi_temp;

		###################
		# -- Increase the timeouts to avoid 504 errors
		proxy_read_timeout 600s;
		###################
        ...
        }
      }
```

Ruler configuation for loki-distributed:
```
# values.yaml
structuredConfig:
    ruler:
      wal:
				# write the WAL to writable location
        dir: /var/loki/wal
      remote_write:
        enabled: true
        client:
          url: http://sit-prome-prometheus.prome:9090/api/v1/write
      alertmanager_url: http://alertmanager-operated.monitoring:9093
      external_url: http://your-grafana.domin.com

ruler:
  enabled: true
  directories:
		# tenant-id
    standard-cluster-1:
      rule.txt: |
        groups:
          - name: production_rules
            limit: 10
            interval: 1m
            rules:
              - record: demo:AAAA:rate1m
                expr: |
									# group by 可以轉變為 meetric labels
                  sum by(app) (rate({namespace="logging"} [1m]))
              - alert: loki-test-alert
                expr: |
                  sum(rate({namespace=~"logging|monitoring"} [1m])) > 0
                for: 1m
                labels: 
                  severity: critical
```

```
loki:
  schemaConfig:
    configs:
      - from: "2023-10-17"
        index:
          period: 24h
          prefix: loki_index_
        object_store: gcs
        schema: v11
        store: tsdb
  storageConfig:
    boltdb_shipper:
      active_index_directory: /var/loki/index
      cache_location: /var/loki/cache
      cache_ttl: 168h
      shared_store: gcs
    tsdb_shipper:
      active_index_directory: /var/loki/tsdb-index
      cache_location: /var/loki/tsdb-cache
      shared_store: gcs
    gcs:
      bucket_name: prod-loki-logging-bucket
  server:
    grpc_server_max_recv_msg_size: 8388608
    grpc_server_max_send_msg_size: 8388608
    http_listen_port: 3100
    http_server_read_timeout: 300s
    http_server_write_timeout: 300s

  structuredConfig:
    common:
      replication_factor: 1
    auth_enabled: true
    analytics:
      reporting_enabled: false
    compactor:
      shared_store: gcs
      retention_enabled: true
    ingester:
      autoforget_unhealthy: true
      wal:
        checkpoint_duration: 3m
    ingester_client:
      remote_timeout: 10s
    limits_config:
      ingestion_burst_size_mb: 250
      ingestion_rate_mb: 200
      ingestion_rate_strategy: local
      max_streams_per_user: 1000000
      per_stream_rate_limit: 5MB
      query_timeout: 5m
      retention_period: 30d
      retention_stream:
        - selector: '{service=~"access-log|error-log"}'
          period: 2d
      max_global_streams_per_user: 0
      shard_streams:
        enabled: false
        desired_rate: 3MB
    querier:
      max_concurrent: 16
      query_ingesters_within: 1h
    query_scheduler:
      max_outstanding_requests_per_tenant: 32768
    chunk_store_config:
      chunk_cache_config:
        memcached:
          batch_size: 10
          parallelism: 10
        memcached_client:
          timeout: 60s

runtimeConfig:
  overrides:
    tenant1:
      retention_period: 60d
    tenant2:
      retention_period: 7d
```