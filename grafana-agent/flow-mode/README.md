```
helm upgrade --install grafana-agent-flow grafana/grafana-agent --values values.yaml --values configmap.yaml -n monitoring --create-namespace
```
