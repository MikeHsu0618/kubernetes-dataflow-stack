Loki
---


安裝 Loki-Distributed:
```
helm install -f values.yaml loki grafana/loki-distributed
```

安裝 Promtail:
```
helm upgrade --install promtail grafana/promtail --set "config.clients[0].url=http://<sevicename>/loki/api/v1/push" -f promtail-values.yaml
```

安裝 Grafana:
```
helm install grafana grafana/grafana -f grafana-values.yaml
```

TODO：將要修改的參數移到指令修改