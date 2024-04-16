Tempo Querier Timeout:
```
server:
  grpc_server_max_recv_msg_size: 10485760  # 10MB
  grpc_server_max_send_msg_size: 10485760  # 10MB
  http_server_read_timeout: 30s
  http_server_write_timeout: 30s

gateway:
  enabled: true
  ingress:
    annotations:
      nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
      nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
  nginxConfig:
    httpSnippet: |-
      proxy_read_timeout 600s;
      proxy_send_timeout 600s;
```

Tempo 2.4 new configuration format:
```
overrides: |
  overrides: 
    "*":
      ingestion:
        burst_size_bytes: 200000000
        rate_limit_bytes: 150000000
      metrics_generator:
        processors:
          - service-graphs
          - span-metrics
          - local-blocks
```