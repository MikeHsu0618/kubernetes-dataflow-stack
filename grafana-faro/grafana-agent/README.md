Grafana Agent installation:
```
helm upgrade --install grafana-agent-flow grafana/grafana-agent --values values.yaml --values configmap.yaml -n collector --create-namespace
```