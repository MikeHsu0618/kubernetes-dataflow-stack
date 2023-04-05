Loki
---


安裝 Loki-Distributed:
```
helm install -values loki-distributed-values.yaml loki grafana/loki-distributed

# 設定暴露接口 external <---> gateway
kubectl apply -f loki-service.yaml
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

TODO：將要修改的參數移到指令修改？
